const Router = require('express')
const router = new Router()

const userRoutes = require('./userRoutes')
const languageRoutes = require('./languageRoutes')
const layoutRoutes = require('./layoutRoutes')
const courseRoutes = require('./courseRoutes')
const lessonRoutes = require('./lessonRoutes')
const exerciseRouter = require('./exerciseRoutes')
const testRoutes = require('./testRoutes')
const typingRoutes = require('./typingRoutes')
const keyboardRoutes = require('./keyboardRoutes')

router.use('/user', userRoutes)
router.use('/language', languageRoutes)
router.use('/layout', layoutRoutes)
router.use('/course', courseRoutes)
router.use('/lesson', lessonRoutes)
router.use('/exercise', exerciseRouter)
router.use('/test', testRoutes)
router.use('/typing', typingRoutes)
router.use('/keyboard', keyboardRoutes)

module.exports = router
