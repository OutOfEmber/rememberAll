// const PHONE_RU_REGEX = /^8\(\d{3}\)\d{3}\-\d{2}\-\d{2}$/
// //d - digit 
// //d{n} - кол-во цифр n
// console.log(
//     PHONE_RU_REGEX.test('8(999)999-99-99')
// );

// const str = 'asdasdasfasd78534534923'
// const reg = /\D/g //очистка строки от букв и оставление цифр

// console.log(str.replace(reg,''));
/////////////////////////////////////////////////



function extraDigits(value){
    let digits = value.replace(/\D/g, '')

    if(digits.startsWith('8'))digits = '7' + digits.slice(1)
    if(digits.length > 0 && digits[0] !== '7') digits = '7' + digits
    
    return digits.slice(0,11)
}


function formatPhoneRU(digits){
    const d = digits.slice(1)
    let out = "+7"

    if(d.length > 0)out +=' (' + d.slice(0,3);
    if(d.length >= 3)out +=')';
    if(d.length > 3)out +=' ' + d.slice(3,6);
    if(d.length > 6)out +='-' + d.slice(6,8);
    if(d.length > 8)out +='-' + d.slice(8,10);

        return out; 
}

const input = document.getElementById('phone')
const errorEl = document.getElementById('phoneError')

input.addEventListener('input', (e)=>{
    const digits = e.target.value.replace(/\D/g,'').slice(0,11)

    let normalized = digits.startsWith('8') ? '7' + digits.slice(1): digits
    if(normalized.length > 0 && normalized[0] !== '7') normalized = '7' + normalized

    e.target.value = formatPhoneRU(normalized)
})

const PHONE_RU_REGEX = /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/

document.getElementById('phoneForm').addEventListener('submit', async (e)=>{
    e.preventDefault();

    errorEl.textContent = '';
    
    const value = input.value.trim();

    if(!PHONE_RU_REGEX.test(value)){
        errorEl.textContent = 'Введите номер в формате +7 (999) 123-45-67';
        input.focus();
        return;
    }

    const res = await fetch('http://localhost:3000/users',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({phone:value})
    });

    if(!res.ok){
        const data = await res.json().catch(()=>({}));
        errorEl.textContent = data.error || 'Ошибка сервера';
    }else{
        errorEl.style.color = 'green'
        errorEl.textContent = 'Успешно создано'
    }
})




