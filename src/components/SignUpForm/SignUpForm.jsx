import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [role,setRole] =useState('')
  const [activeForm,setActiveForm] =useState('')
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConf: '',
    uni_id: '',
    major: '',
    department: '',
    phone_num: '',
    office_num: '',
    license: '',
  });
  
  const { setUser } = useContext(UserContext);

  const roleRequirements = {
  student: ['uni_id', 'major'],
  graduate: ['uni_id', 'major'],
  doctor: ['department', 'phone_num', 'office_num'],
  institution: ['license']
  };

  const { name, email, password, passwordConf ,uni_id,major,department,phone_num,office_num, license } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const payload = {...formData, role}
    delete payload.passwordConf
    try {
      if (payload.uni_id) payload.uni_id = parseInt(payload.uni_id)
    } catch (err) {
      console.log('error convering to int')
    }
    for (const field in payload) {
      if (payload[field] === '')  {
        delete payload[field];
      }
    }
    
    console.log(payload);
    const user = await authService.signUp(payload)
    setUser(user); // this line will print the form data to the console
    console.log(formData);
    navigate('/')
  };

  const isFormInvalid = () => {
    if (!(name && email && password && password === passwordConf && role)) {
      return true;
    }
    if (roleRequirements[role]) {
      for (const field of roleRequirements[role]) {
        if (!formData[field]) return true;
      }
    }

    return false;
  };

function handleOptionSelection(evt){
  setRole(evt.target.value)
}

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>Name:</label>
          <input type='text' autoComplete='off' id='name' value={formData.name} name='name' onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor='email'>Email:</label>
          <input type='text' autoComplete='off' id='email' value={formData.email} name='email' onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input type='password' autoComplete='off' id='password' value={formData.password} name='password' onChange={handleChange} required/>
        </div>
        <div>
          <label htmlFor='passwordConf'>Confirm Password:</label>
          <input type='password' autoComplete='off' id='passwordConf' value={formData.passwordConf} name='passwordConf' onChange={handleChange} required/>
        </div>
        <div>
          <label htmlFor='role'>role:</label>
          <select id='role' onChange={handleOptionSelection} value={role} name='role' required>
            <option value=''>Select Role</option>
            <option value='student'>Student</option>
            <option value='gradute'>Graduate</option>
            <option value='doctor'>Doctor</option>
            <option value='institution'>Institution</option>
          </select>
          {(role === 'student' || role === 'gradute') && (<>
          <div>
            <label htmlFor='uni_id'>University ID:</label>
            <input type='number' autoComplete='off' id='uni_id' value={formData.uni_id} name='uni_id' onChange={handleChange}/>
          </div> 
          <div> 
            <label htmlFor='major'>Major:</label>
            <input type='text' autoComplete='off' id='major' value={formData.major} name='major' onChange={handleChange}/>
          </div>
          <div>
            <label htmlFor='phone_num'>Phone Number:</label>
            <input type='text' autoComplete='off' id='phone_num' value={formData.phone_num} name='phone_num' onChange={handleChange}/>
          </div>
            </>)}
            {role === 'doctor' && (<>
          <div>
            <label htmlFor='department'>Department:</label>
            <input type='text' autoComplete='off' id='department' value={formData.department} name='department' onChange={handleChange}/>
          </div>
          <div>
            <label htmlFor='phone_num'>Phone Number:</label>
            <input type='text' autoComplete='off' id='phone_num' value={formData.phone_num} name='phone_num' onChange={handleChange}/>
          </div>
          <div>
            <label htmlFor='office_num'>Office Number:</label>
            <input type='text' autoComplete='off' id='office_num' value={formData.office_num} name='office_num' onChange={handleChange}/>
          </div>
            </>)}
            {role === 'institution' && (<>
          <div>
            <label htmlFor='license'>License:</label>
            <input type='text' autoComplete='off' id='license' value={formData.license} name='license' onChange={handleChange}/>
          </div>
          </>)}
        </div>
        <div>
        </div>
        <div>
          <button disabled={isFormInvalid()}>Sign Up</button>
          <button onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;

