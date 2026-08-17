import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';
import { API_URL } from '../../config';

const Popular = () => {

  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/popularinswitch`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPopularProducts(data);
      });
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR PRODUCTS</h1>
      <hr />

      <div className="popular-item">
        {popularProducts.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};
export default Popular;