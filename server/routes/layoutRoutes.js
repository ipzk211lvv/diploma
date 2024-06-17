const Router = require('express')
const router = new Router()
const layoutController = require('../controllers/layoutController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), layoutController.add)
router.get('/', layoutController.getAll)
router.patch('/:id', checkRole('ADMIN'), layoutController.update)
router.delete('/:id', checkRole('ADMIN'), layoutController.delete)

module.exports = router
