import {$host, $authHost} from "./index";
import {jwtDecode} from "jwt-decode";

export const registration = async (username, email, password) => {
    const {data} = await $host.post('api/user/registration', {username, email, password, role: 'USER', courseId: null, lastExerciseId: null, showKeyboard: true})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const addProgressExercise = async (userId, courseId, lessonId, exerciseId, star, target, lightning) => {
    const {data} = await $authHost.post(`api/user/add-progress/${userId}`, {courseId, lessonId, exerciseId, star, target, lightning})
    return data
}

export const addProgressTest = async (userId, courseId, speed, target) => {
    const {data} = await $authHost.post(`api/user/add-progress-test/${userId}`, {courseId, speed, target})
    return data
}

export const getResultTest = async (userId, courseId) => {
    const {data} = await $authHost.get(`api/user/result/${userId}?courseId=${courseId}`)
    return data
}

export const updateUserCourse = async (id, courseId) => {
    const {data} = await $authHost.post(`api/user/new-course/${id}`, {courseId})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const addUserExercise = async (id, name, text) => {
    const {data} = await $authHost.post(`api/user/exercise/${id}`, {name, text})
    return data
}

export const updateUserExercise = async (id, name, text) => {
    const {data} = await $authHost.patch(`api/user/exercise/${id}`, {name, text})
    return data
}

export const deleteUserExercise = async (id) => {
    const {data} = await $authHost.delete(`api/user/exercise/${id}`)
    return data
}

export const getUserExercise = async (id) => {
    const {data} = await $authHost.get(`api/user/exercise/${id}`)
    return data
}




