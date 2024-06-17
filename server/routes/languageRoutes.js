const Router = require('express')
const router = new Router()
const languageController = require('../controllers/languageController')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/', checkRole('ADMIN'), languageController.add)
router.get('/', languageController.getAll)
router.patch('/:id', checkRole('ADMIN'), languageController.update)
router.delete('/:id', checkRole('ADMIN'), languageController.delete)

module.exports = router
