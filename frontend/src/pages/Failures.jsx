import { useEffect, useState } from "react";
import api from "../api/api";

export default function Failures() {

    const [failures, setFailures] = useState([]);
    const [search, setSearch] = useState("");
    const [summary, setSummary] = useState({
    total_failures: 0,
    failure_reasons: {}
});

    useEffect(() => {

    api.get("/reports/failures")
        .then((res) => {

            setFailures(res.data.failure_details);

            setSummary({
                total_failures: res.data.total_failures,
                failure_reasons: res.data.failure_reasons
            });

        })
        .catch(console.error);

}, []);

    return (

        <div className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Provisioning Failures
            </h1>

            <div className="grid grid-cols-3 gap-5 mb-8">

                <div className="bg-red-100 p-5 rounded-lg">

                    <p>Total Failures</p>

                    <h2 className="text-3xl font-bold">

                        {failures.length}

                    </h2>

                </div>

                <div className="bg-yellow-100 p-5 rounded-lg">

                    <p>Unique Orders</p>

                    <h2 className="text-3xl font-bold">

                        {
                            [...new Set(failures.map(f=>f.order_id))].length
                        }

                    </h2>

                </div>

                <div className="bg-blue-100 p-5 rounded-lg">

                    <p>Failure Types</p>

                    <h2 className="text-3xl font-bold">

                        {
                            [...new Set(failures.map(f=>f.failure_reason))].length
                        }

                    </h2>

                </div>

            </div>

            <input

                className="border rounded p-2 mb-6 w-96"

                placeholder="Search Order ID..."

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

            />

            <table className="w-full border">

                <thead className="bg-gray-200">

                    <tr>

                        <th className="border p-2">
                            Order
                        </th>

                        <th className="border p-2">
                            Failed Stage
                        </th>

                        <th className="border p-2">
                            Reason
                        </th>

                        <th className="border p-2">
                            Suggested Fix
                        </th>

                    </tr>

                </thead>

                <tbody>

                {

                    failures

                    .filter(f=>

                        f.order_id
                        .toLowerCase()
                        .includes(search.toLowerCase())

                    )

                    .map(f=>(

                        <tr key={f._id}>

                            <td className="border p-2">

                                {f.order_id}

                            </td>

                            <td className="border p-2">

                                {f.failed_stage}

                            </td>

                            <td className="border p-2 text-red-600 font-semibold">

                                {f.failure_reason}

                            </td>

                            <td className="border p-2">

                                {f.suggested_fix}

                            </td>

                        </tr>

                    ))

                }

                </tbody>

            </table>

        </div>

    );

}