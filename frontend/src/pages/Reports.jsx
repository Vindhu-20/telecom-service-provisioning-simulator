import { useEffect, useState } from "react";
import api from "../api/api";

export default function Reports() {

    const [report, setReport] = useState([]);
    const [search,setSearch]=useState("");

    useEffect(() => {
        api.get("/orders")
            .then(res => setReport(res.data))
            .catch(console.error);
    }, []);

    return (

        <div className="p-8">

            <h1 className="text-3xl font-bold mb-8">
                Provisioning Reports
            </h1>

            <div className="grid grid-cols-3 gap-5 mb-8">

                <div className="bg-blue-100 rounded-lg p-5">
                    <p>Total Reports</p>

                    <h2 className="text-3xl font-bold">
                        {report.length}
                    </h2>
                </div>

                <div className="bg-green-100 rounded-lg p-5">
                    <p>Completed</p>

                    <h2 className="text-3xl font-bold">
                        {
                            report.filter(r=>r.status==="COMPLETED").length
                        }
                    </h2>
                </div>

                <div className="bg-red-100 rounded-lg p-5">
                    <p>Failed</p>

                    <h2 className="text-3xl font-bold">
                        {
                            report.filter(r=>r.status==="FAILED").length
                        }
                    </h2>
                </div>

            </div>

            <div className="flex gap-4 mb-6">

                <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() =>
                        window.open("http://localhost:8000/reports/export/orders")
                    }
                >
                    Export Orders CSV
                </button>

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() =>
                        window.open("http://localhost:8000/reports/export/failures")
                    }
                >
                    Export Failures CSV
                </button>

                <button
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                    onClick={() =>
                        window.open("http://localhost:8000/reports/export/customers")
                    }
                >
                    Export Customers CSV
                </button>

            </div>

            <input
                className="border p-2 rounded mb-5 w-80"
                placeholder="Search customer..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />
            
            <table className="w-full border">

                <thead className="bg-gray-200">

                    <tr>

                        <th className="border p-2">
                            Customer
                        </th>

                        <th className="border p-2">
                            Service
                        </th>

                        <th className="border p-2">
                            Status
                        </th>

                    </tr>

                </thead>

                <tbody>

                {

                        report
.filter(r =>
    r.customer_id
        .toLowerCase()
        .includes(search.toLowerCase())
)
.map((r)=>(

                        <tr key={r._id}>

                            {/* <td className="border p-2">
                                {r.order_id}
                            </td> */}

                            <td className="border p-2">
                                {r.customer_id}
                            </td>

                            <td className="border p-2">
                                {r.service_type}
                            </td>

                            <td className="border p-2">

                                <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold
                                ${
                                    r.status==="COMPLETED"
                                    ?"bg-green-100 text-green-700"
                                    :r.status==="FAILED"
                                    ?"bg-red-100 text-red-700"
                                    :"bg-yellow-100 text-yellow-700"
                                }`}
                                >

                                    {r.status}

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