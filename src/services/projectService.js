import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/projects`


// GET ALL ================================================================================
export const getAll = async () => {
    const res = await axios.get(`${BASE_URL}`)
    return res.data
}


// GET ONE =================================================================================
export const getOne = async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`)
    return res.data
}


// CREATE ==================================================================================
export const create = async (data) => {
    const token = localStorage.getItem('token')

    const res = await axios.post(`${BASE_URL}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}


// UPDATE ==================================================================================
export const update = async (id, data) => {
    const token = localStorage.getItem('token')

    const res = await axios.put(`${BASE_URL}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}


// DELETE =================================================================
export const remove = async (id) => {
    const token = localStorage.getItem('token')

    const res = await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}
