import React from 'react'
import LatestProducts from './common/LatestProducts';
import FeaturedProducts from './common/FeaturedProducts';
import Layout from './common/Layout';
import Hero from './common/Hero';
import HomeRecommendations from './common/HomeRecommendations';


const Home = () => {
  return (
    <>
    
      <Layout>
        <Hero/>
        <LatestProducts/>
        <FeaturedProducts/>
        <HomeRecommendations/>
      </Layout>
 
    </>
  )
}

export default Home
