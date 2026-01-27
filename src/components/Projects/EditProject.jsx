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
            <input
                name="title"
                value={form.title || ''}
                onChange={handleChange}
            />
            <textarea
                name="summary"
                value={form.summary || ''}
                onChange={handleChange}
            />
            <input
                name="contact_email"
                value={form.contact_email || ''}
                onChange={handleChange}
            />

            <button type="submit"> Save </button>
        </form>
    )
}

export default EditProject
