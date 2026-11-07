const Router = require('express')
const router = new Router()
const controller = require('../controllers/coffeeInfoController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/',controller.read)
router.put('/:id',checkRole('ADMIN'), controller.update)
router.delete('/:id',checkRole('ADMIN'), controller.delete)
router.get('/:id',controller.getById)

module.exports = router