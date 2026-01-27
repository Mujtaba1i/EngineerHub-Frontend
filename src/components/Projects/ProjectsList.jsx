import { useEffect, useState } from 'react'
import { getAll } from '../../services/projectService'
import { Link } from 'react-router'

function ProjectsList() {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        getAll().then(data => setProjects(data))
    }, [])

    return (
        <div>
            <h1>🎓 Senior Projects 🎓</h1>

            {projects.map(project => (
                <div key={project.id}>
                    <h3>{project.title}</h3>
                    <p>{project.major}</p>

                    <Link to={`/projects/${project.id}`}>
                       Details
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default ProjectsList
