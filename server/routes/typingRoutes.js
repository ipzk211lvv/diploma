const Router = require('express')
const router = new Router()
const testController = require('../controllers/testController')
const exerciseController = require("../controllers/exerciseController");

router.get('/test', testController.getTestsByCourseId)
router.get('/last/:userId', exerciseController.getLastExercise)
router.get('/next/:id', exerciseController.getNextExercise)

module.exports = router

