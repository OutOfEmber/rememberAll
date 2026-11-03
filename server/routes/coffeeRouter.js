const Router = require('express')
const router = new Router()
const controller = require('../controllers/coffeeController')

router.post('/',controller.create)
router.get('/',controller.getAll)
router.get('/:id',controller.getById)

module.exports = router