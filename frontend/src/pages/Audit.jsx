import { useEffect, useState } from "react";
import api from "../api/api";

export default function Audit() {

    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        api.get("/audit-logs")
            .then((res) => setLogs(res.data))
            .catch(console.error);

    }, []);

    return (

        <div className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Audit Logs
            </h1>

            <div className="grid grid-cols-3 gap-5 mb-8">

                <div className="bg-blue-100 rounded-lg p-5">

                    <p>Total Activities</p>

                    <h2 className="text-3xl font-bold">

                        {logs.length}

                    </h2>

                </div>

                <div className="bg-green-100 rounded-lg p-5">

                    <p>Successful</p>

                    <h2 className="text-3xl font-bold">

                        {
                            logs.filter(
                                l => l.status === "SUCCESS"
                            ).length
                        }

                    </h2>

                </div>

                <div className="bg-red-100 rounded-lg p-5">

                    <p>Failed</p>

                    <h2 className="text-3xl font-bold">

                        {
                            logs.filter(
                                l => l.status === "FAILED"
                            ).length
                        }

                    </h2>

                </div>

            </div>

            <input

                className="border rounded p-2 mb-6 w-96"

                placeholder="Search User..."

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

            />

            <table className="w-full border">

                <thead className="bg-gray-200">

                    <tr>

                        <th className="border p-2">
                            User
                        </th>

                        <th className="border p-2">
                            Action
                        </th>

                        <th className="border p-2">
                            Status
                        </th>

                        <th className="border p-2">
                            Timestamp
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        logs

                        .filter(l =>
                            l.user
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        )

                        .map(log => (

                            <tr key={log._id}>

                                <td className="border p-2">

                                    {log.user}

                                </td>

                                <td className="border p-2">

                                    {log.action}

                                </td>

                                <td className="border p-2">

                                    <span
                                        className={
                                            log.status === "SUCCESS"
                                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-full"
                                            : "bg-red-100 text-red-700 px-3 py-1 rounded-full"
                                        }
                                    >

                                        {log.status}

                                    </span>

                                </td>

                                <td className="border p-2">

                                    {
                                        new Date(
                                            log.timestamp
                                        ).toLocaleString()
                                    }

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}