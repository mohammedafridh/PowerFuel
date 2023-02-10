import { useState, useEffect } from 'react';
import { useUserAuth } from '../../Context/Context'
import { db } from "../../Firebase/Firebase";
import { doc, setDoc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { toast } from 'react-hot-toast';
import loadingGif from '../../assets/loading-gif.gif';
import './styles.css';

const RequestFuel = () => {

  const { user } = useUserAuth();

  useEffect(() => {
    getFillingStationData();
    getFuelTypes();
  }, [])

  const [formValue, setFormValue] = useState({
    petrol: '',
    diesel: '',
    petrolPrice: '',
    dieselPrice: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [stationDetails, setStationDetails] = useState({});
  const [open, setOpen] = useState(false);

  const getFillingStationData = async () => {
    const docRef = doc(db, "fillingStations", user?.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap?.exists()) {
      setStationDetails(docSnap?.data());
    } else {
      console.log("No such document!");
    }
  }

  const getFuelTypes = () => {
    const allData = onSnapshot(collection(db, 'fuelTypes'), (snapshot) => {
      let list = []
      snapshot.docs.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setFuelTypes(list.filter(item => item.status == 'Active'))
    }, (error) => {
      setError(error.message)
    });
    return () => {
      allData()
    };
  }

  const handleRequest = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true);
      const orderTotal = (formValue.petrol * formValue.petrolPrice) + (formValue.diesel * formValue.dieselPrice)

      const current = new Date();
      const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
      const addDetails = doc(db, "orders", user.uid);
      const details = {
        ...stationDetails,
        stationID: user.uid,
        petrol: formValue.petrol || 0,
        diesel: formValue.diesel || 0,
        orderTotal,
        date,
        status: 'Active'
      };
      setDoc(addDetails, details);
      setLoading(false);
      toast.success("Request Sent")
      clearFields();
      // setOpen(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      toast.error("Requet Failed")
      console.log(err);
    }
  }

  const clearFields = () => {
    setFormValue({ petrol: '', diesel: '' });
  }

  const handleChange = (e, fuel) => {
    if (fuel.fuelType == 'Petrol') {
      setFormValue({ ...formValue, petrol: e.target.value, petrolPrice: fuel.price })
    } else if (fuel.fuelType == 'Diesel') {
      setFormValue({ ...formValue, diesel: e.target.value, dieselPrice: fuel.price })
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <button onClick={() => setOpen(!open)}
        style={{
          marginTop: '50px',
          marginBottom: '50px',
          backgroundColor: 'blue',
          border: 'none',
          padding: 10,
          cursor: 'pointer',
          color: 'white',
          width: '200px'
        }}
      >
        Request Fuel
      </button>

      {
        open &&
        <div>
          <form onSubmit={handleRequest} className="regForm">
            <h2>Request Fuel</h2>

            {
              fuelTypes.map((item, index) => (
                <div style={{ marginTop: '20px' }} key={index}>
                  <div style={{ marginBottom: '20px' }}>
                    <label for="cars">Fuel Type: </label>

                    <b>{item.fuelType}</b>
                  </div>

                  <div>
                    <input
                      type="number"
                      style={{
                        padding: '10px 20px'
                      }}
                      onChange={(e) => handleChange(e, item)}
                      placeholder='No of Litres'
                      value={item.fuelType == 'Petrol' ? formValue.petrol : formValue.diesel}
                      required
                    />
                  </div>
                </div>
              ))
            }

            {
              loading ?
                <button type='submit' className='button btn'>
                  <img className='loading-gif' src={loadingGif} />
                </button>
                :
                <button
                  style={{
                    marginTop: '20px',
                    backgroundColor: 'green',
                    border: 'none',
                    padding: 10,
                    cursor: 'pointer',
                    color: 'white'
                  }}
                  type='submit' className='button btn'>
                  Send Request
                </button>
            }
          </form>
        </div>
      }
    </div>
  );
}

export default RequestFuel