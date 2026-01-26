import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import * as classService from '../../services/classService'
import * as studentClassService from '../../services/studentClassService'
import { UserContext } from '../../contexts/UserContext';

const ClassDetail = () => {
    const { user } = useContext(UserContext);
    const [cls, setCls] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()


    const getClass = async () => {
        const data = await classService.getOne(id)
        setCls(data)
    }

    useEffect(() => {
        getClass()
    }, [])

    

    const handleDelete = async () => {
        await classService.remove(id)
        navigate('/classes')
    }

    async function handleStudentDelete(student_id){
        const res = await studentClassService.removeStudentFromClass(id,student_id)
        getClass()
    }

    if (!cls) return <h1>Loading...</h1>
    const isDoctorOwner = cls.doctor_id === user.sub

    if (!(user?.role === 'doctor' && parseInt(user?.sub) === cls.doctor_id)) 
        {
        navigate('/')
    }
    
    return (
        <div>
            <h2>{cls.name}</h2>
            <p>Doctor: {cls.doctor?.name}</p>

            <h3>Students</h3>
            <ul>
                {cls.enrollments.map(en => (
                    <li key={en.id}>{en.student?.name}
                    <button onClick={()=>{handleStudentDelete(en.student.id)}}>Remove</button>
                    </li>
                ))}
            </ul>

            {true && (
                <>
                    <Link to={`/classes/${id}/edit`}>Edit</Link><br />
                    <Link to={`/classes/${id}/add-student`}>Add Student</Link>
                    <br />
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </div>
    )
}

export default ClassDetail
