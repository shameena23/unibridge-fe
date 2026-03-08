import React, { useEffect, useState, useMemo } from "react";
import ResourceCard from "../components/ResourceCard";

// Receive props from Dashboard
const ResourceList = ({ searchQuery = "", filters = { subject: 'All', category: 'All', rating: 0 } }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("http://192.168.1.9:8080/api/resources");
        const data = await res.json();

        const resourcesWithUser = await Promise.all(
          data.map(async (resource) => {
            if (!resource.uploadedBy) {
              return { ...resource, uploadedByName: "Unknown User" };
            }

            try {
              const userRes = await fetch(`http://192.168.1.9:8080/api/profile/${resource.uploadedBy}`);
              if (!userRes.ok) throw new Error("User not found");
              const userData = await userRes.json();
              return { ...resource, uploadedByName: userData.name };
            } catch (userErr) {
              return { ...resource, uploadedByName: "Error loading name" };
            }
          })
        );

        setResources(resourcesWithUser);
      } catch (err) {
        console.error("Critical fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // --- Logic: Filter the loaded resources based on props ---
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      // 1. Search Logic (Check title or the author name we just fetched)
      const matchesSearch =
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.uploadedByName?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Subject Filter
      const matchesSubject =
        filters.subject === "All" ||
        item.subject === filters.subject;

      // 3. Category Filter
      const matchesCategory =
        filters.category === "All" ||
        item.category === filters.category;

      // 4. Rating Filter (assuming your API returns a 'rating' field)
      const matchesRating =
        (item.rating || 0) >= filters.rating;

      return matchesSearch && matchesSubject && matchesCategory && matchesRating;
    });
  }, [resources, searchQuery, filters]);

  if (loading) {
    return <p className="text-gray-400">Loading resources...</p>;
  }

  if (resources.length === 0) {
    return <p className="text-gray-500 text-center py-10">No resources uploaded yet.</p>;
  }

  return (
    <>
      {filteredResources.length > 0 ? (
        filteredResources.map((res) => (
          <ResourceCard key={res.id || res._id} resource={res} />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500 italic">No resources match your search criteria.</p>
        </div>
      )}
    </>
  );
};

export default ResourceList;