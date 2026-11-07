const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const coffeeRouter = require('./coffeeRouter')
const coffeeInfoRouter = require('./coffeeInfoRouter')
const typeRouter = require('./typeRouter')

router.use('/users',userRouter)
router.use('/coffee',coffeeRouter)
router.use('/info',coffeeInfoRouter)
router.use('/type',typeRouter)

module.exports = router