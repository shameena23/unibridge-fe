import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async () => {

        const res = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                password: password
            })
        });

        const data = await res.json();

        if (data.id) {
            alert("Login Success");
            localStorage.setItem("userId", data.id);
            localStorage.setItem("role", data.role);
            navigate("/dashboard");
        } else {
            alert("Login Failed");
        }

    };

    return (
        <div>
            <h2>UniBridge Login</h2>

            <input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>

        </div>
    );
}

export default Login;