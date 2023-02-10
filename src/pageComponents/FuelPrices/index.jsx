import React, { useState, useEffect } from "react";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import "./styles.css";

const FuelPrices = () => {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fuelData = onSnapshot(collection(db, "fuelTypes"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
      setFuelTypes(list);
    },
      (error) => {
        setError(error.message);
      })
    return () => {
      fuelData();
    };
  }, []);

  return (
    <div className="featured">
      {
        fuelTypes.map((item, index) => (
          <div className="featuredItem">
            <span className="featuredTitle">{item.fuelType} Price</span>
            <div className="featuredMoneyContainer">
              <span className="featuredMoney">{item.price}</span>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default FuelPrices;