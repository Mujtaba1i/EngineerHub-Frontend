import { useState } from 'react'
import { useNavigate } from 'react-router'
import { create } from '../../services/projectService'

function AddProject() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: '',
        summary: '',
        major: '',
        graduation_year: '',
        contact_email: '',
        contact_phone: '',
        linkedin: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await create(form)
        navigate('/projects')
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="title"> Title:</label>
            <input name="title" placeholder="title" onChange={handleChange} />
            
            <label htmlFor="summary">Summary:</label>
            <textarea name="summary" placeholder="summary" onChange={handleChange} />
            
            <label htmlFor="major">Major:</label>
            <input name="major" placeholder="major" onChange={handleChange} />
            
            <label htmlFor="graduation_year">Graduation Year:</label>
            <input name="graduation_year" placeholder="graduation_year" onChange={handleChange} />
            
            <label htmlFor="contact_email">Email:</label>
            <input name="contact_email" placeholder="email" onChange={handleChange} />
            
            <label htmlFor="contact_phone">Phone:</label>
            <input name="contact_phone" placeholder="phone" onChange={handleChange} />
            
            <label htmlFor="linkedin">LinkedIn:</label>
            <input name="linkedin" placeholder="linkedin" onChange={handleChange} />

            <button type="submit"> Add Project </button>
        </form>
    )
}

export default AddProject
