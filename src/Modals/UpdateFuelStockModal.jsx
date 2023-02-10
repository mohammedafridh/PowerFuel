import { useState } from 'react';
import './AcceptOrderModal.css'
import { Modal, useMantineTheme } from '@mantine/core';
import { useUserAuth } from '../Context/Context'
import { useNavigate } from 'react-router-dom'
import { doc, addDoc, query, updateDoc, collection } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { toast } from 'react-hot-toast';

function UpdateFuelStockModal({ loginModel, setLoginModel, quantity }) {
    const theme = useMantineTheme();

    //setting data
    const [updateQuantity, setUpdateQuantity] = useState(quantity.quantity)
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    //adding data to firebase

    const quantityHandler = async (e) => {
        e.preventDefault()
        const updateOrder = query(doc(db, 'fuelStock', quantity.id));
        console.log(quantity.id)
        await updateDoc(updateOrder, {
            quantity: updateQuantity
        }).then(() => {
            setLoginModel(false)
            toast.success("Fuel Stock Updated")
        })
    }

    return (
        <Modal
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.25}
            overlayBlur={0.5}
            size='20%'
            opened={loginModel}
            onClose={() => setLoginModel(false)}
        >

            <form onSubmit={quantityHandler} className='addUserForm'>

                <h3>Update Quantity</h3>

                <div>
                    <input
                        type="number"
                        className='userInput'
                        placeholder='Filling Station Name'
                        onChange={(e) => setUpdateQuantity(e.target.value)}
                        value={updateQuantity}
                    />
                </div>
                <button type='submit' className="button">Update Quantity</button>
            </form>
        </Modal>
    );
}

export default UpdateFuelStockModal