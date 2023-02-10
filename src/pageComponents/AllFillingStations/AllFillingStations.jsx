import React, { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../Firebase/Firebase';
import './AllFillingStations.css'

const AllFillingStations = () => {

  const [fillingStations, setFillingStations] = useState([])

  useEffect(() => {
    const allData = onSnapshot(collection(db, 'fillingStations'), (snapshot) => {
      let list = []
      snapshot.docs.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setFillingStations(list)
    }, (error) => {
      return error;
    });
    return () => {
      allData()
    };
  }, []);

  return (
    <div className="allFillingStation">

      <div className="stationImage"></div>

    <div className='allFillingStationTable'>
      <h2>All Filling Stations</h2>

      <div className="allFillingStationData">
        <table>
          <tr>
            <th>Filling Station Id</th>
            <th>Name</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>District</th>
            <th>Population</th>
          </tr>
          {fillingStations?.map((fillingStation) => (
            <tr key={fillingStation.id}>
              <td>{fillingStation.id}</td>
              <td>{fillingStation.stationName}</td>
              <td>{fillingStation.contactNumber}</td>
              <td>{fillingStation.email}</td>
              <td>{fillingStation.district}</td>
              <td>{fillingStation.population}</td>
            </tr>
          ))}
        </table>
      </div>
      </div>
    </div>
  )
}

export default AllFillingStations