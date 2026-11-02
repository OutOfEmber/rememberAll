const Router = require('express')
const router = new Router()

router.post('/',(req,res)=>{return res.status(200)})
router.get('/',(req,res)=>{return res.status(200)})
router.get('/:id',(req,res)=>{return res.status(200)})

module.exports = router