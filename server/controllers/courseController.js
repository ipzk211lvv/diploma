const {Courses, Lessons, Exercises, Progress, Languages, Layouts, Keyboards} = require('../models/models')
const ApiError = require('../error/ApiError')
const {Op} = require("sequelize");
const {logger} = require("sequelize/lib/utils/logger");

class CourseController {
    async add(req, res, next) {
        try {
            const {keyboardId, name} = req.body

            if (!keyboardId || !name) {
                return next(ApiError.badRequest(`Неверно задані параметри`));
            }

            const course = await Courses.create({keyboardId, name})

            return res.json(course)
        } catch (error) {
            return next(ApiError.internal('Помилка при створені курсу'))
        }
    }

    async getAll(req, res, next) {
        const {userId} = req.query
        try {
            const courses = await Courses.findAll({
                include: [
                    {
                        model: Keyboards,
                        as: 'keyboard',
                        include: [
                            { model: Languages, as: 'language' },
                            { model: Layouts, as: 'layout' }
                        ]
                    }
                ],
                order: [['orderId', 'ASC']]
            });

            if (userId) {
                const progress = await Progress.findAll({
                    where: { userId },
                    attributes: ['exerciseId'],
                    raw: true
                });

                const completedExercises = progress.map(p => p.exerciseId);

                for (const course of courses) {
                    const lessons = await Lessons.findAll({
                        where: { courseId: course.id },
                        include: {
                            model: Exercises,
                            as: 'exercises',
                            attributes: ['id']
                        }
                    });

                    course.dataValues.countLesson = lessons.length

                    let completeLesson = 0
                    lessons.forEach(lesson => {
                        const allExercisesCompleted = lesson.exercises.every(exercise =>
                            completedExercises.includes(exercise.id)
                        );

                        if (allExercisesCompleted) {
                            completeLesson += 1
                        }
                    });

                    course.dataValues.completedLesson = completeLesson

                }

            }

            return res.json(courses);
        } catch (error) {
            console.log(error)
            return next(ApiError.internal(`Помилка при отримані курсів ${error}`));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const course = await Courses.findByPk(id, {
                include: [
                    { model: Keyboards, as: 'keyboard' },
                ]
            });
            return res.json(course);
        } catch (error) {
            return next(ApiError.internal('Помилка при отримані курсу'));
        }
    }


    async getCourseDetails(req, res, next) {
        const {userId, courseId} = req.query
        try {
            const courseDetails = {}

            const course = await Courses.findByPk(courseId, {
                include: [{ model: Keyboards, as: 'keyboard' }]
            });
            courseDetails.course = course

            const userProgress = await Progress.findAll({
                where: { userId: userId, courseId: courseId },
                raw: true,
            });

            let lessons = await Lessons.findAll({
                where: {courseId: course.id},
                include: [
                    { model: Exercises, as: 'exercises' },
                ],
            });

            let lock = true
            let lastProgressStar = true
            courseDetails.lessons = lessons.map((lesson) => {
                const exercises = lesson.exercises.map(exercise => {
                    const progress = userProgress.find(e => e.exerciseId === exercise.id)
                    lock = lastProgressStar
                    if (progress) {
                        lastProgressStar = progress.star
                        return {
                            ...exercise.toJSON(),
                            star: progress.star,
                            target: progress.target,
                            lightning: progress.lightning,
                            lock
                        }
                    } else {
                        lastProgressStar = false
                        return {...exercise.toJSON(), star: false, target: false, lightning: false, lock}
                    }
                })
                return {...lesson.toJSON(), exercises}
            })

            return res.json(courseDetails)
        } catch (error) {
            console.log(error)
            return next(ApiError.internal('Помилка при отримані інфо курсу'))
        }
    }

    async update(req, res, next) {
        const {id} = req.params
        const {orderId, languageId, layoutId, name} = req.body
        try {
            const course = await Courses.findByPk(id);

            if (!course) {
                return next(ApiError.internal(`Курсу з ID: ${id} не існує`));
            }

            course.orderId = orderId;
            course.languageId = languageId;
            course.layoutId = layoutId;
            course.name = name;
            await course.save();
            return res.json(course)
        } catch (error) {
            return next(ApiError.internal('Помилка при оновлені курсу'))
        }
    }

    async delete(req, res, next) {
        const {id} = req.params
        try {
            if (!id) {
                return next(ApiError.badRequest('Не заданий ID'))
            }

            const course = await Courses.findByPk(id)

            if (!course) {
                return next(ApiError.internal(`Курсу з ID: ${id} не існує`))
            }

            await course.destroy()
            return res.json({message: `Курс ${course.name} успішно видалений`});
        } catch (error) {
            return next(ApiError.internal('Помилка при видаленні курсу'))
        }
    }
}

module.exports = new CourseController()
