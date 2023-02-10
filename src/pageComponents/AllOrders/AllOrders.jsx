import React, { useEffect, useState } from 'react'
import './AllOrders.css'
import { collection, onSnapshot, query, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../Firebase/Firebase';
import { useUserAuth } from '../../Context/Context';
import AcceptOrderModal from '../../Modals/AcceptOrderModals';

const AllOrders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [newStatus, setNewStatus] = useState('Inactive')
  const { user } = useUserAuth();
  const [loginModel, setLoginModel] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState({})

  const deleteHandler = async (orderId) => {
    const order = query(doc(db, 'orders', orderId));
    await updateDoc(order, {
      status: 'inactive'
    })
  }

  const orderData = (order) => {
    setSelectedOrder(order)
    setLoginModel(true)
  }

  useEffect(() => {
    setLoading(true)
    const orderData = onSnapshot(collection(db, 'orders'), (snapshot) => {
      let list = []
      snapshot.docs.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setOrders(list.filter(( item ) => item.status === 'Active'))
      setLoading(false)
    }, (error) => {
      setError(error.message)
    });
    return () => {
      orderData()
    };
  }, []);

  return (
    <div className="orders">
      <div className="orderImage"></div>
    <div className='allOrders'>
      <h1>All Orders</h1>
      <div className='allOrdersData'>
        <table>
          <tr>
            <th>Order Id</th>
            <th>Filling Station Name</th>
            <th>District</th>
            <th>Contact Number</th>
            <th>Petrol</th>
            <th>Diesel</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.stationName}</td>
              <td>{order.district}</td>
              <td>{order.contactNumber}</td>
              <td>{order.petrol}L</td>
              <td>{order.diesel}L</td>
              <td>LKR {order.orderTotal}</td>
              <td>{order.status}</td>
              <td className='actionsRow'>
                <button style={{
                   cursor: 'pointer',
                  backgroundColor: 'red',
                  border: 'none',
                  padding: 6,
                  color: 'white'
                }} onClick={() => deleteHandler(order.id)} id="deleteOrderBtn">Delete</button>

                <button style={{
                  cursor: 'pointer',
                  backgroundColor: 'green',
                  border: 'none',
                  padding: 6,
                  color: 'white'
                }} onClick={() => orderData(order)} id="acceptOrderBtn">Accept</button>
                <AcceptOrderModal
                  loginModel={loginModel}
                  setLoginModel={setLoginModel}
                  order={selectedOrder}
                />
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
    </div>
  )
}

export default AllOrders