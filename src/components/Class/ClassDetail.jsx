import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import * as classService from '../../services/classService'

const ClassDetail = ({ deleteClass, currentUser }) => {
    const [cls, setCls] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const getClass = async () => {
            const data = await classService.getOne(id)
            setCls(data)
        }
        getClass()
    }, [id])

    const handleDelete = async () => {
        await classService.remove(id)
        deleteClass(id)
        navigate('/classes')
    }

    if (!cls) return <h1>Loading...</h1>

    if (!(currentUser?.role === 'doctor' &&
        currentUser?.id === cls.doctor_id)) {
        navigate('/')
    }
    
    return (
        <div>
            <h2>{cls.name}</h2>
            <p>Doctor: {cls.doctor?.name}</p>

            <h3>Students</h3>
            <ul>
                {cls.enrollments.map(en => (
                    <li key={en.id}>{en.student?.name}</li>
                ))}
            </ul>

            {isDoctorOwner && (
                <>
                    <Link to={`/classes/${id}/edit`}>Edit</Link>
                    <br />
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </div>
    )
}

export default ClassDetail
