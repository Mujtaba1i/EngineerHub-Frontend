import { useEffect, useState, useContext } from 'react'
import { UserContext } from "../../contexts/UserContext";
import { getAll } from '../../services/projectService'
import { Link } from 'react-router'


function ProjectsList() {
    const { user } = useContext(UserContext);
    const [projects, setProjects] = useState([])

    useEffect(() => {
        getAll().then(data => setProjects(data))
    }, [])
    const userHasProject = !!(projects.find( project => parseInt(user?.sub) === project.user_id))

    return (
        <div>
            <h1>🎓 Senior Projects 🎓</h1>
            
            { (user && !userHasProject) && <a href="/projects/add">Add your Senior Project</a>}
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
