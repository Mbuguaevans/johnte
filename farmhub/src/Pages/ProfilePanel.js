import React, { useState, useEffect, useRef } from "react";
import "./ProfilePanel.css";
import { profileAPI, summaryAPI, listingsAPI, bidsAPI, paymentsAPI, authAPI } from "../api";

const getInitials = (name = "U") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const TABS = ["Overview", "My Listings", "My Bids", "Transactions"];

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Narok',
  'Laikipia', 'Kilifi', 'Uasin Gishu', 'Machakos', 'Kajiado',
  'Nyeri', 'Muranga', 'Kericho', 'Bomet', 'Kakamega', 'Bungoma',
];

export default function ProfilePanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [user, setUser]           = useState(null);
  const [summary, setSummary]     = useState(null);
  const [listings, setListings]   = useState([]);
  const [bids, setBids]           = useState([]);
  const [payments, setPayments]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    county: "",
    email: ""
  });
  const [selectedFile, setSelectedFiles] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    loadAll();
  }, [isOpen]);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, summaryData, listingsData, bidsData, paymentsData] =
        await Promise.all([
          profileAPI.get(),
          summaryAPI.get(),
          listingsAPI.getMine(),
          bidsAPI.getMine(),
          paymentsAPI.getMine(),
        ]);
      setUser(profileData);
      setSummary(summaryData);
      setListings(listingsData);
      setBids(bidsData);
      setPayments(paymentsData);
      setEditData({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        phone: profileData.phone || "",
        county: profileData.county || "",
        email: profileData.email || ""
      });
      sessionStorage.setItem("user", JSON.stringify(profileData));
    } catch (err) {
      setError("Could not load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const data = new FormData();
      Object.keys(editData).forEach(key => data.append(key, editData[key]));
      if (selectedFile) data.append('profile_pic', selectedFile);

      const updated = await profileAPI.update(data);
      setUser(updated);
      setIsEditing(false);
      setSelectedFiles(null);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleSTKPush = async (landId, amount) => {
    try {
      const res = await paymentsAPI.initiate(landId, user.phone);
      alert(res.CustomerMessage || "Check your phone for the M-Pesa prompt!");
    } catch (err) {
      alert("Failed to initiate payment. Please ensure your phone is set in profile.");
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <>
        <div className="pp-backdrop" onClick={onClose} />
        <aside className="pp-panel">
          <div className="pp-header">
            <span className="pp-header-title">My Profile</span>
            <button className="pp-close" onClick={onClose}>✕</button>
          </div>
          <div className="pp-loading">
            <div className="pp-spinner" />
            <p>Loading your profile...</p>
          </div>
        </aside>
      </>
    );
  }

  // --- MAIN PROFILE PANEL ---
  return (
    <>
      <div className="pp-backdrop" onClick={onClose} />
      <aside className="pp-panel">

        <div className="pp-header">
          <span className="pp-header-title">My Profile</span>
          <button className="pp-close" onClick={onClose}>✕</button>
        </div>

        {isEditing ? (
          <form className="pp-edit-form p-4" onSubmit={handleUpdateProfile}>
            <h4 className="fw-bold mb-4">Edit Profile</h4>
            
            <div className="text-center mb-4">
              <div 
                className="pp-avatar-wrap mx-auto cursor-pointer" 
                onClick={() => fileInputRef.current.click()}
                title="Change Photo"
              >
                {selectedFile ? (
                  <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="pp-avatar-img" />
                ) : user?.profile_pic ? (
                  <img src={user.profile_pic} alt="" className="pp-avatar-img" />
                ) : (
                  <div className="pp-avatar-initials">{getInitials(user?.name)}</div>
                )}
                <div className="pp-verified-badge">📷</div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="d-none" 
                onChange={(e) => setSelectedFiles(e.target.files[0])}
                accept="image/*"
              />
              <small className="text-muted d-block mt-2">Click to change photo</small>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <label className="form-label small fw-bold">First Name</label>
                <input type="text" className="form-control" value={editData.first_name} onChange={(e) => setEditData({...editData, first_name: e.target.value})} />
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold">Last Name</label>
                <input type="text" className="form-control" value={editData.last_name} onChange={(e) => setEditData({...editData, last_name: e.target.value})} />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">Email</label>
                <input type="email" className="form-control" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">M-Pesa Phone</label>
                <input type="text" className="form-control" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} />
              </div>
              <div className="col-12">
                <label className="form-label small fw-bold">County</label>
                <select className="form-select" value={editData.county} onChange={(e) => setEditData({...editData, county: e.target.value})}>
                  <option value="">Select County</option>
                  {COUNTIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="d-grid gap-2 mt-5">
              <button type="submit" className="btn btn-success fw-bold py-2" disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="btn btn-light" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="pp-profile-card">
              <div className="pp-avatar-wrap">
                {user?.profile_pic ? (
                  <img
                    src={
                      user.profile_pic.startsWith("http")
                        ? user.profile_pic
                        : `https://mbuguaevans1.pythonanywhere.com${user.profile_pic}`
                    }
                    alt={user?.name}
                    className="pp-avatar-img"
                  />
                ) : (
                  <div className="pp-avatar-initials">{getInitials(user?.name)}</div>
                )}
                <div className="pp-verified-badge" title="Verified">✓</div>
              </div>
              <div className="pp-profile-info">
                <h3 className="pp-name">{user?.name}</h3>
                <span className="pp-role-badge">{user?.role}</span>
                <p className="pp-member-since">Member since {user?.member_since}</p>
              </div>
            </div>

            <div className="pp-contact">
              <div className="pp-contact-item">
                <span className="pp-contact-icon">✉️</span>
                <div>
                  <span className="pp-contact-label">Email</span>
                  <span className="pp-contact-val">{user?.email || "—"}</span>
                </div>
              </div>
              <div className="pp-contact-item">
                <span className="pp-contact-icon">📱</span>
                <div>
                  <span className="pp-contact-label">M-Pesa Phone</span>
                  <span className="pp-contact-val">{user?.phone || "Not set"}</span>
                </div>
              </div>
              <div className="pp-contact-item">
                <span className="pp-contact-icon">📍</span>
                <div>
                  <span className="pp-contact-label">County</span>
                  <span className="pp-contact-val text-capitalize">{user?.county || "Not set"}</span>
                </div>
              </div>
            </div>

            <div className="pp-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`pp-tab ${activeTab === tab ? "pp-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >{tab}</button>
              ))}
            </div>

            <div className="pp-tab-content">
              {/* OVERVIEW */}
              {activeTab === "Overview" && (
                <div className="pp-overview">
                  <div className="pp-stats-grid">
                    <div className="pp-stat-card">
                      <span className="pp-stat-icon">🏡</span>
                      <span className="pp-stat-val">{summary?.listings_count ?? 0}</span>
                      <span className="pp-stat-label">Listings</span>
                    </div>
                    <div className="pp-stat-card">
                      <span className="pp-stat-icon">🏷️</span>
                      <span className="pp-stat-val">{summary?.bids_count ?? 0}</span>
                      <span className="pp-stat-label">Bids</span>
                    </div>
                    <div className="pp-stat-card">
                      <span className="pp-stat-icon">💳</span>
                      <span className="pp-stat-val">{summary?.payments_count ?? 0}</span>
                      <span className="pp-stat-label">Payments</span>
                    </div>
                  </div>

                  <span className="pp-section-title">Recent Activity</span>
                  {payments.length === 0 ? (
                    <div className="pp-empty" style={{ padding: "20px 0" }}>
                      <span>💳</span><p>No transactions yet.</p>
                    </div>
                  ) : payments.slice(0, 3).map((tx) => (
                    <div className="pp-activity-row" key={tx.id}>
                      <div className={`pp-activity-icon ${tx.payment_type === "refund" ? "icon-credit" : "icon-debit"}`}>
                        {tx.payment_type === "refund" ? "↓" : "↑"}
                      </div>
                      <div className="pp-activity-info">
                        <span className="pp-activity-desc">{tx.description}</span>
                        <span className="pp-activity-date">
                          {new Date(tx.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <span className={`pp-activity-amount ${tx.payment_type === "refund" ? "amount-credit" : "amount-debit"}`}>
                        {tx.payment_type === "refund" ? "+" : "-"}KES {Number(tx.amount_kes).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <button className="pp-edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                </div>
              )}

              {/* MY LISTINGS */}
              {activeTab === "My Listings" && (
                <div className="pp-listings">
                  {listings.length === 0 ? (
                    <div className="pp-empty">
                      <span>🌾</span>
                      <p>You haven't listed any land yet.</p>
                    </div>
                  ) : (
                    listings.map((land) => (
                      <div className="pp-listing-card" key={land.id}>
                        <div className="pp-listing-img">
                          {land.images?.[0] || land.image_url
                            ? <img src={land.images?.[0] || land.image_url} alt={land.title} />
                            : <div style={{ background: "#e8f0e4", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🌿</div>
                          }
                        </div>
                        <div className="pp-listing-info">
                          <h4 className="pp-listing-title text-truncate">{land.title}</h4>
                          <div className="pp-listing-meta">
                            <span>📐 {land.size_acres} Acres</span>
                            <span>💰 KES {Number(land.price_kes).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* MY BIDS */}
              {activeTab === "My Bids" && (
                <div className="pp-bids">
                  {bids.length === 0 ? (
                    <div className="pp-empty">
                      <span>🏷️</span><p>You haven't placed any bids yet.</p>
                    </div>
                  ) : bids.map((bid) => (
                    <div className="pp-bid-card" key={bid.id}>
                      <div className="pp-bid-top">
                        <span className="pp-bid-land text-truncate">{bid.land_title}</span>
                        <span className={`pp-bid-status ${bid.status}`}>
                          {bid.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="pp-bid-bottom">
                        <span className="pp-bid-amount">KES {Number(bid.amount_kes).toLocaleString()}</span>
                        {bid.status === "won" && (
                          <button 
                            className="btn btn-success btn-sm fw-bold px-3 ms-2 rounded-pill"
                            onClick={() => handleSTKPush(bid.land, bid.amount_kes)}
                          >
                            Pay Now 📱
                          </button>
                        )}
                        {bid.status === "outbid" && (
                          <button className="btn btn-outline-warning btn-sm fw-bold px-3 ms-2 rounded-pill">
                            Raise Bid
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TRANSACTIONS */}
              {activeTab === "Transactions" && (
                <div className="pp-transactions">
                  {payments.length === 0 ? (
                    <div className="pp-empty"><span>📄</span><p>No transactions yet.</p></div>
                  ) : payments.map((tx) => (
                    <div className="pp-tx-row" key={tx.id}>
                      <div className="pp-tx-info">
                        <span className="pp-tx-desc">{tx.description}</span>
                        <span className="pp-tx-meta">{new Date(tx.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="pp-tx-amount">KES {Number(tx.amount_kes).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pp-footer">
              <button className="pp-logout-btn" onClick={authAPI.logout}>
                🚪 Sign Out
              </button>
            </div>
          </>
        )}

      </aside>
    </>
  );
}