import React, { useState, useEffect } from "react";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import "./FeaturedItem.css";

const FeaturedItems = () => {
  const [fillingStation, setFillingStation] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([])
  const [error,setError] = useState('')


  const compareBookings = () => {
    // get the current month
    const currentMonth = new Date().getMonth();

    // get the previous month
    const previousMonth = currentMonth - 1;

//current month
    // get the orders for the current month
    const currentMonthOrders = orders.filter((order) => {
      const orderMonth = new Date(order.date).getMonth();
      return orderMonth === currentMonth;
    });

    // get the deliveries for the current month
    const currentMonthDeliveries = deliveries.filter((delivery) => {
        const deliveryMonth = new Date(delivery.date).getMonth();
        return deliveryMonth === currentMonth;
      });


//previous month
    // get the bookings for the previous month
    const previousMonthOrders = orders.filter((order) => {
      const orderMonth = new Date(order.date).getMonth();
      return orderMonth === previousMonth;
    });

    // get the bookings for the previous month
    const previousMonthDeliveries = deliveries.filter((delivery) => {
        const deliveryMonth = new Date(delivery.date).getMonth();
        return deliveryMonth === previousMonth;
      });
    
    // compare the two bookings
    const comparedOrders = currentMonthOrders.length - previousMonthOrders.length;

    const compareOrdersDifference = () => {
        if (comparedOrders > 0) {
            return <ArrowUpward className="featuringIcon positive" />
        } else if (comparedOrders < 0) {
            return <ArrowDownward className="featuringIcon" />
        } else {
            return <ArrowDownward className="featuringIcon" />
        }   
    }

    // compare the two tours
    const comparedDeliveries = currentMonthDeliveries.length - previousMonthDeliveries.length;

    const compareDeliveriesDifference = () => {
        if (comparedDeliveries > 0) {
            return <ArrowUpward className="featuringIcon positive" />
        } else if (comparedDeliveries < 0) {
            return <ArrowDownward className="featuringIcon" />
        } else {
            return <ArrowDownward className="featuringIcon" />
        }   
    }

    return {comparedOrders, compareOrdersDifference, comparedDeliveries, compareDeliveriesDifference};
  }

  // get compare orders from the function
    const {comparedOrders, compareOrdersDifference} = compareBookings();

    // get compare Deliveries from the function
    const {comparedDeliveries, compareDeliveriesDifference} = compareBookings();

//get Orders from db
  useEffect(() => {
    const orderData = onSnapshot(collection(db, "orders"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
      setOrders(list);
    },
    (error) => {
        setError(error.message);
      })
    return () => {
        orderData();
    };
  }, []);

  //get Tours from db
  useEffect(() => {
    const deliveryData = onSnapshot(collection(db, "deliveries"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
      setDeliveries(list);
    },
    (error) => {
        console.log(error.message);
      })
    return () => {
        deliveryData();
    };
  }, []);

  //get Filling Stations from db
  useEffect(() => {
    const touristData = onSnapshot(collection(db, "fillingStations"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
      setFillingStation(list);
    },
    (error) => {
        console.log(error.message);
      })
    return () => {
        touristData();
    };
  }, []);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">All Filling Stations</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{fillingStation.length}</span>
        </div>
        <span className="featuredSub">All Filling Stations</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Orders</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{orders.length}</span>
          <span className="featuredMoneyRate">
            {comparedOrders}
            {compareOrdersDifference()}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>

      <div className="featuredItem">
        <span className="featuredTitle">Deliveries</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{deliveries.length}</span>
          <span className="featuredMoneyRate">
            {comparedDeliveries}
            {compareDeliveriesDifference()}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
};

export default FeaturedItems;