require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(':memory:', (err) => {
    if (err) return console.error(err.message);
    
    db.serialize(() => {
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )`);

        db.run(`CREATE TABLE people (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            city TEXT
        )`);

        const stmt = db.prepare(`INSERT INTO people (name, city) VALUES (?, ?)`);
        stmt.run('Иван', 'Москва');
        stmt.run('Тимофей', 'Москва');
        stmt.run('Владимир', 'Москва');
        stmt.finalize();
    });
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Доступ запрещен' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Невалидный токен' });
        }
        req.user = user;
        next();
    });
}

// МАРШРУТ РЕГИСТРАЦИИ
app.post('/auth/register', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Заполните все поля' });
    }

    // Чистим данные от случайных пробелов и приводим к одному регистру
    email = email.trim().toLowerCase();
    password = password.trim();

    if (password.length < 6) {
        return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({ error: 'Email/Логин уже занят' });
                }
                return res.status(500).json({ error: 'Ошибка базы данных' });
            }
            console.log(`[УСПЕХ] Зарегистрирован: ${email}`);
            res.status(201).json({ id: this.lastID, email });
        });
    } catch {
        res.status(500).json({ error: 'Ошибка сервера при хешировании' });
    }
});

// МАРШРУТ АВТОРИЗАЦИИ
app.post('/auth/login', (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    console.log(`[ПОПЫТКА ВХОДА] Ищем пользователя: ${email}`);

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            console.log('[ОШИБКА БД]', err.message);
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        
        if (!user) {
            console.log(`[ОТКАЗ] Пользователь ${email} не найден в базе данных`);
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log(`[ОТКАЗ] Неверный пароль для пользователя ${email}`);
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        console.log(`[УСПЕХ] Пользователь ${email} успешно вошел`);
        res.json({ token });
    });
});



app.get('/people', authenticateToken, (req, res) => {
    db.all(`SELECT id, name, city FROM people`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
