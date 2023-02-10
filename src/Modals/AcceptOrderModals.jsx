import { useState } from 'react';
import './AcceptOrderModal.css'
import { Modal, useMantineTheme } from '@mantine/core';
import { useUserAuth } from '../Context/Context'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, query, updateDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '../Firebase/Firebase'
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import loadingGif from '../assets/loading-gif.gif';
import emailjs from '@emailjs/browser';
import { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } from '../configs/emailkey';

function AcceptOrderModal({ loginModel, setLoginModel, order }) {
  const theme = useMantineTheme();

  //setting data
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [stationID, setStationID] = useState(order.stationID)
  const [stationName, setStationName] = useState(order.stationName)
  const [stationEmail, setStationEmail] = useState(order.email);
  const [loading, setLoading] = useState(false);
  const [petrol, setpetrol] = useState(order.petrol)
  const [diesel, setDiesel] = useState(order.diesel)
  const [amount, setAmount] = useState(order.orderTotal)
  const [contact, setContact] = useState(order.contactNumber)
  const [error, setError] = useState('')
  const [fuelTypes, setFuelTypes] = useState([])
  const [status, setStatus] = useState('Processing')
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  useEffect(() => {
    setStationEmail(order.email)
    setStationName(order.stationName)
    setAmount(order.orderTotal)
    setContact(order.contactNumber)
    setpetrol(order.petrol)
    setDiesel(order.diesel)
    setStationID(order.stationID)
  }, [order])

  useEffect(() => {
    const allData = onSnapshot(collection(db, 'fuelTypes'), (snapshot) => {
      let list = []
      snapshot.docs.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setFuelTypes(list)
    }, (error) => {
      setError(error.message)
    });
    return () => {
      allData()
    };
  }, []);

  //adding data to firebase

  const orderHandler = async (e) => {
    e.preventDefault()
    setLoading(true);
    const addDetails = doc(db, 'deliveries', stationID)
    await setDoc(addDetails, {
      stationID: stationID,
      stationEmail: stationEmail,
      stationName: stationName,
      contactNumber: contact,
      petrol: petrol,
      diesel: diesel,
      totalAmount: amount,
      deliveryDate: deliveryDate,
      deliveryTime: deliveryTime,
      acceptedDate: date,
      status: status
    }).then(async () => {
      const updateOrder = query(doc(db, 'orders', order.id));
      await updateDoc(updateOrder, {
        status: 'inactive'
      })
      setLoginModel(false)

      const templateParams = {
        subject: 'Your Order is Accepted!',
        to_name: stationName,
        to_email: stationEmail,
        message: `We wish to confirm you that your order is confimed. Expected delivery date ${deliveryDate} (${deliveryTime})`,
      };

      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
        }, (err) => {
          console.log('FAILED...', err);
        });

      setLoading(false);
      toast.success("Order Accepted!")
      toast.success("Email Sent!")
    }).then(async () => {
      fuelTypes.forEach(async (item) => {
        if (item.fuelType == "Petrol") {
          const updateStockPetrol = query(doc(db, "fuelTypes", item.id));
          await updateDoc(updateStockPetrol, {
            quantity: item.quantity - petrol,
          });
          setLoading(false);
        }

        if (item.fuelType == "Diesel") {
          const updateStockDiesel = query(doc(db, "fuelTypes", item.id));
          await updateDoc(updateStockDiesel, {
            quantity: item.quantity - diesel,
          });
          setLoading(false);
        }
      });
    }).catch((error) => {
      setLoading(false);
      console.log(error);
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

      <form onSubmit={orderHandler} className='addUserForm' id="confirmOrderForm">
        <div>
          <input
            type="text"
            className='userInput'
            placeholder='Filling Station Name'
            value={stationName}
            disabled
            id="stationName"
          />
        </div>

        <div>
          <input
            type="text"
            className='userInput'
            placeholder='Petrol Litres'
            value={petrol}
            disabled
            id="petrol"
          />
        </div>

        <div>
          <input
            type="text"
            className='userInput'
            placeholder='Diesel Litres'
            value={diesel}
            disabled
            id="diesel"
          />
        </div>

        <div>
          <input
            type="text"
            className='userInput'
            placeholder='Amount'
            value={amount}
            disabled
            id="amount"
          />
        </div>

        <div>
          <input
            style={{
              cursor: 'pointer'
            }}
            id="deliveryDate"
            type="date"
            className='userInput'
            onChange={(e) => setDeliveryDate(e.target.value)}
            placeholder='Delivery Date'
            value={deliveryDate}
            required
          />
        </div>

        <div>
          <input
            style={{
              cursor: 'pointer'
            }}
            id="deliveryTime"
            type="time"
            className='userInput'
            onChange={(e) => setDeliveryTime(e.target.value)}
            placeholder='Delivery Date'
            value={deliveryTime}
            required
          />
        </div>

        {
          loading ?
            <button type='submit' className='button btn' id="confirmOrderLoading">
              <img className='loading-gif' src={loadingGif} />
            </button>
            :
            <button type='submit' className="button" id="confirmOrderBtn">Confirm Order</button>
        }
      </form>
    </Modal>
  );
}

export default AcceptOrderModal