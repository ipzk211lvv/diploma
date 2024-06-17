const {Languages} = require('../models/models')
const ApiError = require('../error/ApiError')

class LanguageController {
    async add(req, res, next) {
        const {name} = req.body

        try {
            if (!name) {
                return next(ApiError.badRequest(`Не задана мова`));
            }
            const languages = await Languages.create({name})

            return res.json(languages)
        } catch (error) {
            return next(ApiError.internal('Помилка при додаванні нової мови'))
        }
    }

    async getAll(req, res, next) {
        try {
            const languages = await Languages.findAll()
            return res.json(languages)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані мов'))
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
                return next(ApiError.badRequest(`Не задана мова`))
            }

            const language = await Languages.findByPk(id);

            if (!language) {
                return next(ApiError.internal(`Мови з ID: ${id} не існує`));
            }

            language.name = name;
            await language.save();
            return res.json(language)
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені мови'))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params

            if (!id) {
                return next(ApiError.badRequest('Не заданий ID'))
            }

            const language = await Languages.findByPk(id)

            if (!language) {
                return next(ApiError.internal(`Мови з ID: ${id} не існує`))
            }

            await language.destroy()
            return res.json({message: 'Мова успішно видалена'});
        } catch (error) {
            return next(ApiError.internal('Помилка при видаленні мови'))
        }
    }
}

module.exports = new LanguageController()
