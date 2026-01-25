import axios from 'axios'
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/classes`

export const getAll = async () => {
  const res = await axios.get('/classes')
  return res.data
}

export const getOne = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`)
  return res.data
}

export const create = async (data) => {
  const res = await axios.post(`${BASE_URL}`, data)
  return res.data
}

export const update = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data)
  return res.data
}

export const remove = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`)
  return res.data
}
