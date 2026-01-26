import { useState } from 'react'
import { useNavigate } from 'react-router'
import * as classService from '../../services/classService'

const CreateClass = () => {
  const navigate = useNavigate()
  const[formState,setFormState] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
      const created = await classService.create({
        name: formState.name
      })

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
      <button type="submit">Create</button>
    </form>
  )
}

export default CreateClass
