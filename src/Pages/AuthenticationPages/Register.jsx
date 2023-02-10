import React, { useState } from 'react'
import './regAuthentication.css'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { db } from "../../Firebase/Firebase";
import { useUserAuth } from '../../Context/Context';
import { doc, setDoc } from "firebase/firestore";
import { toast } from 'react-hot-toast';
import loadingGif from '../../assets/loading-gif.gif';

const Register = () => {

  const [stationName, setStationName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [population, setPopulation] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Active')
  const [loading, setLoading] = useState(false);

  const { signUp } = useUserAuth();
  const navigate = useNavigate()

  const districtData = [
    { value: 'Hambanthota', label: 'Hambanthota' },
    { value: 'Matara', label: 'Matara' },
    { value: 'Galle', label: 'Galle' },
    { value: 'Badulla', label: 'Badulla' },
    { value: 'Monaragala', label: 'Monaragala' },
    { value: 'Trincomalee', label: 'Trincomalee' },
    { value: 'Batticaloa', label: 'Batticaloa' },
    { value: 'Ampara', label: 'Ampara' },
    { value: 'Kegalle', label: 'Kegalle' },
    { value: 'Rathnapura', label: 'Rathnapura' },
    { value: 'Matale', label: 'Matale' },
    { value: 'Kandy', label: 'Kandy' },
    { value: 'Nuwara-Eliya', label: 'Nuwara Eliya' },
    { value: 'Anuradhapura', label: 'Anuradhapura' },
    { value: 'Polonnaruwa', label: 'Polonnaruwa' },
    { value: 'Gampaha', label: 'Gampaha' },
    { value: 'Colombo', label: 'Colombo' },
    { value: 'Kalutara', label: 'Kalutara' },
    { value: 'Puttalam', label: 'Puttalam' },
    { value: 'Kurunegala', label: 'Kurunegala' },
    { value: 'Jaffna', label: 'Jaffna' },
    { value: 'Kilinochchi', label: 'Kilinochchi' },
    { value: 'Mannar', label: 'Mannar' },
    { value: 'Mullativu', label: 'Mullativu' },
    { value: 'Vavuniya', label: 'Vavuniya' },
  ]

  const [district, setDistrict] = useState(districtData.label)
  const districtHandler = (e) => {
    setDistrict(e.label)
  }

  const registerHandler = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true);
      signUp(email, password)
        .then((data) => {
          const addDetails = doc(db, "fillingStations", data.user.uid);
          const details = {
            stationName: stationName,
            district: district,
            email: email,
            population: population,
            contactNumber: contactNumber,
            status: status
          };
          setDoc(addDetails, details);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
      navigate("/home");
    }
    toast.success("Successfully Registered")
  }

  return (
    <div className="login">
      <div className="authForm">
        <form onSubmit={registerHandler} className="regForm">
          <h2>Power Fuel Registration</h2>

          <div className='authInput'>

            <div>
              <input
                type="text"
                className='loginInput'
                onChange={(e) => setStationName(e.target.value)}
                placeholder='Filling Station Name'
                value={stationName}
                required
              />
            </div>

            <div>
              <Select
                options={districtData}
                placeholder='Select District'
                onChange={districtHandler}
                className='typeDrop'
              />
            </div>

            <div>
              <input
                type="text"
                className='loginInput'
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder='Contact Number'
                value={contactNumber}
                required
              />
            </div>

            <div>
              <input
                type="number"
                className='loginInput'
                onChange={(e) => setPopulation(e.target.value)}
                placeholder='Population'
                value={population}
                required
              />
            </div>

            <div>
              <input
                type="text"
                className='loginInput'
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                value={email}
                required
              />
            </div>

            <div>
              <input
                type="password"
                className='loginInput'
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                value={password}
                required
              />
            </div>

            <div className='errorText'>{error}</div>

            <p className="regText">Already have an Account? <Link to='/login'>Login</Link></p>
          </div>

          {
            loading ?
              <button type='submit' className='button btn'>
                <img className='loading-gif' src={loadingGif} />
              </button>
              :
              <button type='submit' className='button btn'>
                Create Account
              </button>
          }

        </form>
      </div>
    </div>
  )
}

export default Register