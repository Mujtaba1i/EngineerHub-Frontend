import React from 'react'
import { Link } from 'react-router'

const ClassList = ({ classes }) => {
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
