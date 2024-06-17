const Router = require('express')
const router = new Router()
const exerciseController = require('../controllers/exerciseController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), exerciseController.add)
router.get('/lesson/:id', exerciseController.getExercisesByLessonId)
router.get('/', exerciseController.getAll)
router.patch('/:id', checkRole('ADMIN'), exerciseController.update)
router.delete('/:id', checkRole('ADMIN'), exerciseController.delete)

module.exports = router
