const Router = require('express')
const router = new Router()
const courseController = require('../controllers/courseController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), courseController.add)
router.get('/', courseController.getAll)

router.get('/details', courseController.getCourseDetails)
router.get('/:id', courseController.getOne)


router.patch('/:id', checkRole('ADMIN'), courseController.update)
router.delete('/:id', checkRole('ADMIN'), courseController.delete)

module.exports = router
