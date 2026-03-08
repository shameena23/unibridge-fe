import React, { useState, useEffect } from "react";

const Topbar = ({ toggleSidebar }) => {

    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {

        const userId = localStorage.getItem("userId");

        const res = await fetch(`http://localhost:8080/api/profile/${userId}`);
        const data = await res.json();

        setUser(data);
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const profileImage = user.profile_image
        ? user.profile_image
        : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (

        <div className="topbar">
            <button
                onClick={toggleSidebar}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
                ☰ {/* Hamburger icon */}
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-[#F9FAFB]">
                Uni<span className="text-[#22D3EE]">Bridge</span>
            </h1>

            <div className="user-box" onClick={() => setOpen(!open)}>

                <img src={profileImage} alt="profile" />

                <span>{user.name}</span>

                {open && (
                    <div className="dropdown">
                        <button onClick={logout}>Logout</button>
                    </div>
                )}

            </div>

        </div>

    );
};

export default Topbar;