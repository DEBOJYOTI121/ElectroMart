import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
import "./SalesChart.css";
const SalesChart = ({ stats }) => {
    const data = {
        labels: [
            "Pending",
            "Approved",
            "Packed",
            "Shipped",
            "Out For Delivery",
            "Delivered"
        ],
        datasets: [
            {
                label: "Orders",
                data: [
                    stats.pendingOrders,
                    stats.approvedOrders,
                    stats.packedOrders,
                    stats.shippedOrders,
                    stats.outForDeliveryOrders,
                    stats.deliveredCount
                ],
                backgroundColor: [
                    "#facc15",
                    "#22c55e",
                    "#f59e0b",
                    "#3b82f6",
                    "#06b6d4",
                    "#16a34a"
                ],
                borderRadius:8,
                barPercentage:0.55,
                categoryPercentage:0.6
            }
        ]
    };
    const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {

        legend: {
            display: false
        },
        title: {
            display: false
        },
        tooltip:{
        backgroundColor:"#1f2937",
        titleColor:"#fff",
        bodyColor:"#fff",
        cornerRadius:10,
        padding:12
    },        
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1,
                color: "#9ca3af",
                    font:{
                    size:13,
                    weight:"600"
                    },
                precision: 0
            },
            grid: {

                color: "rgba(255,255,255,.06)"
            }
        },
        x: {
            ticks: {
                color: "#9ca3af"
            },
            grid: {

                display: false
            }
        }
    }
};
    return (
        <div className="chart-card">
            <h2>📊 Order Analytics</h2>
            <p className="chart-subtitle">
                Distribution of customer orders by current delivery stage
            </p>
            <div className="chart-wrapper">
            <Bar
                data={data}
                options={options}
            />
        </div>
        </div>
    );
};
export default SalesChart;