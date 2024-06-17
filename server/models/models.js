const sequelize = require('../db')
const {DataTypes, Op} = require('sequelize')


const Users = sequelize.define('Users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, defaultValue: 'Bunny' },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    courseId: { type: DataTypes.INTEGER },
    lastExerciseId: { type: DataTypes.INTEGER },
    showKeyboard: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const UserExercises = sequelize.define('UserExercises', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    text: { type: DataTypes.TEXT },
})

Users.hasMany(UserExercises, { foreignKey: 'userId' });
UserExercises.belongsTo(Users, { foreignKey: 'userId' });

const Progress = sequelize.define('Progress', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    courseId: {type: DataTypes.INTEGER },
    lessonId: {type: DataTypes.INTEGER },
    exerciseId: {type: DataTypes.INTEGER },
    star: {type: DataTypes.BOOLEAN },
    target: {type: DataTypes.BOOLEAN },
    lightning: {type: DataTypes.BOOLEAN },
});

Users.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(Users, { foreignKey: 'userId' });

const Languages = sequelize.define('Languages', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true },
});

const Layouts = sequelize.define('Layouts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true },
});

const Keyboards = sequelize.define('Keyboards', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    languageId: { type: DataTypes.INTEGER },
    layoutId: { type: DataTypes.INTEGER },
    keyboard: { type: DataTypes.JSON },
});

Languages.hasMany(Keyboards, { foreignKey: 'languageId' });
Keyboards.belongsTo(Languages, { as: 'language', foreignKey: 'languageId' });

Layouts.hasMany(Keyboards, { foreignKey: 'layoutId' });
Keyboards.belongsTo(Layouts, { as: 'layout', foreignKey: 'layoutId' });

const Courses = sequelize.define('Courses', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER },
    keyboardId: {type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
}, {
    hooks: {
        async beforeCreate(course) {
            const maxOrderId = await Courses.max('orderId');
            course.orderId = maxOrderId ? maxOrderId + 1 : 1;
        },
        async beforeDestroy(course) {
            await Courses.update({ orderId: sequelize.literal('"orderId" - 1') }, { where: { orderId: { [Op.gt]: course.orderId } } });
            await Courses.destroy({ where: { id: course.id } });
        }
    }
});

Courses.belongsTo(Keyboards, { foreignKey: 'keyboardId', as: 'keyboard' });
Keyboards.hasMany(Courses, { foreignKey: 'keyboardId', as: 'courses' });

const Lessons = sequelize.define('Lessons', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER },
    courseId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
}, {
    hooks: {
        async beforeCreate(lesson) {
            const maxOrderId = await Lessons.max('orderId', { where: { courseId: lesson.courseId } });
            lesson.orderId = maxOrderId ? maxOrderId + 1 : 1;
        },
        async beforeDestroy(lesson) {
            await Lessons.update({ orderId: sequelize.literal('"orderId" - 1') }, {
                where: {
                    courseId: lesson.courseId,
                    orderId: { [Op.gt]: lesson.orderId }
                }
            });
        }
    }
});

Courses.hasMany(Lessons, { foreignKey: 'courseId' });
Lessons.belongsTo(Courses, { foreignKey: 'courseId' });

const Exercises = sequelize.define('Exercises', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER },
    lessonId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    string: { type: DataTypes.STRING },
    errorLimit: { type: DataTypes.INTEGER },
    speedLimit: { type: DataTypes.INTEGER },
    active: { type: DataTypes.BOOLEAN },
}, {
    hooks: {
        async beforeCreate(exercise) {
            const maxOrderId = await Exercises.max('orderId', { where: { lessonId: exercise.lessonId } });
            exercise.orderId = maxOrderId ? maxOrderId + 1 : 1;
        },
        async beforeDestroy(exercise) {
            await Exercises.update({ orderId: sequelize.literal('"orderId" - 1') }, {
                where: {
                    lessonId: exercise.lessonId,
                    orderId: { [Op.gt]: exercise.orderId }
                }
            });
        }
    }
});

Lessons.hasMany(Exercises, { as: 'exercises', foreignKey: 'lessonId' });
Exercises.belongsTo(Lessons, { as: 'lesson', foreignKey: 'lessonId' });


const Tests = sequelize.define('Tests', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    courseId: { type: DataTypes.INTEGER },
    text: { type: DataTypes.TEXT },
});

const TestProgress = sequelize.define('TestProgress', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    courseId: { type: DataTypes.INTEGER },
    speed: { type: DataTypes.INTEGER },
    target: { type: DataTypes.FLOAT },
});

Courses.hasMany(Tests, { foreignKey: 'courseId' });
Tests.belongsTo(Courses, { foreignKey: 'courseId' });

module.exports = {
    Users,
    Progress,
    Languages,
    Layouts,
    Keyboards,
    Courses,
    Lessons,
    Exercises,
    Tests,
    TestProgress,
    UserExercises
}
