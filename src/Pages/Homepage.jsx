import React from 'react'
import Layout from '../Layouts/Layout'
import { useUserAuth } from '../Context/Context';
import Home from './Home'
import InComingOrders from '../pageComponents/IncomingOrders'
import FuelPrices from '../pageComponents/FuelPrices';
import MainNavigation from '../Layouts/MainNavigation';
import RequestFuel from '../pageComponents/RequestFuel/RequestFuel';

const Homepage = () => {

  const { user } = useUserAuth();

  return (
    <Layout>
      {
        user.uid == `${process.env.REACT_APP_ADMIN_ID}` ?
          <>
            <Home />
          </>
          :
          <>
            <FuelPrices />
            <RequestFuel />
            <InComingOrders />
          </>
      }
    </Layout>
  )
}

export default Homepage