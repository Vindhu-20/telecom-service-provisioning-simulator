import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./layouts/Layout";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Failures from "./pages/Failures";
import Audit from "./pages/Audit";
import Topology from "./pages/Topology";


import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/customers"
                        element={<Customers />}
                    />

                    <Route
                        path="/orders"
                        element={<Orders />}
                    />

                    <Route
                        path="/inventory"
                        element={<Inventory />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                    <Route
                        path="/failures"
                        element={<Failures />}
                    />

                    <Route
                        path="/audit"
                        element={<Audit />}
                    />

                    <Route
                        path="/topology"
                        element={<Topology />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );
}