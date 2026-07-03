import { useEffect, useState } from "react";
import api from "../api/api";

export default function Inventory() {

    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        api.get("/inventory")
            .then(res => setInventory(res.data))
            .catch(console.error);

    }, []);

    return (

        <div>

            <h1 className="text-3xl font-bold mb-6">
                Inventory
            </h1>

            <div className="grid grid-cols-3 gap-4 mb-6">

                <div className="bg-blue-100 rounded-lg p-5">
                    <p className="text-gray-600">Total Services</p>
                    <h2 className="text-3xl font-bold">
                        {inventory.length}
                    </h2>
                </div>

                <div className="bg-green-100 rounded-lg p-5">
                    <p className="text-gray-600">Active</p>
                    <h2 className="text-3xl font-bold">
                        {
                            inventory.filter(i => i.status === "ACTIVE").length
                        }
                    </h2>
                </div>

                <div className="bg-red-100 rounded-lg p-5">
                    <p className="text-gray-600">Failed</p>
                    <h2 className="text-3xl font-bold">
                        {
                            inventory.filter(i => i.status === "FAILED").length
                        }
                    </h2>
                </div>

            </div>
            
            <input
                className="border rounded p-2 mb-5 w-80"
                placeholder="Search customer..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />

            <table className="w-full border">

                <thead className="bg-gray-200">

                    <tr>

                        <th className="p-2 border">Service ID</th>

                        <th className="p-2 border">Customer</th>

                        <th className="p-2 border">Service</th>

                        <th className="p-2 border">Status</th>

                    </tr>

                </thead>

                <tbody>

                    {
                    inventory.length===0 ?

                    <tr>

                    <td
                    colSpan="4"
                    className="text-center p-8 text-gray-500"
                    >

                    No Active Services

                    </td>

                    </tr>

                    :

                    inventory
.filter(item =>
    item.customer_id
        .toLowerCase()
        .includes(search.toLowerCase())
)
.map((item)=>(

                        <tr key={item._id}>

                            <td className="border p-2">
                                {item.service_id}
                            </td>

                            <td className="border p-2">
                                {item.customer_id}
                            </td>

                            <td className="border p-2">
                                {item.service_type}
                            </td>

                            <td className="border p-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold
                                    ${
                                        item.status === "ACTIVE"
                                            ? "bg-green-100 text-green-700"
                                            : item.status === "FAILED"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {item.status}
                                </span>
                            </td>

                        </tr>

                    ))

}

                </tbody>

            </table>

        </div>

    );
}