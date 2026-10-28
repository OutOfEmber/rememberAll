const express = require('express')
const app = express()
const crypto = require('crypto')
const { DataTypes, Sequelize } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:', { logging: false })
const PORT = 3000
const PHONE_RU_REGEX = /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/

app.use(express.json())
const cors = require('cors')
app.use(cors())

function normalizedPhoneRU(raw){
    if(typeof raw !== 'string') return null;
    let d = raw.replace(/\D/g,'');
    if(d.startsWith('8'))d = '7' + d.slice(1);
    if(d.length && d[0] !== '7') d = '7' + d;
    if(d.length !== 11) return null;
    return `+7 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7,9)}-${d.slice(9,11)}`
}

const User = sequelize.define('User',{
    phone:{
        type:DataTypes.STRING(18),
        allowNull: false,
        unique:true,
        validate:{
            is:{
                args:PHONE_RU_REGEX,
                msg:'Телефон должен быть в формате +7 (999) 123-45-67'
            }
        }
    }
},{
    tableName:'users',
    timestamps:true
})

module.exports = {User}

app.post('/users',async (req,res)=>{
    const normalized = normalizedPhoneRU(req.body.phone);

    if(!normalized || !PHONE_RU_REGEX.test(normalized) ){
        return res.status(400).json({error:'Неверный номер телефона'})
    }
    try{
        const newUser = await User.create({ phone: normalized });
        return res.status(201).json(newUser);
    }catch(err){
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Этот номер телефона уже зарегистрирован' });
        }
        return res.status(500).json({ error: 'Ошибка сервера при сохранении' });
    }
})

//////////////////////////////////////////////////
function generatedTag(data){
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hax')
}

const todo = [
    {id:1 , description:'cheto1'},
    {id:2 , description:'cheto2'},
    {id:3 , description:'cheto3'}
]
let nextId = 4

app.post('/todo',(req,res)=>{
    const data = req.body
    todo.push({
        id:nextId++,
        ...data
    })
    return res.status(201).json({message: `Created new todo: ${JSON.stringify(data)}`})
})

app.get('/todo', (req,res)=>{
    const data = todo;
    const etag = geteratedTag(data)
    const lastModified = new Date().toUTCString();
})

const start = async ()=>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT ,() => console.log(`Server running on ${PORT}`));
    }catch(e){
        console.log(e)
    }
}

start()