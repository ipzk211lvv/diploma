const {Layouts} = require('../models/models')
const ApiError = require('../error/ApiError')

class LayoutController {
    async add(req, res, next) {
        try {
            const {name} = req.body

            if (!name) {
                return next(ApiError.badRequest(`Не задана назва розкладки`));
            }

            const layouts = await Layouts.create({name})
            return res.json(layouts)
        } catch (error) {
            return next(ApiError.internal('Помилка при додаванні нової розкладки'))
        }
    }

    async getAll(req, res, next) {
        try {
            const layouts = await Layouts.findAll()
            return res.json(layouts)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані розкладок'))
        }
    }

    async update(req, res, next) {
        const {id} = req.params
        const {name} = req.body

        try {
            if (!id) {
                return next(ApiError.badRequest(`Не заданий ID`))
            }
            if (!name) {
                return next(ApiError.badRequest(`Не задане нова назва розкладки`))
            }

            const layout = await Layouts.findByPk(id);

            if (!layout) {
                return next(ApiError.internal(`Розкладки з ID: ${id} не існує`));
            }

            layout.name = name;
            await layout.save();
            return res.json(layout)
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені розкладки'))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params

            if (!id) {
                return next(ApiError.badRequest('Не заданий ID'))
            }

            const layout = await Layouts.findByPk(id)

            if (!layout) {
                return next(ApiError.internal(`Layout з ID: ${id} не існує`))
            }

            await layout.destroy()
            return res.json({message: 'Розкладка успішно видалена'});
        } catch (error) {
            return next(ApiError.internal('Помилка при видаленні розкладки'))
        }
    }
}

module.exports = new LayoutController()
