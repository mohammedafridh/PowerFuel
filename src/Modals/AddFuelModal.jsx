import { useState } from 'react';
import './AcceptOrderModal.css'
import { Modal, useMantineTheme } from '@mantine/core';
import { doc, setDoc, query, updateDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { toast } from 'react-hot-toast';

function AddFuelModal({ loginModel, setLoginModel}) {
    const theme = useMantineTheme();
    const[fuel,setFuel] = useState('')
    const[price,setPrice] = useState('')
    const[quantity,setQuantity] = useState('')
    const[status,setStatus] = useState('Active')

    //setting data

    //adding data to firebase

    const fuelHandler = async (e) => {
        e.preventDefault()
        const addDetails = collection(db, 'fuelTypes')
        await addDoc(addDetails, {
            fuelType: fuel,
            price:price,
            quantity:quantity,
            status: status
        }).then(() => {
            setLoginModel(false)
            toast.success("New Fuel Added!")
        });
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

            <form onSubmit={fuelHandler} className='addUserForm'>

                <h3>Add Fuel Type</h3>

                <div>
                    <input
                        type="text"
                        className='userInput'
                        placeholder='Fuel Name'
                        onChange={(e) => setFuel(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="number"
                        className='userInput'
                        placeholder='Fuel Price'
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="number"
                        className='userInput'
                        placeholder='Quantity'
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <button type='submit' className="button">Add Fuel</button>
            </form>
        </Modal>
    );
}

export default AddFuelModal