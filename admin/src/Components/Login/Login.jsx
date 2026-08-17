import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { API_URL } from "../../config";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {

        const response = await fetch(
            `${API_URL}/adminlogin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(
                "admin-token",
                data.token
            );

            localStorage.setItem(
                "admin-name",
                data.name
            );

            navigate("/");

        } else {

            alert(data.errors);

        }

    };

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>Electro Mart</h1>

                <h3>Admin Portal</h3>

                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button onClick={login}>
                    Login
                </button>

            </div>

        </div>

    );

};

export default Login;