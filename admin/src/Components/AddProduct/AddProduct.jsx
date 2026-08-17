import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { API_URL } from '../../config';

const AddProduct = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [countInStock,setCountInStock]=useState(20); 
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "switches",
    new_price: "",
    old_price: ""
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

 const Add_Product = async () => {

  if (
    !productDetails.name.trim() ||
    !productDetails.old_price ||
    !productDetails.new_price ||
    !productDetails.category ||
    !image
  ) {
    alert("All Product Fields Are Required");
    return;
  }

  try {

    let product = {
      ...productDetails,
      countInStock,
    };

    let formData = new FormData();

    formData.append("product", image);

    // Upload Image First
    const uploadResponse = await fetch(
    `${API_URL}/upload`,
    {
    method: "POST",
    headers: {
      "auth-token": localStorage.getItem("admin-token"),
    },
    body: formData,
    }
    );
    const uploadData = await uploadResponse.json();

    if (!uploadData.success) {
      alert("Image Upload Failed");
      return;
    }

    // Add uploaded image URL to product
    product.image = uploadData.image_url;

    // Save Product
    const response = await fetch(
      `${API_URL}/addproduct`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token":
            localStorage.getItem("admin-token"),
        },
        body: JSON.stringify(product),
      }
    );

    const data = await response.json();

    if (data.success) {

      setOpenSnack(true);
      setTimeout(() => {
        navigate('/listproduct');
      }, 1500);
      setProductDetails({
        name: "",
        image: "",
        category: "switches",
        new_price: "",
        old_price: "",
      });

      setImage(false);

      document.getElementById("file-input").value = "";

    } else {

      alert("Failed To Add Product");

    }

  } catch (error) {

    console.log(error);

    alert("Something Went Wrong");

  }
};

  return (
    <div className='add-product'>
      <h2 className="addproduct-title">
        Add New Product
      </h2>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name='name'
          placeholder='Type here'
        />
      </div>

      <div className="addproduct-price">

        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="number"
            name="old_price"
            placeholder='Type Here'
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="number"
            name="new_price"
            placeholder='Type Here'
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Stock Quantity</p>
          <input
              type="number"
              value={countInStock}
              onChange={(e)=>
                  setCountInStock(e.target.value)
              }
          />
      </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>

        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className='add-product-selector'
        >
          <option value="switches">Switches</option>
          <option value="cables">Cables</option>
          <option value="mainswitch">Main Switch</option>
        </select>

      </div>

      <div className="upload-section">

        <p>Product Image</p>

        <div className="upload-box">

          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : upload_area}
              className="addproduct-thumbnail-img"
              alt=""
            />
          </label>

        </div>

        <input
          onChange={imageHandler}
          type="file"
          id="file-input"
          hidden
        />

      </div>

      <button
        onClick={Add_Product}
        className='addproduct-btn'
      >
        ADD PRODUCT
      </button>
      <Snackbar
          open={openSnack}
          autoHideDuration={3000}
          onClose={() => setOpenSnack(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={() => setOpenSnack(false)}
            severity="success"
            variant="filled"
          >
            Product Added Successfully
          </Alert>
        </Snackbar>
    </div>
  );
};

export default AddProduct;