import React from 'react'
import HomePage from '../Components/HomePage/HomePage';
import Popular from '../Components/Popular/Popular';
import Offer from '../Components/Offer/Offer';
import NewCollections from '../Components/NewCollection/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
const Home=()=>{
  return (
    <div>
      <HomePage/>
      <Popular/>
      <Offer/>
      <NewCollections/>
      <NewsLetter/>
    </div>
  );
};
export default Home;
