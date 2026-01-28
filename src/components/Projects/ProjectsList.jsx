import { useEffect, useState, useContext } from 'react'
import { UserContext } from "../../contexts/UserContext"
import { getAll } from '../../services/projectService'
import { Link } from 'react-router'
import styles from './ProjectsList.module.css'

function ProjectsList() {
    const { user } = useContext(UserContext)
    const [projects, setProjects] = useState([])

    useEffect(() => {
        getAll().then(data => setProjects(data))
    }, [])
    
    const userHasProject = !!(projects.find(project => parseInt(user?.sub) === project.user_id))
    let isUserStudent = false 
    if (user.role=== 'student' || user.role === 'graduate'){isUserStudent = true}

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1>🎓 Senior Projects 🎓</h1>
                {(user && !userHasProject && isUserStudent) && (
                    <Link to="/projects/add" className={styles.addButton}>
                        Add Your Project
                    </Link>
                )}
            </div>

            {projects.length === 0 ? (
                <div className={styles.emptyState}>
                    No projects yet. Be the first to share your senior project!
                </div>
            ) : (
                <div className={styles.projectsGrid}>
                    {projects.map(project => (
                        <div key={project.id} className={styles.projectCard}>
                            <h3>{project.title}</h3>
                            <p className={styles.projectMajor}>{project.major}</p>
                            <Link to={`/projects/${project.id}`} className={styles.detailsLink}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default ProjectsList