import React, { useContext } from 'react';
import './RelatedProducts.css';

import { ShopContext } from '../../Context/ShopContext';
import Item from '../Item/Item';

const RelatedProducts = ({ currentId, category }) => {

  const { all_product } = useContext(ShopContext);

  const relatedProducts = all_product.filter((item) => {
    return (
      item.category === category &&
      item.id !== currentId
    );
  });

  return (
    <div className='relatedproducts'>

      <h1>Related Products</h1>

      <hr />

      <div className="relatedproducts-item">

        {relatedProducts.slice(0, 4).map((item) => {
          return (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}

      </div>

    </div>
  );
};
export default RelatedProducts;