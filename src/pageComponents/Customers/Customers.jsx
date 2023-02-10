import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../Firebase/Firebase';
import { useUserAuth } from '../../Context/Context';
import { useNavigate } from 'react-router-dom'
import RequestFuel from '../RequestFuel/RequestFuel';
import { toast } from 'react-hot-toast';
import './styles.css';

const Customers = () => {

  const [customers, setCustomers] = useState([])
  const [stationDistrict, setStationDistrict] = useState();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [newStatus, setNewStatus] = useState('Inactive')
  const { user } = useUserAuth();
  const navigate = useNavigate()

  const getStationDistrict = async () => {
    const docRef = doc(db, "fillingStations", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setStationDistrict(docSnap.data().district)
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  const getCustomers = () => {
    setLoading(true)
    const allData = onSnapshot(collection(db, 'Users'), (snapshot) => {
      let list = []
      snapshot.docs.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setCustomers(list.filter(item => item.district == stationDistrict))
      setLoading(false)
    }, (error) => {
      setError(error.message)
    });
    return () => {
      allData()
    };
  }

  const renewCustomerTokens = async () => {
    customers.map((customer) => {
      const docRef = doc(db, "Users", customer.id);

      // Set the "token: field of all customers to Active
      updateDoc(docRef, {
        token: 'Active'
      });
    })
    toast.success("Tokens Renewed")
  }

  useEffect(() => {
    getStationDistrict();
    getCustomers();
  }, [stationDistrict]);


  return (
    <div className='allFillingStationTable' style={{ marginTop: '100px'}}>

      {/* <button onClick={() => renewCustomerTokens()}
        style={{
          marginTop: '50px',
          marginBottom: '50px',
          marginLeft: '20px',
          backgroundColor: 'green',
          border: 'none',
          padding: 10,
          cursor: 'pointer',
          color: 'white'
        }}
      >
        Renew Tokens
      </button> */}

      <h1>Customers</h1>

      <div className="allFillingStationData">
        <table>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Vehicle Type</th>
            <th>Vehicle Number</th>
            <th>Max Quota</th>
            <th>Token</th>
            <th>District</th>
          </tr>
          {customers.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.number}</td>
              <td>{item.vehicleType}</td>
              <td>{item.vehicleNumber}</td>
              <td>{item.getQuota}</td>
              <td>{item.token}</td>
              <td>{item.district}</td>
            </tr>
          ))}
        </table>
      </div>

    </div>
  )
}

export default Customers