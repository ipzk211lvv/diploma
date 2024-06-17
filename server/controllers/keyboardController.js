const {Keyboards, Lessons, Languages, Layouts} = require('../models/models')
const ApiError = require('../error/ApiError')

class KeyboardController {
    async add(req, res, next) {
        const {languageId, layoutId, keyboard} = req.body
        try {
            if (!languageId || !layoutId || !keyboard) {
                return next(ApiError.badRequest(`Неверно задані параметри`));
            }
            const newKeyboard = await Keyboards.create({languageId, layoutId, keyboard})

            return res.json(newKeyboard)
        } catch (error) {
            return next(ApiError.internal('Помилка при додаванні нової мови'))
        }
    }

    async getAll(req, res, next) {
        try {
            const keyboards = await Keyboards.findAll({
                include: [
                    {
                        model: Languages,
                        as: 'language',
                    },
                    {
                        model: Layouts,
                        as: 'layout',
                    },
                ],
            })
            return res.json(keyboards)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані мов'))
        }
    }

    async update(req, res, next) {
        const {id} = req.params
        const {languageId, layoutId, keyboard} = req.body

        try {
            const updateKeyboard = await Keyboards.findByPk(id);

            if (!keyboard) {
                return next(ApiError.internal(`keyboard з ID: ${id} не існує`));
            }

            updateKeyboard.languageId = languageId;
            updateKeyboard.layoutId = layoutId;
            updateKeyboard.keyboard = keyboard;
            await updateKeyboard.save();
            return res.json(updateKeyboard)
        } catch (error) {
            console.log(error)
            return next(ApiError.internal(`Помилка при оновлені мови ${error}`))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params

            if (!id) {
                return next(ApiError.badRequest('Не заданий ID'))
            }

            const keyboard = await Keyboards.findByPk(id)

            if (!keyboard) {
                return next(ApiError.internal(`Мови з ID: ${id} не існує`))
            }

            await keyboard.destroy()
            return res.json({message: 'Мова успішно видалена'});
        } catch (error) {
            return next(ApiError.internal('Помилка при видаленні мови'))
        }
    }
}

module.exports = new KeyboardController()
