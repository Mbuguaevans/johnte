import React, { useState, useEffect } from "react";
import { summaryAPI, listingsAPI, bidsAPI, paymentsAPI } from "../api";
import { useNavigate } from "react-router-dom";
import "./listing.css"; // Reuse some base layout styles

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [listings, setListings] = useState([]);
  const [bids, setBids] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userType = user.user_type || 'farmer';

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [sumData, listData, bidData, payData] = await Promise.all([
          summaryAPI.get(),
          userType === 'landowner' ? listingsAPI.getMine() : Promise.resolve([]),
          bidsAPI.getMine(),
          paymentsAPI.getMine()
        ]);
        setSummary(sumData);
        setListings(listData);
        setBids(bidData);
        setPayments(payData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userType]);

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      {/* Welcome Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 bg-white p-4 rounded-4 shadow-sm">
        <div>
          <h1 className="fw-bold mb-1">Welcome back, {user.first_name || user.username}!</h1>
          <p className="text-muted mb-0">Here is what's happening with your FarmHub account today.</p>
        </div>
        <div className="d-flex gap-2">
          {userType === 'landowner' ? (
            <button className="btn btn-success fw-bold px-4" onClick={() => navigate('/add-land')}>+ List New Land</button>
          ) : (
            <button className="btn btn-success fw-bold px-4" onClick={() => navigate('/listings')}>Browse Marketplace</button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-success text-white">
            <h6 className="text-uppercase small fw-bold opacity-75">My Listings</h6>
            <h2 className="fw-bold mb-0">{summary?.listings_count || 0}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-primary text-white">
            <h6 className="text-uppercase small fw-bold opacity-75">Active Bids</h6>
            <h2 className="fw-bold mb-0">{summary?.bids_count || 0}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-dark text-white">
            <h6 className="text-uppercase small fw-bold opacity-75">Total Spent</h6>
            <h2 className="fw-bold mb-0">{summary?.payments_count || 0} Tx</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-warning text-dark">
            <h6 className="text-uppercase small fw-bold opacity-75">Auctions Won</h6>
            <h2 className="fw-bold mb-0">{summary?.won_bids || 0}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Activity Table (Bids) */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white py-3 border-0">
              <h5 className="fw-bold mb-0">My Recent Bids</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Land Title</th>
                    <th>My Bid</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.length > 0 ? bids.slice(0, 5).map(bid => (
                    <tr key={bid.id}>
                      <td className="fw-bold">{bid.land_title}</td>
                      <td className="text-success fw-bold">KES {Number(bid.amount_kes).toLocaleString()}</td>
                      <td>
                        <span className={`badge rounded-pill ${
                          bid.status === 'won' ? 'bg-success' : 
                          bid.status === 'leading' ? 'bg-primary' : 
                          bid.status === 'outbid' ? 'bg-warning text-dark' : 'bg-secondary'
                        }`}>
                          {bid.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-muted small">{new Date(bid.created_at).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">No bids found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Landowner Specific Section */}
          {userType === 'landowner' && (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white py-3 border-0">
                <h5 className="fw-bold mb-0">My Active Listings</h5>
              </div>
              <div className="p-3">
                <div className="row g-3">
                  {listings.length > 0 ? listings.slice(0, 4).map(land => (
                    <div key={land.id} className="col-md-6">
                      <div className="d-flex align-items-center p-3 border rounded-3 hover-shadow transition-all" onClick={() => navigate('/listings')} style={{ cursor: 'pointer' }}>
                        <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '10px', overflow: 'hidden' }} className="me-3">
                          <img src={land.images?.[0] || 'https://placehold.co/60x60'} alt="" className="w-100 h-100 object-fit-cover" />
                        </div>
                        <div className="flex-grow-1 min-width-0">
                          <h6 className="fw-bold mb-0 text-truncate">{land.title}</h6>
                          <small className="text-muted">{land.size_acres} Acres • {land.county}</small>
                        </div>
                        <span className={`badge ${land.status === 'available' ? 'bg-success' : 'bg-danger'} ms-2`}>
                          {land.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="col-12 text-center py-4 text-muted">No listings found.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h5 className="fw-bold mb-4">Quick Links</h5>
            <div className="d-grid gap-2">
              <button className="btn btn-outline-success text-start px-3 py-2 border-2 fw-bold" onClick={() => navigate('/listings')}>
                <span className="material-symbols-outlined align-middle me-2">explore</span> Marketplace
              </button>
              <button className="btn btn-outline-success text-start px-3 py-2 border-2 fw-bold" onClick={() => navigate('/about')}>
                <span className="material-symbols-outlined align-middle me-2">info</span> About FarmHub
              </button>
              <button className="btn btn-outline-danger text-start px-3 py-2 border-2 fw-bold" onClick={() => {
                sessionStorage.clear();
                navigate('/login');
              }}>
                <span className="material-symbols-outlined align-middle me-2">logout</span> Logout
              </button>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold mb-4">Account Summary</h5>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">User Role</span>
              <span className="badge bg-success text-uppercase">{userType}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Account Status</span>
              <span className="text-success fw-bold">Active ✓</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Member Since</span>
              <span className="fw-bold">{user.member_since || '2026'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;