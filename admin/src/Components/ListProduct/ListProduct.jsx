import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import cross_icon from "../../assets/cross_icon.png";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { API_URL } from "../../config";
const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [stockDialog, setStockDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState("");
  const fetchInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/allproducts`);
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);
  const handleDeleteClick = (id) => {
  setSelectedProductId(id);
  setOpenDialog(true);
  };
  const remove_product = async (id) => {
  try {
    const response = await fetch(
      `${API_URL}/removeproduct`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("admin-token"),
        },
        body: JSON.stringify({ id }),
      }
    );
    const data = await response.json();
    if (data.success) {
      fetchInfo();
      setOpenSnack(true);
    }
  } catch (error) {
    console.log(error);
  }
};
const updateStock = async () => {
  try {
    const response = await fetch(
      `${API_URL}/updatestock`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("admin-token"),
        },
        body: JSON.stringify({
          id: selectedProduct.id,
          countInStock: Number(newStock),
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      fetchInfo();
      setStockDialog(false);
      setSelectedProduct(null);
      setNewStock("");
      setOpenSnack(true);
    }
  } catch (error) {
    console.log(error);
  }
};
const confirmDelete = async () => {
await remove_product(selectedProductId);
setOpenDialog(false);
setSelectedProductId(null);
};
  return (
    <div className="list-product">
      <h1>All Product List</h1>

      <div className="listproduct-format-main">
      <p>Product</p>
      <p>Title</p>
      <p>Old Price</p>
      <p>New Price</p>
      <p>Category</p>
      <p>Stock</p>
      <p>Edit</p>
      <p>Remove</p>
    </div>

      <div className="listproduct-allproducts">
        <hr />

        {allProducts.map((product, index) => {
          return (
            <React.Fragment key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img
                src={product.image}
                alt={product.name}
                className="listproduct-product-icon"
              />
              <p className="product-name">{product.name}</p>
              <p className="old-price">
                ₹{product.old_price}
              </p>
              <p className="new-price">
                ₹{product.new_price}
              </p>
              <p className="product-category">
                {product.category}
              </p>
              <p
                className={
                  product.countInStock <= 5
                    ? "stock-low"
                    : product.countInStock <= 10
                    ? "stock-medium"
                    : "stock-high"
                }
              >
                {product.countInStock}
              </p>
              <button
                className="edit-stock-btn"
                onClick={() => {
                  setSelectedProduct(product);
                  setNewStock(product.countInStock);
                  setStockDialog(true);
                }}
              >
                Edit
              </button>
              <img
                onClick={() => handleDeleteClick(product.id)}
                className="listproduct-remove-icon"
                src={cross_icon}
                alt="remove"
              />
            </div>
            <hr />
          </React.Fragment>
          );
        })}
      </div>
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
          Product Removed Successfully
        </Alert>
       </Snackbar>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>
            Delete Product
          </DialogTitle>

          <DialogContent>
            Are you sure you want to delete this product?
          </DialogContent>

          <DialogActions>

            <Button
              onClick={() => setOpenDialog(false)}
            >
              No
            </Button>

            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
            >
              Yes
            </Button>

          </DialogActions>
       </Dialog>
       <Dialog
          open={stockDialog}
          onClose={() => setStockDialog(false)}
        >
          <DialogTitle>
            Update Stock
          </DialogTitle>
          <DialogContent>
            <p style={{marginBottom:"15px"}}>
              {selectedProduct?.name}
            </p>
            <input
              type="number"
              value={newStock}
              onChange={(e)=>setNewStock(e.target.value)}
              style={{
                width:"100%",
                padding:"10px"
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={()=>setStockDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={updateStock}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default ListProduct;