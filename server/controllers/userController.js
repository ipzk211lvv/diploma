const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const {Users, UserExercises, Progress, Courses, TestProgress, Keyboards} = require("../models/models");
const bcript = require("bcrypt");
const {DataTypes} = require("sequelize");

const generateJWT = (id, username, email, role, courseId, lastExerciseId, showKeyboard) => {
    return jwt.sign({
        id,
        username,
        email,
        role,
        courseId,
        lastExerciseId,
        showKeyboard
    }, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserController {
    async registration(req, res, next) {
        try {
            const {username, email, password} = req.body

            if (!email || !password) {
                return next(ApiError.badRequest("Невірний email або пароль"))
            }

            const candidate = await Users.findOne({where: {email}})

            if (candidate) {
                return next(ApiError.internal("Користувач з таким email вже існує"))
            }
            const hashPassword = await bcript.hash(password, 3)
            const user = await Users.create({username, email, password: hashPassword})

            const token = generateJWT(user.id, user.username, user.email, user.role, user.courseId, user.lastExerciseId, user.showKeyboard)

            return res.json({token})
        } catch (error) {
            return next(ApiError.internal(`Помилка про реєстрації ${error}`))
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body

            if (!email || !password) {
                return next(ApiError.badRequest("Невірний email або пароль"))
            }

            const user = await Users.findOne({where: {email}})

            if (!user) {
                return next(ApiError.internal("Користовача з таким email не знайдено"))
            }

            let comparePassword = bcript.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal("Невірний пароль"))
            }
            const token = generateJWT(user.id, user.username, user.email, user.role, user.courseId, user.lastExerciseId, user.showKeyboard)
            return res.json({token})
        } catch (error) {
            return next(ApiError.internal("Помилка про авторизації"))
        }
    }

    async check(req, res, next) {
        const token = generateJWT(req.user.id, req.user.username, req.user.email, req.user.role, req.user.courseId, req.user.lastExerciseId, req.user.showKeyboard)
        return res.json({token})
    }

    async updateNewCourse(req, res, next) {
        const {id} = req.params
        const {courseId} = req.body

        try {
            const user = await Users.findByPk(id)

            user.courseId = courseId
            await user.save()

            const token = generateJWT(user.id, user.username, user.email, user.role, user.courseId, user.lastExerciseId, user.showKeyboard)
            return res.json({token})
        } catch (error) {
            return next(ApiError.internal(`err`))
        }
    }


    async addCompletedExercise(req, res, next) {
        const {id} = req.params
        const {courseId, lessonId, exerciseId, star, target, lightning} = req.body

        try {
            const progress = await Progress.findOne({
                where: {
                    userId: id,
                    courseId,
                    lessonId,
                    exerciseId
                }
            })

            if (progress) {
                if (!progress.star && star) progress.star = true;
                if (!progress.target && target) progress.target = true;
                if (!progress.lightning && lightning) progress.lightning = true;
                await progress.save();
                return res.json(progress);
            }

            const newProgress = await Progress.create({
                userId: id, courseId, lessonId, exerciseId, star, target, lightning
            })
            return res.json(newProgress)
        } catch (err) {
            return next(ApiError.internal('Помилка при додавані виконаного звдання'))
        }
    }

    async addCompletedTest(req, res, next) {
        const {id} = req.params;
        const {courseId, speed, target} = req.body;

        console.log(courseId, speed, target)

        try {
            const floatTarget = parseFloat(target).toFixed(1)
            const newProgress = await TestProgress.create({userId: id, courseId, speed, target: floatTarget});

            const count = await TestProgress.count({
                where: {userId: id, courseId}
            });

            if (count > 50) {
                const excessRecords = await TestProgress.findAll({
                    where: {userId: id, courseId},
                    order: [['createdAt', 'ASC']],
                    limit: count - 50
                });

                const excessRecordIds = excessRecords.map(record => record.id);

                await TestProgress.destroy({
                    where: {
                        id: excessRecordIds
                    }
                });
            }

            return res.json(newProgress);
        } catch (err) {
            console.log(err)
            return next(ApiError.internal('Помилка при додавані звдання'));
        }
    }

    async getUserStats(req, res, next) {
        const {id} = req.params;
        const {courseId} = req.query

        const result = {}
        try {
            result.course = await Courses.findByPk(courseId, {
                include: [{ model: Keyboards, as: 'keyboard' }]
            });

            result.tests = await TestProgress.findAll({
                where: {userId: id, courseId},
                order: [['createdAt', 'DESC']],
                raw: true
            });

            result.tests = result.tests.map(test => {
                const { speed, target } = test;
                const certificate = determineCertificate(speed, target);
                return { ...test, certificate };
            });

            return res.json(result);
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Помилка при додавані звдання'));
        }
    }


    async getProgressByCourse(req, res, next) {
        const {id, courseId} = req.body

        if (!id) {
            return next(ApiError.badRequest("Не заданий id користовача"))
        }

        const progress = await Progress.findAll({where: {userId: id, courseId}})

        if (!progress) {
            return next(ApiError.internal("Користувач не почав проходити курс"))
        }

        return res.json(progress)
    }

    async updateLastExerciseId(req, res, next) {
        const {id} = req.params
        const {lastExerciseId} = req.body;
        try {
            const user = await Users.findByPk(id);

            if (!user) {
                return next(ApiError.badRequest(`Користовача з ID: ${id} не існує`));
            }

            user.lastExerciseId = lastExerciseId;

            await user.save();
            return res.json(user)
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені користовача'))
        }
    }

    async createUserExercise(req, res, next) {
        const {id} = req.params
        const {name, text} = req.body;
        try {
            const newExercise = await UserExercises.create({userId: id, name, text});
            return res.json(newExercise)
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені користовача'))
        }
    }

    async getUserExercises(req, res, next) {
        const {id} = req.params
        try {
            console.log(UserExercises)
            const exercises = await UserExercises.findAll({where: {userId: id}});
            console.log(exercises)
            return res.json(exercises)
        } catch (error) {
            console.log(error)
            return next(ApiError.internal('Помилка при отримані завдань'))
        }
    }

    async updateUserExercises(req, res, next) {
        const {id} = req.params
        const {name, text} = req.body;
        try {
            const exercise = await UserExercises.findByPk(id);

            if (!exercise) {
                return next(ApiError.internal(`Завдання з ID: ${id} не знайдено`));
            }

            exercise.name = name;
            exercise.text = text;
            await exercise.save();
            return res.json(exercise)
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені користовача'))
        }
    }

    async deleteUserExercises(req, res, next) {
        const {id} = req.params
        try {
            const exercise = await UserExercises.findByPk(id);
            exercise.destroy()
            return res.json({message: `Завдання ${exercise.name} успішно видалене`});
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені користовача'))
        }
    }

    async delete(req, res) {

    }
}

function determineCertificate(speed, target) {
    if (speed >= 350 && target >= 99.5) {
        return 'platinum';
    } else if (speed >= 250 && target >= 98.7) {
        return 'gold';
    } else if (speed >= 200 && target >= 96) {
        return 'silver';
    } else {
        return null
    }
}

module.exports = new UserController()
