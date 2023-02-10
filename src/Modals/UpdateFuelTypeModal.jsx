import { useState,useEffect } from 'react';
import './AcceptOrderModal.css'
import { Modal, useMantineTheme } from '@mantine/core';
import { doc, query, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { toast } from 'react-hot-toast';

function UpdateFuelTypeModel({ loginModel, setLoginModel,data}) {
    const theme = useMantineTheme();
    const[fuel, setFuel] = useState(data.fuelType)
    const[price, setPrice] = useState(data.price)
    const[quantity, setQuantity] = useState(data.quantity)

    //setting data
    useEffect(()=>{
        setFuel(data.fuelType)
        setPrice(data.price)
        setQuantity(data.quantity)
    },[data])

    //adding data to firebase
    const updateDetails = async(data)=>{
        const item = query(doc(db, 'fuelTypes', data.id));
        await updateDoc(item, {
          price:price,
          quantity:quantity
        }).then(()=>{
            setLoginModel(false)
            toast.success("Fuel Details Updated Successfully!")
        })
      }

    return (
        <Modal
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.25}
            overlayBlur={0.5}
            size='30%'
            opened={loginModel}
            onClose={() => setLoginModel(false)}
        >

            <div className='addUserForm'>
                <h3>Update Fuel Type</h3>

                <div>
                    <input
                        type="text"
                        className='userInput'
                        value = {fuel}
                        diabled
                    />
                </div>

                <div>
                    <input
                        type="number"
                        className='userInput'
                        onChange={(e) => setPrice(e.target.value)}
                        value = {price}
                    />
                </div>

                <div>
                    <input
                        type="number"
                        className='userInput'
                        onChange={(e) => setQuantity(e.target.value)}
                        value = {quantity}
                    />
                </div>

                <button type='submit' className="button" onClick = {()=>updateDetails(data)}>Update Fuel</button>
            </div>
        </Modal>
    );
}

export default UpdateFuelTypeModel