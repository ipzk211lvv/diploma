const Router = require('express')
const router = new Router()
const keyboardController = require('../controllers/keyboardController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), keyboardController.add)
router.get('/', keyboardController.getAll)
router.patch('/:id', checkRole('ADMIN'), keyboardController.update)
router.delete('/:id', checkRole('ADMIN'), keyboardController.delete)

module.exports = router
