import { useEffect, useState } from "react";
import api from "../api/api";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";
import DashboardChart from "../components/DashboardChart";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis
} from "recharts";
import {
    Users,
    ShoppingCart,
    Server,
    CheckCircle,
    Clock,
    AlertTriangle,
    TrendingUp,
    Workflow
} from "lucide-react";

export default function Dashboard() {

    const [stats, setStats] = useState(null);

    useEffect(() => {

        api.get("/dashboard/stats")
            .then((res) => setStats(res.data))
            .catch(console.error);

    }, []);

    if (!stats) {
        return (
            <div className="p-8">
                Loading Dashboard...
            </div>
        );
        
    }

    const orderData = [

    {
        name: "Completed",
        value: stats.orders.completed
    },

    {
        name: "Pending",
        value: stats.orders.pending
    },

    {
        name: "Failed",
        value: stats.orders.failed
    }

];

const serviceData = stats.top_service_types.map(s => ({

    name: s.service_type,
    value: s.count

}));

const priorityData = Object.entries(
    stats.priority_distribution
).map(([name,value])=>({

    name,
    value

}));

const COLORS = [

    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#8b5cf6"

];

    return (

        <div className="p-8">

            <h1 className="text-3xl font-bold mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-3 gap-6">

                <Link to="/customers">
                    <StatCard
                        title="Customers"
                        value={stats.customers.total}
                        icon={<Users size={26}/>}
                        color="bg-gray-500"
                    />
                </Link>

                <Link to="/orders">
                    <StatCard
                        title="Orders"
                        value={stats.orders.total}
                        icon={<ShoppingCart size={26}/>}
                        color="bg-blue-500"
                    />
                </Link>

                <Link to="/inventory">
                    <StatCard
                        title="Active Services"
                        value={stats.active_services}
                        icon={<Server size={26}/>}
                        color="bg-green-500"
                    />
                </Link>

                
                <Link to="/orders">
                    <StatCard
                        title="Pending"
                        value={stats.orders.pending}
                        icon={<Clock size={26}/>}
                        color="bg-yellow-500"
                    />
                </Link>

                <Link to="/orders">
                    <StatCard
                        title="InProgress"
                        value={stats.orders.in_progress}
                        icon={<Workflow size={26}/>}
                        color="bg-purple-500"
                    />
                </Link>

                <Link to="/orders">
                    <StatCard
                        title="Completed"
                        value={stats.orders.completed}
                        icon={<CheckCircle size={26}/>}
                        color="bg-emerald-500"
                    />
                </Link>

                <Link to="/failures">
                    <StatCard
                        title="Failed"
                        value={stats.orders.failed}
                        icon={<AlertTriangle size={26}/>}
                        color="bg-red-500"
                    />
                </Link>

                <StatCard
                    title="Success Rate"
                    value={`${stats.success_rate}%`}
                    icon={<TrendingUp size={26}/>}
                    color="bg-blue-500"
                />
                
            </div>
            

            <div className="grid grid-cols-2 gap-8 mt-10">

    {/* Order Status Pie */}

    <div className="bg-white shadow rounded-lg p-5">

        <h2 className="font-bold mb-4">
            Order Status
        </h2>

        <ResponsiveContainer width="100%" height={300}>

            <PieChart>

                <Pie
                    data={orderData}
                    dataKey="value"
                    outerRadius={100}
                    label
                >

                    {orderData.map((entry, index) => (

                        <Cell
                            key={index}
                            fill={COLORS[index]}
                        />

                    ))}

                </Pie>

                <Tooltip />

            </PieChart>

        </ResponsiveContainer>

    </div>

    {/* Service Types */}

    <div className="bg-white shadow rounded-lg p-5">

        <h2 className="font-bold mb-4">
            Service Types
        </h2>

        <ResponsiveContainer width="100%" height={300}>

            <BarChart data={serviceData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" fill="#3b82f6" />

            </BarChart>

        </ResponsiveContainer>

    </div>

</div>

<div className="mt-8 bg-white shadow rounded-lg p-5">

    <h2 className="font-bold mb-4">
        Priority Distribution
    </h2>

    <ResponsiveContainer width="100%" height={300}>

        <BarChart data={priorityData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="value" fill="#22c55e" />

        </BarChart>

    </ResponsiveContainer>

</div>

        </div>

    );
}