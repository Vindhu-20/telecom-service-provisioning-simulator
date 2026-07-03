import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

export default function Customers() {

    const role = localStorage.getItem("role");
    const [customers, setCustomers] = useState([]);
    const [search,setSearch] = useState("");

    const [form, setForm] = useState({
        name: "",
        company_name: "",
        email: "",
        phone: ""
    });

    const loadCustomers = () => {
        api.get("/customers")
            .then(res => setCustomers(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const addCustomer = async (e) => {

        e.preventDefault();

        try {

            await api.post("/customers", form);
            toast.success("Customer Added");

            setForm({
                name: "",
                company_name: "",
                email: "",
                phone: ""
            });

            loadCustomers();

        } catch (err) {
            console.error(err);
            toast.error("Failed to add customer");
        }
    };

    return (

        <div className="p-8">

            <h1 className="text-3xl font-bold mb-6">
                Customers
            </h1>

            <form
                onSubmit={addCustomer}
                className="grid grid-cols-4 gap-4 mb-8"
            >

                <input
                    className="border p-2 rounded"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                />

                <input
                    className="border p-2 rounded"
                    placeholder="Company Name"
                    value={form.company_name}
                    onChange={(e)=>
                        setForm({
                            ...form,
                            company_name:e.target.value
                        })
                    }
                />

                <input
                    className="border p-2 rounded"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                />

                <input
                    className="border p-2 rounded"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            phone: e.target.value
                        })
                    }
                />

                {role !== "viewer" && (
                    <button>
                        Add Customer
                    </button>
                )}

            </form>
            
            <input
                className="border p-2 rounded mb-5"
                placeholder="Search customer..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />

            <table className="w-full border">

                <thead className="bg-gray-200">

                    <tr>

                        <th className="border p-2">Name</th>

                        <th className="border p-2">Company</th>

                        <th className="border p-2">Email</th>

                        <th className="border p-2">Phone</th>

                    </tr>

                </thead>

                <tbody>

                    {customers
.filter(c=>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company_name.toLowerCase().includes(search.toLowerCase())
)
.map((c)=>(

                    <tr key={c._id}>

                    <td className="border p-2">
                        {c.name}
                    </td>

                    <td className="border p-2">
                        {c.company_name}
                    </td>

                    <td className="border p-2">
                        {c.email}
                    </td>

                    <td className="border p-2">
                        {c.phone}
                    </td>

                    </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}