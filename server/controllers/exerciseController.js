const {Exercises, Lessons, Courses, Languages, Layouts, Users, Progress} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require("sequelize");

class ExerciseController {
    async add(req, res, next) {
        try {
            const {lessonId, name, string, speedLimit, errorLimit, active} = req.body

            const exercise = await Exercises.create({lessonId, name, string, speedLimit, errorLimit, active})
            return res.json(exercise)
        } catch (error) {
            return next(ApiError.internal('Помилка при додаванні нового завдання'))
        }
    }

    async getAll(req, res, next) {
        try {
            const exercises = await Exercises.findAll()
            return res.json(exercises)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані завдань'))
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params
        try {
            const exercise = await Exercises.findByPk(id)
            return res.json(exercise)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані завдань'))
        }
    }

    async getExercisesByLessonId(req, res, next) {
        const {id} = req.params

        try {
            if (!id) {
                return next(ApiError.badRequest('Не заданий id завдання'))
            }

            const exercises = await Exercises.findAll({where: {lessonId: id}, order: [['orderId', 'ASC']]})
            return res.json(exercises)
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані завдань з уроку'))
        }
    }












    async update(req, res, next) {
        const {id} = req.params
        const {orderId, lessonId, name, string, errorLimit, speedLimit, active} = req.body

        try {
            // if

            const exercise = await Exercises.findByPk(id);

            if (!exercise) {
                return next(ApiError.internal(`Завдання з ID: ${id} не знайдено`));
            }

            exercise.orderId = orderId;
            exercise.lessonId = lessonId;
            exercise.name = name;
            exercise.string = string;
            exercise.errorLimit = errorLimit;
            exercise.speedLimit = speedLimit;
            exercise.active = active;

            await exercise.save();
            return res.json(exercise)
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені завдання'))
        }
    }

    async delete(req, res, next) {
        const {id} = req.params
        try {
            if (!id) {
                return next(ApiError.badRequest('Не заданий ID'))
            }

            const exercise = await Exercises.findByPk(id)

            if (!exercise) {
                return next(ApiError.internal(`Завдання з ID: ${id} не існує`))
            }

            await exercise.destroy()
            return res.json({message: `Завдання ${exercise.name} видалено`});
        } catch (error) {
            return next(ApiError.internal('Помилка при видаленні завдання'))
        }
    }

    async getNextExercise(req, res, next) {
        const {id} = req.params;

        try {
            const currentExercise = await Exercises.findByPk(id, {
                include: [
                    { model: Lessons, as: 'lesson' },
                ]
            });

            if (!currentExercise) {
                return next(ApiError.internal(`Завдання з ID: ${id} не знайдено`))
            }

            const exercisesInCourse = await Exercises.findAll({
                include: {
                    model: Lessons,
                    as: 'lesson',
                    where: {
                        courseId: currentExercise.lesson.courseId,
                    },
                    order: [['orderId', 'ASC']],
                },
                order: [
                    [{ model: Lessons, as: 'lesson' }, 'orderId', 'ASC'],
                    ['orderId', 'ASC'],
                ],
            });


            const exercise = getExerciseToExercises(exercisesInCourse, currentExercise.id, 1)
            return res.json(exercise)
        } catch (error) {
            return next(ApiError.internal(`Помилка при отримані наступного завдання ${error}`));
        }
    }


    async getLastExercise(req, res, next) {
        const {userId} = req.params

        try {
            const user = await Users.findByPk(userId)

            const exercisesInCourse = await Exercises.findAll({
                include: {
                    model: Lessons,
                    as: 'lesson',
                    where: {
                        courseId: user.courseId,
                    },
                    order: [['orderId', 'ASC']],
                },
                order: [
                    [{ model: Lessons, as: 'lesson' }, 'orderId', 'ASC'],
                    ['orderId', 'ASC'],
                ],
            });

            let exercise;

            if (!user.lastExerciseId) {
                let lastExercise = await Progress.findOne({
                    where: {
                        userId: user.id,
                        courseId: user.courseId
                    },
                    order: [['createdAt', 'DESC']]
                })
                exercise = getExerciseToExercises(exercisesInCourse, lastExercise?.exerciseId, 1)
            } else {
                exercise = getExerciseToExercises(exercisesInCourse, user.lastExerciseId)
            }
            return res.json(exercise)
        } catch(error) {
            return next(ApiError.internal(`Помилка при отримані завдання ${error}`));
        }
    }
}

function getExerciseToExercises(exercises, exerciseId, next=0) {
    let index = exercises.findIndex(e => e.id === exerciseId)

    if (!exercises.length) {
        return null
    }

    if (index === -1) {
        index = 0
    } else {
        if (exercises[index+next]) {
            index += next
        }
    }

    const exercise = exercises[index]
    const isLastLesson = exercise.lessonId === exercises[exercises.length-1].lessonId
    const isLastExercise = !exercises[index+next] || exercises[index+next].lessonId > exercises[index].lessonId

    return {
        ...exercise.toJSON(),
        isLastLesson,
        isLastExercise
    }
}

module.exports = new ExerciseController()
