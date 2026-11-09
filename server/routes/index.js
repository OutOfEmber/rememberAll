const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const coffeeRouter = require('./coffeeRouter')
const typeRouter = require('./typeRouter')

router.use('/user',userRouter)
router.use('/coffee',coffeeRouter)
router.use('/type',typeRouter)

module.exports = router