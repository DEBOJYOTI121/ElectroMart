import React from 'react';
import './DescriptionBox.css';

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>

      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">
          Description
        </div>

        <div className="descriptionbox-nav-box fade">
          Reviews (122)
        </div>
      </div>

      <div className="descriptionbox-description">

        <p>
          Upgrade your home and workspace with premium-quality electrical
          products designed for performance, safety, and long-lasting
          reliability. From smart lighting systems and power accessories to
          advanced electronic appliances, our collection combines modern
          technology with elegant design to deliver the perfect experience for
          everyday use.
        </p>

        <p>
          Every product is carefully selected to ensure durability, energy
          efficiency, and superior functionality. Whether you're building a
          smart home setup, upgrading office equipment, or searching for
          reliable electrical essentials, our store offers trusted solutions at
          competitive prices with fast delivery and secure shopping.
        </p>

      </div>

    </div>
  );
};

export default DescriptionBox;