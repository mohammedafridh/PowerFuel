import React from 'react'
import MainNavigation from '../Layouts/MainNavigation'
import AllDeliveries from '../pageComponents/Deliveries/AllDeliveries'

function DeliveriesPage() {
  return (
    <div className="components">
        <MainNavigation />
        <AllDeliveries />
    </div>
  )
}

export default DeliveriesPage