import { useEffect, useState } from "react";
import api from "../api/api";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import WorkflowModal from "../components/WorkflowModal";
import TMF641Modal from "../components/TMF641Modal";
import { Link } from "react-router-dom";


export default function Orders() {

    const [orders, setOrders] = useState([]);

    const [search,setSearch] = useState("");
    const [form, setForm] = useState({
    customer_id: "",
    service_type: "VPRN",
    bandwidth: "",
    qos: "",
    location_a: "",
    location_b: "",
    priority: "Medium"
});
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [workflow, setWorkflow] = useState(null);
    const [tmf641, setTMF641] = useState(null);
    const loadOrders = () => {
        api.get("/orders")
            .then(res => setOrders(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const createOrder = async (e) => {

        e.preventDefault();

        try {

            await api.post("/orders", form);

            toast.success("Order Created Successfully");

            setForm({
                customer_id: "",
                service_type: "VPRN",
                bandwidth: "",
                qos: "",
                location_a: "",
                location_b: "",
                priority: "Medium"
            });

            loadOrders();

        } catch (err) {
            console.error(err);
        }
    };

    const advanceWorkflow = async (id) => {

        const ok = window.confirm(
            "Advance workflow to the next stage?"
        );

        if (!ok) return;

        await api.put(`/orders/${id}/workflow`);

        toast.success("Workflow Advanced");

        loadOrders();

    };

    const viewWorkflow = async (id) => {

        try {

            const res = await api.get(
                `/orders/${id}/workflow`
            );

            setWorkflow(res.data);

        } catch (err) {

            console.error(err);

            toast.error("Unable to load workflow");

        }

    };

    const viewTMF641 = async (id) => {

        try {

            const res = await api.get(

                `/orders/${id}/tmf641`

            );

            setTMF641(res.data);

        }

        catch(err){
            console.error(err);
            toast.error("Unable to load TMF641 payload");
        }

    };

    const executeProvisioning = async (id) => {

        const ok = window.confirm(
            "Execute provisioning for this order?"
        );

        if (!ok) return;

        await api.post(`/orders/${id}/execute`);

        toast.success("Provisioning Executed");

        loadOrders();
    };

    const simulateFailure = async (id) => {

        const ok = window.confirm(
            "Simulate provisioning failure?"
        );

        if (!ok) return;

        await api.post(`/orders/${id}/simulate-failure`);

        toast.error("Provisioning Failed");

        loadOrders();

    };

    const filteredOrders = orders
    .filter((o) =>
        o.customer_id
            .toLowerCase()
            .includes(search.toLowerCase())
    )
    .filter((o) =>
        statusFilter === "ALL"
            ? true
            : o.status === statusFilter
    );

    return (

        <div className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Orders
            </h1>

            <form
                onSubmit={createOrder}
                className="grid grid-cols-4 gap-4 mb-8"
            >

                <input
                    className="border p-2 rounded"
                    placeholder="Customer ID"
                    value={form.customer_id}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            customer_id: e.target.value
                        })
                    }
                />

                <select
                    className="border p-2 rounded"
                    value={form.service_type}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            service_type: e.target.value
                        })
                    }
                >
                    <option>VPRN</option>
                    <option>EPIPE</option>
                    <option>MPLS</option>
                    <option>EVPN</option>
                    <option>VPLS</option>
                    <option>INTERNET</option>
                </select>

                <input
                    className="border p-2 rounded"
                    placeholder="Bandwidth (100Mbps)"
                    value={form.bandwidth}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            bandwidth: e.target.value
                        })
                    }
                />

                <input
                    className="border p-2 rounded"
                    placeholder="QoS (Gold)"
                    value={form.qos}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            qos: e.target.value
                        })
                    }
                />

                <input
                    className="border p-2 rounded"
                    placeholder="Location A"
                    value={form.location_a}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            location_a: e.target.value
                        })
                    }
                />

                <input
                    className="border p-2 rounded"
                    placeholder="Location B"
                    value={form.location_b}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            location_b: e.target.value
                        })
                    }
                />

                <select
                    className="border p-2 rounded"
                    value={form.priority}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            priority: e.target.value
                        })
                    }
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>

                <button
                    className="bg-blue-600 text-white rounded"
                >
                    Create Order
                </button>

            </form>

            <div className="flex justify-between items-center mb-5">

                <input
                    placeholder="Search customer..."
                    className="border rounded p-2 w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="border rounded p-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                </select>

            </div>

            <p className="text-gray-500 mb-3">
                Showing {filteredOrders.length} Orders
            </p>

            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">

                <thead className="bg-blue-600 text-white">

                    <tr>

                        <th className="border p-2">Order ID</th>

                        <th className="border p-2">Customer</th>

                        <th className="border p-2">Service</th>

                        <th className="border p-2">Status</th>

                        <th className="border p-2">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredOrders.length === 0 ? (

                        <tr>

                            <td
                                colSpan="5"
                                className="text-center py-10 text-gray-500"
                            >
                                No Orders Found
                            </td>

                        </tr>

                    ) : (

                        filteredOrders.map((o) => (

                            <tr
                                key={o._id}
                                className="hover:bg-gray-100 transition"
                            >

                            <td className="border p-2">

                                <button
                                    onClick={() => viewTMF641(o._id)}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    {o._id}
                                </button>

                            </td>

                                <td className="border p-2">
                                    {o.customer_id}
                                </td>

                                <td className="border p-2">
                                    {o.service_type}
                                </td>

                                <td className="border p-2">
                                    <StatusBadge status={o.status} />
                                </td>

                                <td className="border p-2 space-x-2">

                                    <button
                                        className="bg-blue-600 text-white px-2 py-1 rounded"
                                        onClick={() => viewWorkflow(o._id)}
                                    >
                                        View
                                    </button>

                                    <button
                                        disabled={o.status === "COMPLETED"}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        onClick={() => advanceWorkflow(o._id)}
                                    >
                                        Advance
                                    </button>

                                    <button
                                        disabled={o.status === "COMPLETED"}
                                        className="bg-green-600 text-white px-2 py-1 rounded disabled:bg-gray-400"
                                        onClick={() => executeProvisioning(o._id)}
                                    >
                                        Execute
                                    </button>

                                    <button
                                        disabled={o.status === "COMPLETED"}
                                        className="bg-red-600 text-white px-2 py-1 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        onClick={() => simulateFailure(o._id)}
                                    >
                                        Fail
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>     

            </table>

            <WorkflowModal
                workflow={workflow}
                onClose={() => setWorkflow(null)}
            />

            <TMF641Modal
                data={tmf641}
                onClose={() => setTMF641(null)}
            />

        </div>
    );
}