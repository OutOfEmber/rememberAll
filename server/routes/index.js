const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const coffeeRouter = require('./coffeeRouter')

router.use('/users',userRouter)
router.use('/coffee',coffeeRouter)

module.exports = router