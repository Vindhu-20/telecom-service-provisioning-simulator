import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {

    return (

        <div className="bg-gray-100 min-h-screen">

            <Sidebar />

            <Navbar />

            <main className="ml-64 pt-20 p-6">

                <Outlet />

            </main>

        </div>

    );

}