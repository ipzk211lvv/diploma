const {Lessons} = require('../models/models')
const ApiError = require('../error/ApiError')

class LessonController {
    async add(req, res, next) {
        try {
            const {courseId, name} = req.body

            if (!courseId || !name) {
                return next(ApiError.badRequest(`Неверно задані параметри`));
            }

            const lesson = await Lessons.create({courseId, name})
            return res.json(lesson)
        } catch (error) {
            return next(ApiError.internal('Помилка при додаванні нового уроку'))
        }
    }

    async getAll(req, res, next) {
        try {
            const lessons = await Lessons.findAll()
            return res.json(lessons)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані уроків'))
        }
    }

    async getLessonsByCourseId(req, res, next) {
        try {
            const {courseId} = req.params

            if (!courseId) {
                return next(ApiError.badRequest('Не заданий id курсу'))
            }

            const lessons = await Lessons.findAll({where: {courseId}, order: [['orderId', 'ASC']]})
            return res.json(lessons)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані уроків по розкладці'))
        }
    }

    async update(req, res, next) {
        const {id} = req.params
        const {orderId, courseId, name} = req.body
        try {
            // if

            const lesson = await Lessons.findByPk(id);

            if (!lesson) {
                return next(ApiError.internal(`Урока з ID: ${id} не знайдено`));
            }

            lesson.orderId = orderId;
            lesson.courseId = courseId;
            lesson.name = name;
            await lesson.save();
            return res.json(lesson)
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені уроку'))
        }
    }

    async delete(req, res, next) {
        const {id} = req.params
        try {
            if (!id) {
                return next(ApiError.badRequest('Не заданий ID'))
            }

            const lesson = await Lessons.findByPk(id)

            if (!lesson) {
                return next(ApiError.internal(`Уроку з ID: ${id} не існує`))
            }

            await lesson.destroy()
            return res.json({message: `Урок ${lesson.name} успішно видалена`});
        } catch (error) {
            return next(ApiError.internal('Помилка при видаленні уроку'))
        }
    }
}

module.exports = new LessonController()
