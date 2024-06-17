import React, {useEffect, useState} from 'react';
import {
    addCourse,
    addExercise,
    addLesson, deleteCourse,
    deleteExercise,
    deleteLesson,
    getCourses,
    getExerciseByLesson,
    getLessonByCourse,
    updateExercise,
    updateLesson
} from "../../../http/courseAPI";
import Container from "../../Container/Container";
import styles from './CoursesTable.module.scss'

import ButtonIcon from "../../UI/ButtonIcon/ButtonIcon";
import AdminInput from "../AdminInput/AdminInput";
import Select from "../../UI/Select/Select";

import openListIcon from '../../../assets/icons/open-list.png'
import confirmIcon from '../../../assets/icons/confirm.png'
import crossIcon from '../../../assets/icons/cross.png'
import deleteIcon from '../../../assets/icons/delete.png'
import updateIcon from '../../../assets/icons/update.png'
import plusIcon from '../../../assets/icons/plus.png'
import {getKeyboard} from "../../../http/keyboardAPI";

const CoursesTable = () => {
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(0)
    const [createCourse, setCreateCourse] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
        setCreateCourse(false)
    }, [])

    const fetchData = () => {
        getCourses().then(data => {
            setCourses(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
            setSelectedCourse(0)
        }).finally(() => setLoading(false))
    }

    const handleSelectChange = (e) => {
        setSelectedCourse(e.value)
        setCreateCourse(false)
    }

    const handleDeleteCourse = (id) => {
        deleteCourse(id).then(r => fetchData())
    }

    if (loading) {
        return <div>LOADING...</div>
    }

    return (
        <div className={styles.course}>
            <div className={styles.course__menu}>
                {
                    courses.length > 0 ?
                        <div className={styles.course__info}>
                            <div>
                                <Select options={courses.map((e, i) => {return {value: i, label: e.name}})}
                                        onChange={handleSelectChange} selectedId={selectedCourse}/>
                                {/*<div>*/}
                                {/*    <p>Мова: {courses[selectedCourse]?.keyboard.language.name}</p>*/}
                                {/*    <p>Розклдака: {courses[selectedCourse]?.keyboard.language.name}</p>*/}
                                {/*</div>*/}
                            </div>
                            <button className={`${styles.adminButton} ${styles.course__addButton}`}
                                    onClick={() => handleDeleteCourse(courses[selectedCourse].id)}>Видалити курс</button>
                        </div>
                        : <div>Курсів немає</div>
                }
                <button className={styles.adminButton}
                        onClick={() => setCreateCourse(true)}>Створити курс</button>
            </div>
            <div className={styles.course__detail}>
                {
                    createCourse
                        ? <CreateCourse fetchData={fetchData} setCreateCourse={setCreateCourse} />
                        : courses.length > 0 && <LessonsList courseId={courses[selectedCourse].id}/>
                }
            </div>
        </div>
    );
};

const CreateCourse = ({fetchData, setCreateCourse}) => {
    const [keyboards, setKeyboards] = useState([])
    const [newCourse, setNewCourse] = useState({name: '', keyboardId: 0})

    useEffect(() => {
        getKeyboard().then(data => {
            setKeyboards(data)
            setNewCourse({...newCourse, keyboardId: data[0].id})
        })
    }, [])

    const handleCreateCourse = () => {
        addCourse(newCourse.keyboardId, newCourse.name).then(r => {
            setCreateCourse(false)
            fetchData()
        })
    }

    if (!keyboards.length) {
        return <div>Loading...</div>
    }

    return (
        <div className={styles.create}>
            <h3 className={styles.create__title}>Створення курсу</h3>
            <div className={styles.create__params}>
                <div className={styles.create__item}>
                    <p>Назва курсу: </p>
                    <input className={styles.create__input} type="text" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})}/>
                </div>
                <div className={styles.create__item}>
                    <p>Клавіатура: </p>
                    <Select options={keyboards.map(e => {return {value: e.id, label: `${e.language.name} ${e.layout.name}`}})}
                            onChange={(e) => setNewCourse({...newCourse, keyboardId: e.value})}
                    />
                </div>
            </div>
            <div className={styles.create__params}>
                <div className={styles.create__item}>
                    <p>Мова: {keyboards.find(e => e.id === newCourse.keyboardId)?.language.name}</p>
                    <p>Розкладка: {keyboards.find(e => e.id === newCourse.keyboardId)?.layout.name}</p>
                </div>
                <button className={styles.adminButton} onClick={handleCreateCourse}>Створити</button>
            </div>
        </div>
    )
}


const LessonsList = ({courseId}) => {
    const [lessons, setLessons] = useState([])
    const [showLessons, setShowLessons] = useState([])
    const [lessonUpdate, setLessonUpdate] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDataLessons()
    }, [courseId])

    const getDataLessons = () => {
        setLoading(true)
        getLessonByCourse(courseId).then(data => setLessons(data)).finally(() => setLoading(false))
    }

    const handleShowLesson = (lessonId) => {
        if (showLessons.includes(lessonId)) {
            setShowLessons(showLessons.filter(e => e !== lessonId))
        } else {
            setShowLessons([...showLessons, lessonId])
        }
    }

    const handleUpdateLesson = (lesson) => {
        if (!lessonUpdate || lesson.id !== lessonUpdate.id) {
            setLessonUpdate(lesson)
        } else {
            addLesson(courseId, lessonUpdate.name).then(r => getDataLessons())
        }
    }

    const handleConfirm = () => {
        if (lessonUpdate?.id !== 0) {
            updateLesson(lessonUpdate.id, lessonUpdate.orderId, courseId, lessonUpdate.name).then(r => getDataLessons())
        } else {
            addLesson(courseId, lessonUpdate.name).then(r => getDataLessons())
        }
        setLessonUpdate(null)
    }

    const handleCansel = () => {
        if (lessonUpdate.id !== 0) {
            setLessonUpdate(null)
        } else {
            setLessonUpdate(null)
            setLessons(lessons.filter(e => e.id !== 0))
        }
    }

    const handleDeleteLesson = (lessonId) => {
        deleteLesson(lessonId).then(r => getDataLessons())
    }

    const handleAddNewLesson = () => {
        if (!lessons.filter(e => e.id === 0).length) {
            const newLesson = {id: 0, orderId: lessons.length+1, name: ''}
            setLessons([...lessons, newLesson])
            setLessonUpdate(newLesson)
        }
    }

    const handlerChangeInput = (e) => {
        setLessonUpdate({...lessonUpdate, name: e.currentTarget.value})
    }

    if (loading) {
        return 'Loading'
    }

    return (
        <div className={styles.lessons}>
            {lessons.length > 0 && lessons.map(lesson =>
                <div className={styles.lessons__item} key={lesson.id}>
                    <div className={styles.lessons__itemInfo}>
                        <ButtonIcon src={openListIcon} onClick={() => handleShowLesson(lesson.id)}/>
                        <div>Урок {lesson.orderId}</div>
                        <AdminInput type="text" valueName='name' data={lesson} updateData={lessonUpdate} onChange={handlerChangeInput}/>
                        { lessonUpdate?.id !== lesson.id ? <>
                                    <ButtonIcon src={updateIcon} onClick={() => handleUpdateLesson(lesson)}/>
                                    <ButtonIcon src={deleteIcon} onClick={() => handleDeleteLesson(lesson.id)}/>
                                </> : <>
                                    <ButtonIcon src={confirmIcon} onClick={handleConfirm}/>
                                    <ButtonIcon src={crossIcon} onClick={handleCansel}/>
                                </>
                        }
                    </div>
                    <div className={styles.lessons__exercises}>
                        {
                            showLessons.includes(lesson.id) &&
                            <ExerciseList lessonId={lesson.id}/>
                        }
                    </div>
                </div>
            )}
            <button className={styles.lessons__addButton} onClick={handleAddNewLesson}>Додати урок</button>
        </div>
    )
}

const ExerciseList = ({lessonId}) => {
    const [exercises, setExercises] = useState([])
    const [exerciseUpdate, setExerciseUpdate] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDataExercises()
    }, [])

    const getDataExercises = () => {
        setLoading(true)
        getExerciseByLesson(lessonId).then(data => setExercises(data)).finally(() => setLoading(false))
    }


    const handleUpdateExercise = (exercise) => {
        if (!exerciseUpdate || exercise.id !== exerciseUpdate.id) {
            setExerciseUpdate(exercise)
        } else {
             addExercise(lessonId,
                 exerciseUpdate.name,
                 exerciseUpdate.string,
                 exerciseUpdate.speedLimit,
                 exerciseUpdate.errorLimit, true)
                 .then(r => getDataExercises())
        }
    }

    const handleConfirm = () => {
        if (exerciseUpdate?.id !== 0) {
            updateExercise(
                exerciseUpdate.id,
                exerciseUpdate.orderId,
                exerciseUpdate.lessonId,
                exerciseUpdate.name,
                exerciseUpdate.string,
                exerciseUpdate.speedLimit,
                exerciseUpdate.errorLimit, true)
                .then(r => getDataExercises())
        } else {
            addExercise(lessonId,
                exerciseUpdate.name,
                exerciseUpdate.string,
                exerciseUpdate.speedLimit,
                exerciseUpdate.errorLimit, true)
                .then(r => getDataExercises())
        }
        setExerciseUpdate(null)
    }

    const handleCansel = () => {
        if (exerciseUpdate.id !== 0) {
            setExerciseUpdate(null)
        } else {
            setExerciseUpdate(null)
            setExercises(exercises.filter(e => e.id !== 0))
        }
    }

    const handleDeleteExercise = (exerciseId) => {
        deleteExercise(exerciseId).then(r => getDataExercises())
    }

    const handlerChangeInput = (e) => {
        setExerciseUpdate({...exerciseUpdate,
            [e.currentTarget.getAttribute('data-name')]: e.currentTarget.value
        })
    }

    const handleAddNewExercise = () => {
        if (!exercises.filter(e => e.id === 0).length) {
            const newExercise = {id: 0, orderId: exercises.length+1, name: '', string: '', errorLimit: 2, speedLimit: 0}
            setExercises([...exercises, newExercise])
            setExerciseUpdate(newExercise)
        }
    }

    if (loading) {
        return <div className={styles.exercises}>Loading...</div>
    }

    return (
        <div className={styles.exercises}>
            {
                exercises.length ?
                    exercises.map(exercise =>
                        <div className={styles.exercises__item} key={exercise.id}>
                            <div>Завдання {exercise.orderId}</div>
                            <AdminInput type="text" valueName='name' data={exercise} updateData={exerciseUpdate} onChange={handlerChangeInput}/>
                            <AdminInput type="text" valueName='string' data={exercise} updateData={exerciseUpdate} onChange={handlerChangeInput}/>
                            <AdminInput type="text" valueName='errorLimit' data={exercise} updateData={exerciseUpdate} onChange={handlerChangeInput}/>
                            <AdminInput type="text" valueName='speedLimit' data={exercise} updateData={exerciseUpdate} onChange={handlerChangeInput}/>
                            { exerciseUpdate?.id !== exercise.id ? <>
                                <ButtonIcon src={updateIcon} onClick={() => handleUpdateExercise(exercise)}/>
                                <ButtonIcon src={deleteIcon} onClick={() => handleDeleteExercise(exercise.id)}/>
                            </> : <>
                                <ButtonIcon src={confirmIcon} onClick={handleConfirm}/>
                                <ButtonIcon src={crossIcon} onClick={handleCansel}/>
                            </>
                            }
                        </div>
                    )
                    : <div className={styles.exercises__item}>Завдань немає</div>
            }
            <div className={styles.exercises__addButton}>
                <ButtonIcon src={plusIcon} onClick={handleAddNewExercise}/>
            </div>
        </div>
    )
}

export default CoursesTable;
