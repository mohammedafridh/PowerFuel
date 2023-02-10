import React from 'react'
import './Orders.css'
import FuelStock from '../pageComponents/FuelStock/FuelStock'
import AllOrders from '../pageComponents/AllOrders/AllOrders'
import MainNavigation from '../Layouts/MainNavigation'

function Orders() {
  return (
    <div className="components">
        <MainNavigation />
        <AllOrders />
    </div>
  )
}

export default Orders