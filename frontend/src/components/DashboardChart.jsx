import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const data = [
    { day: "Mon", orders: 4 },
    { day: "Tue", orders: 7 },
    { day: "Wed", orders: 3 },
    { day: "Thu", orders: 8 },
    { day: "Fri", orders: 6 },
    { day: "Sat", orders: 5 },
    { day: "Sun", orders: 9 }
];

export default function DashboardChart() {

    return (

        <div className="bg-white rounded shadow p-5">

            <h2 className="text-xl font-semibold mb-4">
                Weekly Provisioning
            </h2>

            <ResponsiveContainer width="100%" height={300}>

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="orders"
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}