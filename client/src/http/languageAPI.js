import {$host, $authHost} from "./index";

export const getLanguage = async () => {
    const {data} = await $host.get('api/language')
    return data
}

export const addLanguage = async (name) => {
    const {data} = await $authHost.post('api/language', {name})
    return data
}

export const updateLanguage = async (id, name) => {
    const {data} = await $authHost.patch(`api/language/${id}`, {name})
    return data
}

export const deleteLanguage = async (id) => {
    const {data} = await $authHost.delete(`api/language/${id}`)
    return data
}
