import React, { useEffect, useState } from 'react'
import './FuelTypes.css'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../Firebase/Firebase';
import UpdateFuelTypeModel from '../../Modals/UpdateFuelTypeModal';

const FuelTypes = () => {

  const [fuelTypes, setFuelTypes] = useState([])
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const [currentFuelType, setCurrentFuelType] = useState({})
  const [model, setModel] = useState(false)

  const updateFuel = (item) => {
    setCurrentFuelType(item)
    setModel(true)
  }

  useEffect(() => {
    setLoading(true)
    const orderData = onSnapshot(collection(db, 'fuelTypes'), (snapshot) => {
      let list = []
      snapshot.docs.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setFuelTypes(list.filter((item) => item.status === 'Active'))
      setLoading(false)
    }, (error) => {
      setError(error.message)
    });
    return () => {
      orderData()
    };
  }, []);

  return (
    <div className='allOrders'>
      <div className="fuelHeaders">
        <h1>All Fuels</h1>
      </div>

      <div className='allOrdersData'>
        <table>
          <tr>
            <th>Fuel Id</th>
            <th>Fuel Name</th>
            <th>Price (Per Litre)</th>
            <th>Stock (Litres)</th>
            <th>Actions</th>
          </tr>
          {fuelTypes.map((fuelTyp) => (
            <tr key={fuelTyp.id}>
              <td>{fuelTyp.id}</td>
              <td>{fuelTyp.fuelType}</td>
              <td>{fuelTyp.price}/=</td>
              <td>{fuelTyp.quantity} L</td>
              <td className='actionsRow'>
                <button style={{
                  backgroundColor: '#0D127F',
                  borderRadius: 5,
                  border: 'none',
                  padding: 6,
                  color: 'white'
                }} onClick={() => updateFuel(fuelTyp)}>Update</button>
                <UpdateFuelTypeModel
                  loginModel={model}
                  setLoginModel={setModel}
                  data={currentFuelType}
                />
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  )
}

export default FuelTypes