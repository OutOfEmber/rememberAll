const API_URL = 'http://localhost:5000/api';

const authSection = document.getElementById('auth-section');
const userSection = document.getElementById('user-section');
const coffeeSection = document.getElementById('coffee-section');
const coffeeList = document.getElementById('coffee-list');

function normalizedPhoneRU(raw){
    if(typeof raw !== 'string') return null;
    let d = raw.replace(/\D/g,'');
    if(d.startsWith('8'))d = '7' + d.slice(1);
    if(d.length && d[0] !== '7') d = '7' + d;
    if(d.length !== 11) return null;
    return `+7 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7,9)}-${d.slice(9,11)}`
}
const phoneInput = document.getElementById('reg-phone');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let raw = e.target.value;

        let digits = raw.replace(/\D/g, '');

        if (digits.length > 11) {
            digits = digits.slice(0, 11);
        }
        if (digits.startsWith('8')) {
            digits = '7' + digits.slice(1);
        } else if (digits.length > 0 && digits[0] !== '7') {
            digits = '7' + digits;
        }

        let formatted = '';
        if (digits.length > 0) {
            formatted += '+7';
            if (digits.length > 1) {
                formatted += ' (' + digits.slice(1, 4);
            }
            if (digits.length > 4) {
                formatted += ') ' + digits.slice(4, 7);
            }
            if (digits.length > 7) {
                formatted += '-' + digits.slice(7, 9);
            }
            if (digits.length > 9) {
                formatted += '-' + digits.slice(9, 11);
            }
        }

        e.target.value = formatted;
    });
}


function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        authSection.classList.add('hidden');
        userSection.classList.remove('hidden');
    } else {
        authSection.classList.remove('hidden');
        userSection.classList.add('hidden');
        coffeeSection.classList.add('hidden');
    }
}

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const phone = document.getElementById('reg-phone').value;
    
    try {
        const response = await fetch(`${API_URL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, phone })
        });
        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            checkAuth();
        } else { alert(data.message || 'Ошибка регистрации'); }
    } catch (err) { console.error(err); }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const phone = document.getElementById('reg-phone').value;

    try {
        const response = await fetch(`${API_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, phone })
        });
        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            checkAuth();
        } else { alert(data.message || 'Неверный логин или пароль'); }
    } catch (err) { console.error(err); }
});

document.getElementById('show-coffee-btn').addEventListener('click', async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/coffee`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 401 || response.status === 403) {
            alert('Сессия истекла или нет доступа');
            localStorage.removeItem('token');
            return checkAuth();
        }

        let coffees = await response.json();
        
        console.log('Ответ от сервера:', coffees);

        if (coffees && coffees.rows) {
            coffees = coffees.rows;
        }

        if (!Array.isArray(coffees)) {
            alert(coffees.message || 'Сервер вернул некорректные данные');
            return;
        }
        
        coffeeList.innerHTML = coffees.map(item => `
            <div class="coffee-card">
                <h4>${item.name}</h4>
                <p>Цена: ${item.price} руб.</p>
            </div>
        `).join('');
        
        coffeeSection.classList.remove('hidden');
    } catch (err) { 
        console.error('Критическая ошибка на фронтенде:', err); 
    }
});


document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    checkAuth();
});

checkAuth();
