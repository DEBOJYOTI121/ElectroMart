import './App.css';
import Navbar from './Components/Navbar/Navbar';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import About from './Pages/About';
import Contact from './Pages/Contact';
import MyOrders from "./Pages/MyOrders";
import Checkout from "./Pages/Checkout";
import Payment from "./Pages/Payment";
import { useState } from 'react';
import Footer from './Components/Footer/Footer';
import wire_banner from './Components/Assets/banner_wire.png';
import switches_banner from './Components/Assets/banner_switches.png';
import circuitbreaker_banner from './Components/Assets/banner_circuitbreaker.png';
import Wishlist from "./Pages/Wishlist";
function App() {

  const [darkMode, setDarkMode] = useState(true);

  return (

    <div className={darkMode ? "app dark" : "app light"}>

      <BrowserRouter>

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <Routes>

          <Route path='/' element={<Home />} />
          <Route
                path='/wire'
                element={
                  <ShopCategory
                    category="wire"
                    banner={wire_banner}
                  />
                }
              />

              <Route
                path='/switches'
                element={
                  <ShopCategory
                    category="switches"
                    banner={switches_banner}
                  />
                }
              />

              <Route
                path='/circuitbreaker'
                element={
                  <ShopCategory
                    category="circuitbreaker"
                    banner={circuitbreaker_banner}
                  />
                }
              />
          <Route path='/product' element={<Product />} />
          <Route path='/product/:productId' element={<Product />} />

          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cart' element={<Cart />} />
          <Route path="/myorders" element={<MyOrders />}/>
          <Route
            path='/login'
            element={<Login darkMode={darkMode} />}
          />

          <Route
            path='/signup'
            element={<Signup darkMode={darkMode} />}
          />
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/cart/payment" element={<Payment />}/>
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <Footer/>
      </BrowserRouter>

    </div>
  );
}

export default App;