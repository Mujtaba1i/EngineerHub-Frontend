import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import * as classSerive from '../../services/classService'
import { useParams } from "react-router";

function ClassDashboard() {
    const { user } = useContext(UserContext);
    const{id} = useParams()

    const [classData, setClassData]= useState('')
    const [students, setStudents]= useState('')
    const [doctor, setDoctor]= useState('')

    async function getClassData(){
        const response = await classSerive.getOne(id)
        setDoctor(response.doctor)
        setStudents(response.enrollments)
        setClassData(response)
    }
    useEffect(() => {
        getClassData()
    }, [])


return (
    <div>
      <h2>{classData.name}</h2>

      <p>
        Doctor: <strong>{doctor.name}</strong>
      </p>

      <h3>students:</h3>
              {!students.length ? (
        <p>No students enrolled</p>
      ) : (
        <ul>
          {classData.enrollments.map((enroll) => (
            <li key={enroll.id}>
              {enroll.student.name}
            </li>
          ))}
        </ul>
      )}    

    </div>
  );
};


export default ClassDashboard
