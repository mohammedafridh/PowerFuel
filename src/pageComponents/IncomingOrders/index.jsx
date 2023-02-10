import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../Firebase/Firebase';
import { useUserAuth } from '../../Context/Context';
import { toast } from 'react-hot-toast';
import loadingGif from '../../assets/loading-gif.gif';
import './styles.css'

const InComingOrders = () => {

  const [orders, setOrders] = useState([])
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const { user } = useUserAuth();

  const updateHandler = async (order) => {

    setLoading(true);
    try {
      const deliveries = query(doc(db, 'deliveries', order.stationID));
      await updateDoc(deliveries, {
        status: 'Delivered'
      });
      setLoading(false);
      toast.success("Order Marked as Received");
    } catch (err) {
      setLoading(false);
      return err
    }
  }

  useEffect(() => {
    setLoading(true)
    const orderData = onSnapshot(collection(db, 'deliveries'), (snapshot) => {
      let list = []
      snapshot.docs.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setOrders(list.filter((item) => item.stationID === user.uid && item.status == 'Processing'))
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
      <h1>Orders To Receive</h1>
      <div className='allOrdersData'>
        <table>
          <tr>
            <th>Order Id</th>
            <th>Provider</th>
            <th>Delivery Date</th>
            <th>Delivery Time</th>
            <th>Petrol</th>
            <th>Diesel</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>Power Fuel</td>
              <td>{order.deliveryDate}</td>
              <td>{order.deliveryTime}</td>
              <td>{order.petrol}L</td>
              <td>{order.diesel}L</td>
              <td>LKR {order.orderTotal}</td>
              <td>{order.status}</td>
              <td className='actionsRow'>

                {
                  loading ?
                    <button style={{
                      cursor: 'pointer',
                      backgroundColor: 'green',
                      border: 'none',
                      padding: 6,
                      color: 'white'
                    }}>
                      <img className='loading-gif' src={loadingGif} />
                    </button>
                    :
                    <button style={{
                      cursor: 'pointer',
                      backgroundColor: 'green',
                      border: 'none',
                      padding: 6,
                      color: 'white'
                    }} onClick={() => updateHandler(order)}>Received</button>
                }

              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  )
}

export default InComingOrders