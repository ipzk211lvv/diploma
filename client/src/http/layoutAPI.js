import {$host, $authHost} from "./index";

export const getLayout = async () => {
    const {data} = await $host.get('api/layout')
    return data
}

export const addLayout = async (name) => {
    const {data} = await $authHost.post('api/layout', {name})
    return data
}

export const updateLayout = async (id, name) => {
    const {data} = await $authHost.patch(`api/layout/${id}`, {name})
    return data
}

export const deleteLayout = async (id) => {
    const {data} = await $authHost.delete(`api/layout/${id}`)
    return data
}
