import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getOne, update } from '../../services/projectService'
import styles from './AddProject.module.css'
import { UserContext } from '../../contexts/UserContext'

function EditProject() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState(null)
    const { user } = useContext(UserContext);
    
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

    useEffect(() => {
        if (!form || !user) return 

        if (user.role !== 'student' && user.role !== 'graduate') {
            navigate('/')
            return
        }
        if (parseInt(user.sub) !== form.user_id) {
            navigate('/')
        }
    }, [form, user, navigate])

    if (!form?.title) return <div className={styles.loading}>Loading...</div>
    


    return (
        <main className={styles.container}>
            <h1>Edit Project</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={form.title || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="summary">Summary:</label>
                    <textarea
                        id="summary"
                        name="summary"
                        value={form.summary || ''}
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
                        value={form.major || ''}
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
                        value={form.poster || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="graduation_year">Graduation Year:</label>
                    <input
                        type="number"
                        id="graduation_year"
                        name="graduation_year"
                        value={form.graduation_year || ''}
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
                        value={form.contact_email || ''}
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
                        value={form.contact_phone || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="linkedin">LinkedIn:</label>
                    <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={form.linkedin || ''}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className={styles.submitButton}>Save Changes</button>
            </form>
        </main>
    )
}

export default EditProject