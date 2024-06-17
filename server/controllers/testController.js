const {Tests} = require('../models/models')
const ApiError = require('../error/ApiError')

class TestController {
    async add(req, res, next) {
        const {courseId, text} = req.body
        try {

            const test = await Tests.create({courseId, text})
            return res.json(test)
        } catch (error) {
            return next(ApiError.internal('Помилка при додаванні нового тесту'))
        }
    }

    async getAll(req, res, next) {
        try {
            const tests = await Tests.findAll()
            return res.json(tests)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані тестів'))
        }
    }

    async getTestsByCourseId(req, res, next) {
        const {id} = req.params
        try {
            if (!id) {
                return next(ApiError.badRequest('Не заданий id курсу'))
            }

            const tests = await Tests.findAll({where: {courseId: id}})
            return res.json(tests)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані тестів по курсу'))
        }
    }

    async update(req, res, next) {
        const {id} = req.params
        const {courseId, text} = req.body
        try {

            const test = await Tests.findByPk(id);

            if (!test) {
                return next(ApiError.internal(`Теста з ID: ${id} не знайдено`));
            }

            test.courseId = courseId;
            test.text = text;
            await test.save();
            return res.json(test)
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені тесту'))
        }
    }

    async delete(req, res, next) {
        const {id} = req.params

        try {
            if (!id) {
                return next(ApiError.badRequest('Не заданий ID'))
            }

            const test = await Tests.findByPk(id)

            if (!test) {
                return next(ApiError.internal(`Уроку з ID: ${id} не існує`))
            }

            await test.destroy()
            return res.json({message: `Тест успішно видалена`});
        } catch (error) {
            return next(ApiError.internal('Помилка при видаленні тесту'))
        }
    }
}

module.exports = new TestController()
