import {$host, $authHost} from "./index";

export const getKeyboard = async () => {
    const {data} = await $host.get('api/keyboard')
    return data
}

export const addKeyboard = async (languageId, layoutId, keyboard) => {
    const {data} = await $authHost.post('api/keyboard', {languageId, layoutId, keyboard})
    return data
}

export const updateKeyboard = async (id, languageId, layoutId, keyboard) => {
    const {data} = await $authHost.patch(`api/keyboard/${id}`, {languageId, layoutId, keyboard})
    return data
}

export const deleteKeyboard = async (id) => {
    const {data} = await $authHost.delete(`api/keyboard/${id}`)
    return data
}
