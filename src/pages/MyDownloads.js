import React from "react";
import { Link } from "react-router-dom";

const MyDownload = () => {
    return (
        <div className="p-4">
            <h1 className="text-xl mb-4">Welcome to UniBridge</h1>
            <Link to="/upload">
                <button className="px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600">
                    Go to Dummy Page
                </button>
            </Link>
        </div>
    );
};

export default MyDownload;