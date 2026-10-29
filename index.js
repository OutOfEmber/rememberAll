const express = require('express')
const app = express()
const crypto = require('crypto')
const cors = require('cors')
const PORT = 3000;

app.use(express.json())
app.use(cors())

function generatedTag(data){
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')
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
    const etag = generatedTag(data)
    const lastModified = new Date().toUTCString()

    res.setHeader('Cache-Control','private','max-age-600')
    res.setHeader('ETag',etag)
    res.setHeader('Last-Modified',lastModified)

    const clientTag = req.headers['if-none-match']
    const clientLastModified = req.headers['if-modified-since']

    if(clientTag === etag || clientLastModified === lastModified){
        return res.status(304).end()
    }
    res.json(data)
})



const start = async ()=>{
    try{
        app.listen(PORT ,() => console.log(`Server running on ${PORT}`));
    }catch(e){
        console.log(e)
    }
}

start()