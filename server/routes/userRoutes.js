const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require("../middleware/checkRoleMiddleware");


router.post('/registration', userController.registration)
router.post('/login', userController.login)

router.get('/auth', authMiddleware, userController.check)
router.delete('/delete', checkRole('ADMIN'), userController.delete)

router.get('/progress', userController.getProgressByCourse)

router.post('/new-course/:id', userController.updateNewCourse)
router.post('/add-progress/:id', userController.addCompletedExercise)

router.post('/add-progress-test/:id', userController.addCompletedTest)
router.get('/result/:id', userController.getUserStats)


router.get('/exercise/:id', userController.getUserExercises)
router.post('/exercise/:id', userController.createUserExercise)
router.patch('/exercise/:id', userController.updateUserExercises)
router.delete('/exercise/:id', userController.deleteUserExercises)

module.exports = router
