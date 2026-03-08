import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileView from './ProfileView';

const ProfilePage = ({ onBack }) => {
    const { id: urlId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchAllUserData = async () => {
            // Priority: 1. ID from URL (visiting someone) 2. ID from LocalStorage (visiting self)
            const activeId = urlId || localStorage.getItem("userId");

            if (!activeId) {
                console.error("No User ID found in URL or LocalStorage");
                setLoading(false);
                return;
            }

            try {
                const BASE_URL = "http://localhost:8080/api";

                // Fire all requests using the activeId
                const [profileRes, uploadRes, downloadRes] = await Promise.all([
                    fetch(`${BASE_URL}/profile/${activeId}`),
                    fetch(`${BASE_URL}/resources/upload-count/${activeId}`),
                    fetch(`${BASE_URL}/download/count/${activeId}`)
                ]);

                if (!profileRes.ok) throw new Error("Profile not found");

                const profile = await profileRes.json();
                const uploadCount = await uploadRes.json();
                const downloadCount = await downloadRes.json();

                setUserData({
                    ...profile,
                    stats: {
                        uploads: uploadCount,
                        downloads: downloadCount,
                        avgRating: profile.rating || 0
                    }
                });
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllUserData();
    }, [urlId]); // Re-run if we navigate to a different person's ID

    if (loading) return (
        <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#22D3EE]/20 border-t-[#22D3EE] rounded-full animate-spin"></div>
        </div>
    );

    if (!userData) return (
        <div className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center text-white">
            <p className="text-red-400 font-black mb-4 uppercase tracking-widest">User Session Not Found</p>
            <button onClick={onBack} className="text-[#22D3EE] hover:underline">Go Back</button>
        </div>
    );

    return <ProfileView userData={userData} onBack={onBack} role={role} />;
};

export default ProfilePage;