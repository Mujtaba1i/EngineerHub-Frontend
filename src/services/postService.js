import axios from 'axios';
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/posts`;


export const getAll = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${BASE_URL}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};


export const getOne = async (id) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};


export const create = async (data) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${BASE_URL}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};


export const update = async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${BASE_URL}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};


export const remove = async (id) => {
    const token = localStorage.getItem('token');
    const res = await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};
