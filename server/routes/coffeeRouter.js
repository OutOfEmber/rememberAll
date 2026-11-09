const Router = require('express')
const router = new Router()
const controller = require('../controllers/coffeeController')
const checkRole = require('../middleware/checkRoleMiddleware')
const checkAuth = require('../middleware/authMiddleware')

router.post('/',checkRole('ADMIN'), controller.create)
router.get('/',checkAuth,controller.read)
router.put('/:id',checkRole('ADMIN'), controller.update)
router.delete('/:id',checkRole('ADMIN'), controller.delete)
router.get('/:id',controller.getById)

module.exports = router