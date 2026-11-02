const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const coffeeRouter = require('./coffeeRouter')

router.use('/user',userRouter)
router.use('/coffee',coffeeRouter)

module.exports = router