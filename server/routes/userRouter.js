const Router = require('express')
const router = new Router()
const controller = require('../controllers/userController')

router.post('/register',controller.registration)
router.post('/login',controller.login)
router.get('/auth',controller.check)

module.exports = router