const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/students-classes`
import axios from 'axios'

export const addStudentToClass = async (data) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.post(BASE_URL, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response)
        return response.data
    }
    catch (err) { console.log(err) }
};

export const removeStudentFromClass = async (classId, studentId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${classId}/${studentId}`);
    }
    catch (err) { console.log(err) }
};
