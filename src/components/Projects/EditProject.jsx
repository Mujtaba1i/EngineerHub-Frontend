import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getOne, update } from '../../services/projectService'

function EditProject() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({})

    useEffect(() => {
        getOne(id).then(data => setForm(data))
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await update(id, form)
        navigate(`/projects/${id}`)
    }

    return (
        <form onSubmit={handleSubmit}>

            <label htmlFor="title"> Title:</label>
            <input
                type="text"
                name="title"
                value={form.title || ''}
                onChange={handleChange}
            />


            <label htmlFor="summary">Summary:</label>
            <textarea
                name="summary"
                value={form.summary || ''}
                onChange={handleChange}
            />

            <label htmlFor="major">Major:</label>
            <input
                type="text"
                name="major"
                value={form.major || ''}
                onChange={handleChange}
            />

            <label htmlFor="poster">Poster:</label>
            <input
                type="text"
                name="poster"
                value={form.poster || ''}
                onChange={handleChange}
            />

            <label htmlFor="graduation_year">Graduation Year:</label>
            <input
                type="number"
                name="graduation_year"
                value={form.graduation_year || ''}
                onChange={handleChange}
            />
            
            <label htmlFor="contact_email">Email:</label>
            <input
                type="text"
                name="contact_email"
                value={form.contact_email || ''}
                onChange={handleChange}
            />

            <label htmlFor="contact_phone">Phone:</label>
            <input
                type="number"
                name="contact_phone"
                value={form.contact_phone || ''}
                onChange={handleChange}
            />

            <label htmlFor="linkedin">LinkedIn:</label>
            <input
                name="linkedin"
                value={form.linkedin || ''}
                onChange={handleChange}
            />

            <button type="submit"> Save </button>
        </form>
    )
}

export default EditProject
