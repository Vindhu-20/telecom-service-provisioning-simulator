import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    async function handleLogin(e) {

        e.preventDefault();

        try {

            const params = new URLSearchParams();

            params.append("username", username);
            params.append("password", password);

            const response = await api.post(

                "/login",

                params,

                {

                    headers: {

                        "Content-Type": "application/x-www-form-urlencoded"

                    }

                }

            );

            login(

                response.data.access_token,

                response.data.role

            );

            toast.success("Login Successful");

            navigate("/dashboard");

        }

        catch {

            setError("Invalid Username or Password");

            toast.error("Invalid Username or Password");

        }

    }

    return (

        <div className="h-screen flex justify-center items-center bg-slate-100">

            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">

                    Telecom OSS

                </h1>

                <input

                    className="border w-full p-3 rounded mb-4"

                    placeholder="Username"

                    value={username}

                    onChange={(e) => setUsername(e.target.value)}

                />

                <input

                    className="border w-full p-3 rounded mb-4"

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                />

                {

                    error &&

                    <p className="text-red-500 mb-4">

                        {error}

                    </p>

                }

                <button

                    className="bg-blue-600 text-white w-full p-3 rounded"

                >

                    Login

                </button>

            </form>

        </div>

    );

}