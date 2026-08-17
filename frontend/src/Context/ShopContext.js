import React, { createContext, useState , useEffect} from 'react';
import all_product from '../Components/Assets/all_product';
import { API_URL } from '../config';
export const ShopContext = createContext(null);
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < all_product.length; index++) {
  cart[all_product[index].id] = 0;
   }
   return cart;
};
const ShopContextProvider = (props) => {
  const [all_product,setAll_Product]=useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [wishlistItems, setWishlistItems] = useState([]);
  const fetchWishlist = async () => {

    const token = localStorage.getItem("auth-token");

    if (!token) {
        setWishlistItems([]);
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/getwishlist`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify({})
            }
        );

        const data = await response.json();

        console.log("Wishlist response:", data);

        if (data.success) {
            setWishlistItems(data.wishlist);
        } else {
            setWishlistItems([]);
        }

    } catch (error) {
        console.log("Wishlist Error:", error);
        setWishlistItems([]);
    }
};
   const loadCartData = async () => {

    if (localStorage.getItem("auth-token")) {

        const response = await fetch(
            `${API_URL}/getcart`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({})
            }
        );

        const data = await response.json();

        if (data.success) {
            setCartItems(data.cartData);
        }
    }
  };
    useEffect(() => {
    const loadData = async () => {
        const response = await fetch(`${API_URL}/allproducts`);
        const data = await response.json();
        setAll_Product(data);
        await loadCartData();
        await fetchWishlist();
    };
    loadData();    
  }, []);
  // ADD PRODUCT
const addToCart = async (itemId) => {
    setCartItems((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
    }));
   if (localStorage.getItem("auth-token")) {
        try {
            const response = await fetch(
                `${API_URL}/addtocart`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "auth-token": localStorage.getItem("auth-token"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ itemId }),
                }
            );

            const data = await response.json();
            console.log(data);

        } catch (error) {
            console.log(error);
        }
    }
  };
  // REMOVE PRODUCT
  const removeFromCart = (itemId) => {
  setCartItems((prev) => ({
    ...prev,
    [itemId]: prev[itemId] > 1 ? prev[itemId] - 1 : 1,
  }));

  if(localStorage.getItem('auth-token')){
    fetch(`${API_URL}/removefromcart`,{
      method:'POST',
      headers:{
        Accept:'application/json',
        'auth-token':localStorage.getItem('auth-token'),
        'Content-Type':'application/json',
      },
      body:JSON.stringify({itemId}),
    });
  }
};
  const deleteFromCart = (itemId) => {

  setCartItems((prev)=>({
    ...prev,
    [itemId]:0
  }));

  if(localStorage.getItem('auth-token')){

    fetch(`${API_URL}/deletefromcart`,{      
      method:'POST',

      headers:{
        Accept:'application/json',
        'auth-token':localStorage.getItem('auth-token'),
        'Content-Type':'application/json',
      },

      body:JSON.stringify({itemId})

    })
    .then(res=>res.json())
    .then(data=>console.log(data));

  }

}
  // TOTAL AMOUNT
const getTotalCartAmount = () => {

  let totalAmount = 0;

  for (const item in cartItems) {

    if (cartItems[item] > 0) {

      const itemInfo = all_product.find(
        (product) => product.id === Number(item)
      );

      // Product may not exist in all_product
      if (!itemInfo) {
        console.warn(
          `Product with ID ${item} was not found in all_product`
        );
        continue;
      }

      totalAmount += itemInfo.new_price * cartItems[item];
    }
  }

  return totalAmount;
};
  // TOTAL ITEMS
  const getTotalCartItems = () => {

    let totalItem = 0;

    for (const item in cartItems) {

      if (cartItems[item] > 0) {

        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {

    all_product,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    loadCartData,
    wishlistItems,
    setWishlistItems,
    fetchWishlist 
    };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;