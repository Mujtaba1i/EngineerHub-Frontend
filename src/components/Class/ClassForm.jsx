import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import * as classService from '../../services/classService'

const ClassForm = ({ classToUpdate, addClass, updateClass }) => {
  const navigate = useNavigate()

  const [formState, setFormState] = useState(
    classToUpdate ? classToUpdate : { name: '' }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (classToUpdate) {
      const updated = await classService.update(classToUpdate.id, {
        name: formState.name
      })
      updateClass(updated)
    } else {
      const created = await classService.create({
        name: formState.name
      })
      addClass(created)
    }

    navigate('/classes')
  }

  const handleChange = (e) => {
    setFormState({ ...formState, name: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Class Name</label>
      <input
        type="text"
        value={formState.name}
        onChange={handleChange}
      />
      <button type="submit">Save</button>
    </form>
  )
}

export default ClassForm
