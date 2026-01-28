import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { create } from '../../services/projectService'
import styles from './AddProject.module.css'
import { UserContext } from '../../contexts/UserContext'

function AddProject() {
    const navigate = useNavigate()
    const { user } = useContext(UserContext);
    const [form, setForm] = useState({
        title: '',
        summary: '',
        major: '',
        poster: '',
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

    useEffect(() => {
        if (user?.role !== 'student' || user?.role !== 'graduate') {
            navigate('/')
        }
    }, [user, navigate])

    return (
        <main className={styles.container}>
            <h1>Add Senior Project</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title:</label>
                    <input 
                        type="text" 
                        id="title"
                        name="title" 
                        placeholder="Project title" 
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="summary">Summary:</label>
                    <textarea 
                        id="summary"
                        name="summary" 
                        placeholder="Describe your project" 
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="major">Major:</label>
                    <input 
                        type="text" 
                        id="major"
                        name="major" 
                        placeholder="Your major" 
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="poster">Poster Image URL:</label>
                    <input 
                        type="text" 
                        id="poster"
                        name="poster" 
                        placeholder="https://example.com/image.jpg" 
                        onChange={handleChange} 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="graduation_year">Graduation Year:</label>
                    <input 
                        type="number" 
                        id="graduation_year"
                        name="graduation_year" 
                        placeholder="2024" 
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="contact_email">Email:</label>
                    <input 
                        type="email" 
                        id="contact_email"
                        name="contact_email" 
                        placeholder="your.email@example.com" 
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="contact_phone">Phone:</label>
                    <input 
                        type="tel" 
                        id="contact_phone"
                        name="contact_phone" 
                        placeholder="+123456789" 
                        onChange={handleChange} 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="linkedin">LinkedIn:</label>
                    <input 
                        type="url"
                        id="linkedin"
                        name="linkedin" 
                        placeholder="https://linkedin.com/in/yourprofile" 
                        onChange={handleChange} 
                    />
                </div>

                <button type="submit" className={styles.submitButton}>Add Project</button>
            </form>
        </main>
    )
}

export default AddProject