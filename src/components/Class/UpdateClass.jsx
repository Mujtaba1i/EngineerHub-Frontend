import  { useState,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import * as classService from '../../services/classService'

const UpdatClass = () => {
  const navigate = useNavigate()
  const[formState, setFormState]= useState(null)
  const {id} = useParams()
  
useEffect(()=>{getdata()},[])
  
  async function getdata(){
    const data =await classService.getOne(id)
    setFormState(data)
  }
  
  

  const handleSubmit = async (e) => {
    e.preventDefault()
      const updated = await classService.update(id,{
        name: formState.name
      })

    navigate('/classes')
  }

  const handleChange = (e) => {
    setFormState({ ...formState, name: e.target.value })
  }

if (!formState) return <h1>HELP</h1>

  return (
    <form onSubmit={handleSubmit}>
      <label>Class Name</label>
      <input
        type="text"
        value={formState.name}
        onChange={handleChange}
      />
      <button type="submit">Update</button>
    </form>
  )
}

export default UpdatClass
