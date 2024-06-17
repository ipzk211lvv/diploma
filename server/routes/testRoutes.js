const Router = require('express')
const router = new Router()
const testController = require('../controllers/testController')

router.post('/', testController.add)
router.get('/course/:id', testController.getTestsByCourseId)
router.get('/', testController.getAll)
router.patch('/:id', testController.update)
router.delete('/', testController.delete)

module.exports = router

