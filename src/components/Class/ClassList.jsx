import { Link } from 'react-router'
import * as classService from '../../services/classService'
import { useEffect, useState } from 'react'

const ClassList = () => {

  const [classes,setClasses] = useState([])

  async function getClss(){
    const allClasses = await classService.getAll()
    setClasses(allClasses)
  }

  useEffect(()=>{getClss()},[])
  console.log(classes)
  

  return (
    <div>
      <h1>Classes</h1>

      {!classes.length ? (
        <p>No classes found</p>
      ) : (
        <ul>
          {classes.map(cls => (
            <li key={cls.id}>
              <Link to={`/classes/${cls.id}`}>
                {cls.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ClassList
