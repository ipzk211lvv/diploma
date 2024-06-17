const Router = require('express')
const router = new Router()
const lessonController = require('../controllers/lessonController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), lessonController.add)
router.get('/', lessonController.getAll)
router.get('/:courseId', lessonController.getLessonsByCourseId)
router.patch('/:id', checkRole('ADMIN'), lessonController.update)
router.delete('/:id', checkRole('ADMIN'), lessonController.delete)

module.exports = router
