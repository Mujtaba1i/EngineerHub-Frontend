import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getOne, remove } from '../../services/projectService'
import { UserContext } from "../../contexts/UserContext"
import styles from './ProjectDetails.module.css'

function ProjectDetails() {
    const { user } = useContext(UserContext)
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)

    useEffect(() => {
        getOne(id).then(data => setProject(data))
    }, [id])

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return
        }
        await remove(id)
        navigate('/projects')
    }

    if (!project) return <div className={styles.loading}>Loading...</div>

    const isOwner = Number(user?.sub) === project.user_id

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1>{project.title}</h1>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.mainContent}>
                    <section className={`${styles.section} ${styles.summarySection}`}>
                        <h4>Project Summary</h4>
                        <p>{project.summary}</p>
                    </section>

                    <section className={`${styles.section} ${styles.contactSection}`}>
                        <h4>Contact Information</h4>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <strong>Email:</strong>
                                <a href={`mailto:${project.contact_email}`}>{project.contact_email}</a>
                            </div>
                            {project.contact_phone && (
                                <div className={styles.contactItem}>
                                    <strong>Phone:</strong>
                                    <span>{project.contact_phone}</span>
                                </div>
                            )}
                            {project.linkedin && (
                                <div className={styles.contactItem}>
                                    <strong>LinkedIn:</strong>
                                    <a href={project.linkedin} target="_blank" rel="noopener noreferrer">
                                        View Profile
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {project.poster && (
                    <aside className={styles.posterSection}>
                        <h4>Project Poster</h4>
                        <img
                            src={project.poster}
                            alt="Project Poster"
                            className={styles.posterImage}
                        />
                    </aside>
                )}
            </div>

            {isOwner && (
                <div className={styles.actions}>
                    <button onClick={() => navigate(`/projects/edit/${id}`)} className={styles.editButton}>
                        Edit Project
                    </button>
                    <button onClick={handleDelete} className={styles.deleteButton}>
                        Delete Project
                    </button>
                </div>
            )}
        </main>
    )
}

export default ProjectDetails