import { useState } from "react";
import api from "../api/api";

export default function Topology() {

    const [orderId, setOrderId] = useState("");
    const [topology, setTopology] = useState(null);

    const loadTopology = async () => {

        try {

            const res = await api.get(`/topology/${orderId}`);

            setTopology(res.data);

        } catch (err) {
            console.error(err);
            alert("Topology not found");
        }
    };

    return (

        <div className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Network Topology
            </h1>

            <div className="flex gap-4 mb-8">

                <input
                    className="border rounded p-2 w-96"
                    placeholder="Enter Order ID"
                    value={orderId}
                    onChange={(e)=>setOrderId(e.target.value)}
                />

                <button
                    className="bg-blue-600 text-white px-5 rounded"
                    onClick={loadTopology}
                >
                    Load
                </button>

            </div>

            {topology && (

                <>

                    <div className="grid grid-cols-3 gap-5 mb-8">

                        <div className="bg-blue-100 rounded-lg p-5">

                            <p>Customer</p>

                            <h2 className="text-xl font-bold">

                                {topology.customer_id}

                            </h2>

                        </div>

                        <div className="bg-green-100 rounded-lg p-5">

                            <p>Service</p>

                            <h2 className="text-xl font-bold">

                                {topology.service_type}

                            </h2>

                        </div>

                        <div className="bg-yellow-100 rounded-lg p-5">

                            <p>Status</p>

                            <h2 className="text-xl font-bold">

                                {topology.status}

                            </h2>

                        </div>

                    </div>

                    <h2 className="text-2xl font-semibold mb-4">
                        Sites
                    </h2>

                    <table className="w-full border mb-8">

                        <thead className="bg-gray-200">

                            <tr>

                                <th className="border p-2">Site</th>

                                <th className="border p-2">Role</th>

                            </tr>

                        </thead>

                        <tbody>

                            {topology.sites.map(site=>(

                                <tr key={site.name}>

                                    <td className="border p-2">
                                        {site.name}
                                    </td>

                                    <td className="border p-2">
                                        {site.role}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <h2 className="text-2xl font-semibold mb-4">
                        Connectivity
                    </h2>

                    <table className="w-full border">

                        <thead className="bg-gray-200">

                            <tr>

                                <th className="border p-2">
                                    Source
                                </th>

                                <th className="border p-2">
                                    Target
                                </th>

                                <th className="border p-2">
                                    Service
                                </th>

                                <th className="border p-2">
                                    Bandwidth
                                </th>

                                <th className="border p-2">
                                    QoS
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {topology.links.map((link,index)=>(

                                <tr key={index}>

                                    <td className="border p-2">
                                        {link.source}
                                    </td>

                                    <td className="border p-2">
                                        {link.target}
                                    </td>

                                    <td className="border p-2">
                                        {link.service}
                                    </td>

                                    <td className="border p-2">
                                        {link.bandwidth}
                                    </td>

                                    <td className="border p-2">
                                        {link.qos}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </>

            )}

        </div>

    );

}