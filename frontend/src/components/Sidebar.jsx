import { Link } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Server,
    FileBarChart2,
    AlertTriangle,
    ClipboardList,
    Network
} from "lucide-react";

export default function Sidebar() {

    return (

        <aside
            className="
                fixed
                left-0
                top-0
                bottom-0
                w-64
                bg-slate-900
                text-white
                p-5
                overflow-y-auto
                shadow-lg
                z-50
            "
        >

            <h1 className="text-2xl font-bold mb-10">
                Telecom OSS
            </h1>

            <nav className="flex flex-col gap-6">

                <Link to="/dashboard" className="flex items-center gap-3 hover:text-blue-300">
                    <LayoutDashboard size={18}/>
                    Dashboard
                </Link>

                <Link to="/customers" className="flex items-center gap-3 hover:text-blue-300">
                    <Users size={18}/>
                    Customers
                </Link>

                <Link to="/orders" className="flex items-center gap-3 hover:text-blue-300">
                    <ShoppingCart size={18}/>
                    Orders
                </Link>

                <Link to="/inventory" className="flex items-center gap-3 hover:text-blue-300">
                    <Server size={18}/>
                    Inventory
                </Link>

                <Link to="/reports" className="flex items-center gap-3 hover:text-blue-300">
                    <FileBarChart2 size={18}/>
                    Reports
                </Link>

                <Link to="/failures" className="flex items-center gap-3 hover:text-blue-300">
                    <AlertTriangle size={18}/>
                    Failures
                </Link>

                <Link to="/audit" className="flex items-center gap-3 hover:text-blue-300">
                    <ClipboardList size={18}/>
                    Audit Logs
                </Link>

                <Link to="/topology" className="flex items-center gap-3 hover:text-blue-300">
                    <Network size={18}/>
                    Topology
                </Link>

            </nav>

        </aside>

    );

}