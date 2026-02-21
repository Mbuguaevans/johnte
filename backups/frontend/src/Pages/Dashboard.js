import React, { useState, useEffect } from "react";
import { summaryAPI, listingsAPI, bidsAPI } from "../api";
import "./listing.css"; // Reuse listing styles for consistency

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    summaryAPI.get()
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-5">Loading Dashboard...</div>;

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Dashboard</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 bg-success text-white">
            <h3>{summary?.listings_count || 0}</h3>
            <p className="mb-0">My Listings</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 bg-primary text-white">
            <h3>{summary?.bids_count || 0}</h3>
            <p className="mb-0">Active Bids</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 bg-dark text-white">
            <h3>{summary?.payments_count || 0}</h3>
            <p className="mb-0">Transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}