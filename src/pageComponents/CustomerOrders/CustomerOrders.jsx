import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../Firebase/Firebase';
import { useUserAuth } from '../../Context/Context';
import emailjs from '@emailjs/browser';
import { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } from '../../configs/emailkey';
import { toast } from 'react-hot-toast';
import './styles.css';

const CustomerOrders = () => {

  const [customers, setCustomers] = useState([])
  const [stationDistrict, setStationDistrict] = useState();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [newStatus, setNewStatus] = useState('Inactive')
  const { user } = useUserAuth();

  console.log(user);

  const udateHandler = async (orderID, vehicleNumber, name, email, requestStatus) => {
    const customerOrder = query(doc(db, 'customerOrders', orderID));
    await updateDoc(customerOrder, {
      requestStatus: requestStatus == 'NotApproved' ? 'Approved' : 'NotApproved'
    });

    // const customer = query(doc(db, 'Users', orderID));
    // await updateDoc(customer, {
    //   token: 'expired'
    // });

    const templateParams = {
      subject: 'Your Fuel Request is Approved',
      to_name: name,
      to_email: email,
      message: `We wish to confirm you that your fuel request for vehicle number: ${vehicleNumber} is approved.`,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
        console.log('FAILED...', err);
      });

    toast.success("Customer Request Approved")
    toast.success("Email Sent")
  }

  const getStationDistrict = async () => {
    const docRef = doc(db, "fillingStations", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setStationDistrict(docSnap.data().district)
    } else {
      console.log("No such document!");
    }
  }

  const getOrders = () => {
    setLoading(true)
    const allData = onSnapshot(collection(db, 'customerOrders'), (snapshot) => {
      let list = []
      snapshot.docs.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setCustomers(list.filter(item => item.district == stationDistrict && item.requestStatus == 'NotApproved'))
      setLoading(false)
    }, (error) => {
      setError(error.message)
    });
    return () => {
      allData()
    };
  }

  useEffect(() => {
    getStationDistrict();
    getOrders();
  }, [stationDistrict]);

  return (
    <div className='allFillingStationTable' style={{ marginTop: '100px' }}>
      <h1>Customer Requests</h1>

      <div className="allFillingStationData">
        <table>
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Vehicle Type</th>
            <th>Vehicle Number</th>
            <th>Quota</th>
            <th>District</th>
            <th>Amount</th>
            <th>Request Status</th>
            {/* <th>Pumped</th> */}
            <th>Actions</th>
          </tr>

          {customers.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.number}</td>
              <td>{item.vehicleType}</td>
              <td>{item.vehicleNumber}</td>
              <td>{item.fuelAmount} Litres</td>
              <td>{item.district}</td>
              <td>{item.fuelCost}</td>
              <td>{item.requestStatus}</td>

              {/* <td>
                <button style={{
                  backgroundColor: 'blue',
                  border: 'none',
                  padding: 6,
                  color: 'white'
                }} onClick={() => udateHandler(item.id)}>Delete</button>
              </td> */}

              <td>
                <button className="button"
                  style={{
                    border: 'none',
                    padding: 6,
                    color: 'white',
                    cursor: 'pointer',
                    width: '100px'
                  }} onClick={() => udateHandler(item.id, item.vehicleNumber, item.name, item.email, item.requestStatus)}>Approve</button></td>
            </tr>
          ))}
        </table>
      </div>

    </div>
  )
}

export default CustomerOrders