import React,{useEffect, useState} from 'react'
import '../AllOrders/AllOrders.css'
import {collection, onSnapshot, query, doc, updateDoc, getDoc} from 'firebase/firestore'
import { db } from '../../Firebase/Firebase';
import { useUserAuth } from '../../Context/Context';
import { toast } from 'react-hot-toast';

const AllDeliveries = () => {

    const [deliveries,setDeliveries] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    const[newStatus,setNewStatus] = useState('On Progress')
    const {user} = useUserAuth();
    const[loginModel,setLoginModel] = useState(false)

    const deleteHandler = async (deliverId) => {
        const order = query(doc(db,'deliveries',deliverId));
         await updateDoc(order, {
          status: 'Delivered'
         })
         toast.success("Delivery Status Updated")
       }

    //    const acceptHandler = (orderId)=>{
    //     console.log(orderId)
    //     // try{
    //     //   const addDetails = doc(db, "fillingStations", orderId);

    //     // }catch (err) {
    //     //   setError(err.message);
    //     //   console.log(err);
    //     // }
    //    }

       useEffect(()=>{
        setLoading(true)
        const deliveryData = onSnapshot(collection(db,'deliveries'),(snapshot)=>{
          let list = []
          snapshot.docs.forEach((doc)=>{
            list.push({
              id:doc.id,
              ...doc.data()
            });
          });
          setDeliveries(list.filter(item => item.status === 'Processing'))
          setLoading(false)
        },(error)=>{
          setError(error.message)
        });
        return ()=>{
            deliveryData()
        };
      },[]);

return(
  <div className="deliveries">
    <div className="deliveryImage"></div>
<div className='allOrders'>
    <h1>All Deliveries</h1>
    <div className='allOrdersData'>
         <table>
         <tr>
           <th>Order Id</th>
           <th>Filling Station Name</th>
           <th>Contact Number</th>
           <th>Petrol</th>
           <th>Diesel</th>
           <th>Total Amount</th>
           <th>Delivery Date</th>
           <th>Delivery Time</th>
           <th>Status</th>
           <th>Actions</th>
         </tr>
         {deliveries.map((delivery)=>(
         <tr key = {delivery.id}>
           <td>{delivery.id}</td>
           <td>{delivery.stationName}</td>
           <td>{delivery.contactNumber}</td>
           <td>{delivery.petrol}L</td>
           <td>{delivery.diesel}L</td>
           <td>LKR {delivery.totalAmount}</td>
           <td>{delivery.deliveryDate}</td>
           <td>{delivery.deliveryTime}</td>
           <td>{delivery.status}</td>
           <td className='actionsRow'>
            <button style={{backgroundColor:'#0D127F',
           border:'none', 
           padding:6,
           color:'white',
           cursor:'pointer',
           fontWeight:'bold'
         }} onClick = {()=> deleteHandler(delivery.id)}>Delivered</button>
         </td>
         </tr>
             ))}
       </table>
    </div>
</div>
</div>
    )
}

export default AllDeliveries