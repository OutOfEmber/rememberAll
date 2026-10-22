const API_URL = 'http://localhost:3000';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const loadPeopleBtn = document.getElementById('loadPeopleBtn');
const logoutBtn = document.getElementById('logoutBtn');
const output = document.getElementById('output');

const regError = document.getElementById('regError');
const loginError = document.getElementById('loginError');
const peopleError = document.getElementById('peopleError');

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        logoutBtn.style.display = 'inline-block';
    } else {
        logoutBtn.style.display = 'none';
        output.style.display = 'none';
    }
}

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    regError.textContent = '';
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.status === 201) {
            alert('Успех');
            registerForm.reset();
        } else {
            regError.textContent = data.error || 'Ошибка регистрации';
        }
    } catch {
        regError.textContent = 'Ошибка соединения с сервером';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            localStorage.setItem('token', data.token);
            loginForm.reset();
            checkAuth();
            peopleError.textContent = '';
            alert('Вы вошли!');
        } else {
            loginError.textContent = data.error || 'Ошибка авторизации';
        }
    } catch {
        loginError.textContent = 'Ошибка соединения с сервером';
    }
});


loadPeopleBtn.addEventListener('click', async () => {
    peopleError.textContent = '';
    output.style.display = 'none';
    
    const token = localStorage.getItem('token');

    if (!token) {
        peopleError.textContent = 'Ошибка: Доступ запрещен. Сначала авторизуйтесь';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/people`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            output.textContent = JSON.stringify(data, null, 2);
            output.style.display = 'block';
        } else {
            peopleError.textContent = data.error || 'Не удалось загрузить данные';
        }
    } catch {
        peopleError.textContent = 'Ошибка соединения с сервером';
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    checkAuth();
});

checkAuth();
