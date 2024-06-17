import {$host, $authHost} from "./index";

export const getCourses = async (userId) => {
    const {data} = await $host.get(`api/course?userId=${userId ? userId : 0}`)
    return data
}
export const getCourse = async (id) => {
    const {data} = await $host.get(`api/course/${id}`)
    return data
}

export const addCourse = async (keyboardId, name) => {
    const {data} = await $authHost.post('api/course', {keyboardId, name})
    return data
}

export const updateCourse = async ({id, orderId, keyboardId, name}) => {
    const {data} = await $authHost.patch(`api/course/${id}`, {orderId, keyboardId, name})
    return data
}

export const deleteCourse = async (id) => {
    const {data} = await $authHost.delete(`api/course/${id}`)
    return data
}

export const getLessonByCourse = async (id) => {
    const {data} = await $authHost.get(`api/lesson/${id}`)
    return data
}

/// LESSON

export const addLesson = async (courseId, name) => {
    const {data} = await $authHost.post('api/lesson', {courseId, name})
    return data
}

export const updateLesson = async (id, orderId, courseId, name) => {
    const {data} = await $authHost.patch(`api/lesson/${id}`, {orderId, courseId, name})
    return data
}

export const deleteLesson = async (id) => {
    const {data} = await $authHost.delete(`api/lesson/${id}`)
    return data
}


/// EXERCISE

export const addExercise = async (lessonId, name, string, speedLimit, errorLimit, active) => {
    const {data} = await $authHost.post('api/exercise', {lessonId, name, string, speedLimit, errorLimit, active})
    return data
}

export const updateExercise = async (id, orderId, lessonId, name, string, speedLimit, errorLimit, active) => {
    const {data} = await $authHost.patch(`api/exercise/${id}`, {orderId, lessonId, name, string, speedLimit, errorLimit, active})
    return data
}

export const deleteExercise = async (id) => {
    const {data} = await $authHost.delete(`api/exercise/${id}`)
    return data
}

export const getExerciseByLesson = async (id) => {
    const {data} = await $authHost.get(`api/exercise/lesson/${id}`)
    return data
}

///typing

export const getLastExercise = async (id) => {
    const {data} = await $authHost.get(`api/typing/last/${id}`)
    return data
}

export const getNextExercise = async (id) => {
    const {data} = await $authHost.get(`api/typing/next/${id}`)
    return data
}

export const getCourseDetail = async (userId, courseId) => {
    const {data} = await $authHost.get(`api/course/details?userId=${userId}&courseId=${courseId}`)
    return data
}

