import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';

import Breadcum from '../Components/Breadcums/Breadcum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {

  const { all_product } = useContext(ShopContext);

  const { productId } = useParams();

  const product = all_product.find(
    (e) => e.id === Number(productId)
  );
  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [productId]);

  // Prevent crash if product not found
  if (!product) {
    return <h1 style={{color:"white"}}>Product Not Found</h1>;
  }

  return (
    <div>

      <Breadcum product={product} />

      <ProductDisplay product={product} />

      <DescriptionBox />

      <RelatedProducts
        currentId={product.id}
        category={product.category}
      />

    </div>
  );
};

export default Product;