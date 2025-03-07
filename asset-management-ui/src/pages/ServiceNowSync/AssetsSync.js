import React, { useState, useEffect } from "react";
import axios from "axios";

const AssetsSync = () => {
  const [assets, setAssets] = useState([]); // Ensure it's initialized as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/assets");
      if (Array.isArray(response.data)) {
        setAssets(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setAssets([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      setError("Failed to fetch assets.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Assets Sync</h2>
      {assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <ul>
          {assets.map((asset, index) => (
            <li key={index}>{asset.name || "Unnamed Asset"}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssetsSync;
