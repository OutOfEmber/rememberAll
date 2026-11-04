const Router = require('express')
const router = new Router()
const controller = require('../controllers/typeController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',checkRole('ADMIN'), controller.create)
router.get('/',controller.read)
router.put('/',checkRole('ADMIN'), controller.update)
router.delete('/',checkRole('ADMIN'), controller.delete)

module.exports = router