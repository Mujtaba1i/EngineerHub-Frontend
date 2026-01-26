import axios from 'axios'
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/classes`
const BASE_Student_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/student-classes`

export const getAll = async () => {
    const res = await axios.get(`${BASE_URL}`)
    return res.data
}

export const getOne = async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`)
    return res.data
}

export const getStudentClasses = async () => {
    const token = localStorage.getItem('token');

    const res = await axios.get(`${BASE_Student_URL}`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const create = async (data) => {
    // Step 1: Get the token from localStorage
    const token = localStorage.getItem('token');

    // Step 2: Make the GET request with the token in the header
    const res = await axios.post(`${BASE_URL}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}

export const update = async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${BASE_URL}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const remove = async (id) => {
    const token = localStorage.getItem('token');
    const res = await axios.delete(`${BASE_URL}/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}
