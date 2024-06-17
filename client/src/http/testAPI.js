import {$authHost, $host} from "./index";

export const getTests = async () => {
    const {data} = await $host.get('api/test')
    return data
}
export const getTestByCourseId = async (id) => {
    const {data} = await $host.get(`api/test/course/${id}`)
    return data
}

export const addTest = async (courseId, text) => {
    const {data} = await $authHost.post('api/test', {courseId, text})
    return data
}

export const updateTest = async ({id, courseId, text}) => {
    const {data} = await $authHost.patch(`api/test/${id}`, {courseId, text})
    return data
}

export const deleteCourse = async (id) => {
    const {data} = await $authHost.delete(`api/test/${id}`)
    return data
}
