import React, { useEffect, useState } from "react";
import "./Coupon.css";
import { API_URL } from "../../config";
const Coupon = () => {
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [coupons, setCoupons] = useState([]);
    const fetchCoupons = async () => {
        const response = await fetch(
        `${API_URL}/allcoupons`,
        {
        headers: {
            "auth-token": localStorage.getItem("admin-token"),
        },
        }
        );
        const data = await response.json();
        if (data.success) {
            setCoupons(data.coupons);
        }

    };
    useEffect(() => {
        fetchCoupons();
    }, []);
    const addCoupon = async () => {
    if (!code || !discount || !expiryDate) {
            alert("Please fill all fields.");
            return;
        }
        const response = await fetch(
            `${API_URL}/addcoupon`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("admin-token"),
                },
                body: JSON.stringify({
                    code,
                    discount,
                    expiryDate,
                }),
            }
        );
        const data = await response.json();
        alert(data.message);
        if (data.success) {
            setCode("");
            setDiscount("");
            setExpiryDate("");
            fetchCoupons();
        }

    };
    const deleteCoupon = async (id) => {
        const response = await fetch(
            `${API_URL}/deletecoupon`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("admin-token"),
                },
                body: JSON.stringify({ id }),
            }
        );
        const data = await response.json();
        if (data.success) {
            fetchCoupons();
        }
    };
    return (
        <div className="coupon">
            <h1>Coupon Management</h1>
            <div className="coupon-form">
                <input
                    type="text"
                    placeholder="Coupon Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Discount %"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                />
                <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                />
                <button onClick={addCoupon}>
                    Add Coupon
                </button>
            </div>
           <div className="coupon-table"> 
            <table>
                <thead>
                    <tr>
                        <th>Coupon</th>
                        <th>Discount</th>
                        <th>Expiry</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td>{coupon.code}</td>
                                <td>{coupon.discount}%</td>
                                <td>
                                    {new Date(coupon.expiryDate).toLocaleDateString()}
                                </td>
                                <td>
                                    <span className={coupon.isActive ? "active" : "inactive"}>
                                    {coupon.isActive ? "Active" : "Inactive"}
                                    </span>
                                    </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteCoupon(coupon._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            </div>
        </div>
    );
};
export default Coupon;