import React from 'react'
import MainNavigation from '../Layouts/MainNavigation'
import FeaturedItems from '../pageComponents/FeaturedComponents/FeaturedItems'
import FuelTypes from '../pageComponents/FuelTypes/FuelTypes'

const Home = () => {
  return (
    <div className="homeComponents">
      <MainNavigation />
        <FeaturedItems />
        <FuelTypes />
    </div>
  )
}

export default Home