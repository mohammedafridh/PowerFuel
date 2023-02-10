import React,{useState, useEffect} from 'react'
import {collection, onSnapshot} from 'firebase/firestore'
import { db } from '../../Firebase/Firebase';
import UpdateFuelStockModal from '../../Modals/UpdateFuelStockModal';
import './FuelStock.css'

const FuelStock = () => {

    const[quantity,setQuantity] = useState([])
    const[error, setError] = useState('')
    const[loginModel,setLoginModel] = useState(false)

    useEffect(()=>{
        const orderData = onSnapshot(collection(db,'fuelStock'),(snapshot)=>{
          let list = []
          snapshot.docs.forEach((doc)=>{
            list.push({
              id:doc.id,
              ...doc.data()
            });
          });
          setQuantity(list)
        },(error)=>{
          setError(error.message)
        });
        return ()=>{
          orderData()
        };
      },[]);

  return (
    <div className='stock'>
        {quantity.map((qnt)=>(
            <div className='fuelStock'>
            <span>Available Fuel Stock</span>
            <h1>{qnt.quantity}L</h1>
            <button onClick={()=>setLoginModel(true)}>Update Fuel Stock</button>
            <UpdateFuelStockModal 
            loginModel = {loginModel} 
            setLoginModel = {setLoginModel}
            quantity = {qnt}
          />
            </div>
        ))}
                    
        
    </div>
  )
}

export default FuelStock