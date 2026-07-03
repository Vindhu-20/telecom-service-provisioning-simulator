import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {

    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();

    function handleLogout() {

        logout();

        navigate("/");

    }

    return (

        <header
            className="
                fixed
                left-64
                right-0
                top-0
                h-16
                bg-white
                shadow
                flex
                items-center
                justify-between
                px-6
                z-40
            "
        >

            <h2 className="text-2xl font-semibold">

                Telecom Service Provisioning Simulator

            </h2>

            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
            >

                Logout

            </button>

        </header>

    );

}