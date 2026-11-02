const Router = require('express')
const router = new Router()

router.post('/register',(req,res)=>{return res.status(200)})
router.post('/login',(req,res)=>{return res.status(200)})
router.get('/auth',(req,res)=>{return res.status(200)})

module.exports = router