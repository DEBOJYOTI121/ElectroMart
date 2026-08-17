import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import SalesChart from "../SalesChart/SalesChart";
import { API_URL } from "../../config";
import {
  FaRupeeSign,
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);
const Dashboard = () => {
    const [stats, setStats] = useState({
    revenueGrowth: 0,
    lowStockProducts: [],
    topProducts: [],
    recentOrders: []
    });
  const [monthlySales, setMonthlySales] = useState({
    labels: [],
    revenue: []
    });
  console.log(stats);
  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const token =
                localStorage.getItem("admin-token");
            console.log(
                "Admin Token:",
                token
            );
            if (!token) {
                console.error(
                    "Admin token not found"
                );
                return;
            }
            // =====================================
            // DASHBOARD STATS
            // =====================================
            const dashboardResponse =
                await fetch(
                    `${API_URL}/dashboardstats`,
                    {
                        method: "GET",
                        headers: {
                            "auth-token": token
                        }
                    }
                );
            const dashboardData =
                await dashboardResponse.json();
            console.log(
                "Dashboard API Response:",
                dashboardData
            );
            if (dashboardResponse.ok &&
                dashboardData.success) {
                setStats(dashboardData);
            } else {
                console.error(
                    "Dashboard API Error:",
                    dashboardData
                );
            }
            // =====================================
            // MONTHLY SALES
            // =====================================
            const salesResponse =
                await fetch(
                    `${API_URL}/monthlysales`,
                    {
                        method: "GET",
                        headers: {
                            "auth-token": token
                        }
                    }
                );
            const salesData =
                await salesResponse.json();
            console.log(
                "Monthly Sales API Response:",
                salesData
            );
            if (
                salesResponse.ok &&
                salesData.success
            ) {
                setMonthlySales({
                    labels:
                        salesData.labels || [],
                    revenue:
                        salesData.revenue || []
                });
            } else {
                console.error(
                    "Monthly Sales API Error:",
                    salesData
                );
            }
        } catch (error) {
            console.error(
                "Dashboard Fetch Error:",
                error
            );
        }
    };
    fetchDashboardData();
}, []);
  const revenueChartData = {
    labels: monthlySales.labels,
    datasets: [
        {
            label: "Revenue",
            data: monthlySales.revenue,
            borderColor: "#16a34a",
            backgroundColor: "rgba(34,197,94,.25)",
            fill: true,
            tension: .4,
            pointRadius: 5,
            pointHoverRadius: 7
        }
      ]
    };
   const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {

            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {

                color: "#9ca3af"
            },
            grid: {
                color: "rgba(255,255,255,.08)"
            }
        },
        x: {
            ticks: {
                color: "#9ca3af"
            },
            grid: {
                display:false
                }
                }
            }
        }; 
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card revenue">
            <FaRupeeSign className="card-icon"/>
            <h2>Revenue</h2>
            <h1>₹{stats.currentMonthRevenue || 0}</h1>
            <div className="growth-box">
                <span
                    className={
                        stats.revenueGrowth >= 0
                            ? "growth positive"
                            : "growth negative"
                    }
                >
                    {stats.revenueGrowth >= 0 ? "▲" : "▼"}
                    {" "}
                    {Math.abs(stats.revenueGrowth).toFixed(1)}%
                </span>
            </div>
            <p className="card-subtitle">
                Compared to last month
            </p>
        </div>
        <div className="dashboard-card orders">
            <FaShoppingCart className="card-icon"/>
            <h2>Total Orders</h2>
            <h1>{stats.totalOrders || 0}</h1>
            <p className="card-subtitle">
                All Customer Orders
            </p>
        </div>
        <div className="dashboard-card users">
           <FaUsers className="card-icon"/>
            <h2>Customers</h2>
            <h1>{stats.totalUsers || 0}</h1>
            <p className="card-subtitle">
                Registered Users
            </p>
        </div>
        <div className="dashboard-card products">
        <FaBoxOpen className="card-icon"/>
        <h2>Products</h2>
        <h1>{stats.totalProducts || 0}</h1>
        <p className="card-subtitle">
            Available Products
        </p>   
        </div>        
    </div>
    <h2 className="section-title">
        Order Overview
    </h2>
    <div className="status-grid">
        <div className="status-card pending">
            <h3>Pending</h3>
            <h1>{stats.pendingOrders || 0}</h1>
        </div>
        <div className="status-card approved">
            <h3>Approved</h3>
            <h1>{stats.approvedOrders || 0}</h1>
        </div>
        <div className="status-card packed">
            <h3>Packed</h3>
            <h1>{stats.packedOrders || 0}</h1>
        </div>
        <div className="status-card shipped">
            <h3>Shipped</h3>
            <h1>{stats.shippedOrders || 0}</h1>
        </div>
        <div className="status-card out">
            <h3>Out For Delivery</h3>
            <h1>{stats.outForDeliveryOrders || 0}</h1>
        </div>
        <div className="status-card delivered">
            <h3>Delivered</h3>
            <h1>{stats.deliveredCount || 0}</h1>
        </div>
    </div>
    <SalesChart stats={stats}/>
        <div className="chart-card">
        <h2>💰 Monthly Revenue</h2>
        <p className="chart-subtitle">
        Revenue generated month by month
        </p>
        <div className="chart-wrapper">
        <Line
            data={revenueChartData}
            options={revenueChartOptions}
        />
        </div>
        </div>
        <div className="recent-orders">
        <div className="recent-header">
            <h2>Recent Orders</h2>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {stats.recentOrders?.map((order) => (
                    <tr key={order._id}>
                        <td>
                            #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td>
                            {order.customerName}
                        </td>
                        <td>
                            ₹{order.totalAmount}
                        </td>
                        <td>
                            <span
                                className={`table-status ${order.orderStatus.toLowerCase().replace(/\s/g,"-")}`}
                            >
                                {order.orderStatus}
                            </span>
                        </td>
                        <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                    </tr>
                ))}
             </tbody>
            </table>
        </div>
        <div className="top-products">
        <h2>🏆 Top Selling Products</h2>
        {stats.topProducts?.map((item, index) => (
        <div
            className="top-product-row"
            key={item._id}        
          >
            <div className="rank">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && "⭐"}
            </div>
            <img
                src={item.image}
                alt=""
            />
            <div className="product-details">
                <h4>
                    {item.productName}
                </h4>
                <p>
                    Sold : {item.totalSold}
                </p>
            </div>
        </div>
         ))}
        </div>
         <div className="low-stock">
         <h2>
         ⚠ Low Stock Products
         </h2>
        {
        stats.lowStockProducts?.length===0
        ?
        <p>
            Everything is well stocked.

        </p>
        :
        stats.lowStockProducts.map(product=>(
            <div
                key={product._id}
                className="stock-row"
            >
                <img
                    src={product.image}
                    alt=""
                />
                <div>
                    <h4>
                        {product.name}

                    </h4>
                    <p>
                        Stock :
                        {product.countInStock}
                    </p>
                </div>
            </div>
        ))
    }
         </div>
         </div>
  );
};
export default Dashboard;