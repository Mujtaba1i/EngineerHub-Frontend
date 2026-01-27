import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getOne, remove } from '../../services/projectService'
import { UserContext } from "../../contexts/UserContext";

function ProjectDetails() {
    const { user } = useContext(UserContext);
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)

    useEffect(() => {
        getOne(id).then(data => setProject(data))
    }, [id])

    const handleDelete = async () => {
        await remove(id)
        navigate('/projects')
    }

    if (!project) return <p>Loading...</p>

    const isOwner = Number(user?.sub) === project.user_id

    return (
        <div>
            <h1>Project Title : {project.title}</h1>
            <p>Summary :{project.summary}</p>

            <h4>Contact : </h4>
            <p>Email: {project.contact_email}</p>
            <p>Phone: {project.contact_phone}</p>
            <p>LinkdIn: {project.contact_linkdin}</p>
            {isOwner && (
                <>
                    <button onClick={() => navigate(`/projects/edit/${id}`)}>
                        Edit
                    </button>
                    <button onClick={handleDelete}>
                        Delete
                    </button>
                </>
            )}
        </div>
    )
}

export default ProjectDetails
