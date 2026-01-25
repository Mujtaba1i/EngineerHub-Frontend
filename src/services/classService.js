import axios from 'axios'

export const getAll = async () => {
  const res = await axios.get('/classes')
  return res.data
}

export const getOne = async (id) => {
  const res = await axios.get(`/classes/${id}`)
  return res.data
}

export const create = async (data) => {
  const res = await axios.post('/classes', data)
  return res.data
}

export const update = async (id, data) => {
  const res = await axios.put(`/classes/${id}`, data)
  return res.data
}

export const remove = async (id) => {
  const res = await axios.delete(`/classes/${id}`)
  return res.data
}
