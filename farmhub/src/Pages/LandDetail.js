import React, { useState, useEffect, useCallback } from "react";
import { bidsAPI, listingsAPI, paymentsAPI } from "../api";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "./LandDetail.css";
import ProfilePanel from "./ProfilePanel";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getInitials = (name = "U") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function LandDetail({ land, onBack }) {
  const [saved, setSaved] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bidAmount, setBidAmount]     = useState("");
  const [bidLoading, setBidLoading]   = useState(false);
  const [bidSuccess, setBidSuccess]   = useState("");
  const [bidError, setBidError]       = useState("");
  const [bids, setBids]               = useState([]);
  const [timeLeft, setTimeLeft]       = useState("");
  const [isExpired, setIsExpired]     = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [localStatus, setLocalStatus] = useState(land.status);

  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  const fetchBids = useCallback(async () => {
    if (!land?.id) return;
    try {
      const data = await bidsAPI.getForLand(land.id);
      setBids(data);
      // Re-fetch land to get updated status
      const updatedLand = await listingsAPI.getOne(land.id);
      setLocalStatus(updatedLand.status);
    } catch (err) {
      console.error("Failed to fetch bids:", err);
    }
  }, [land?.id]);

  // ── TIMER LOGIC ──
  useEffect(() => {
    if (!land?.auction_ends_at || localStatus !== 'available') {
      if (localStatus !== 'available') setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      const end = new Date(land.auction_ends_at).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("CLOSED");
        setIsExpired(true);
        clearInterval(interval);
        // Trigger auction closure on backend if not already done
        listingsAPI.close(land.id).then(() => fetchBids());
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [land?.auction_ends_at, land.id, localStatus, fetchBids]);

  useEffect(() => {
    if (land) {
      document.title = `${land.title} | FarmHub Kenya`;
      fetchBids();
    }
  }, [land?.id, fetchBids]);

  // Trigger Winner Popup Automatically
  useEffect(() => {
    const leadingBid = bids.length > 0 ? bids[0] : null;
    const isWinner = (isExpired || localStatus !== 'available') && 
                     leadingBid && 
                     Number(leadingBid.bidder_id) === Number(user.id);

    if (isWinner && !hasShownPopup && localStatus === 'pending') {
      setShowPaymentModal(true);
      setHasShownPopup(true);
    }
  }, [bids, isExpired, localStatus, user.id, hasShownPopup]);

  const [activeImg, setActiveImg] = useState(0);
  const allImages = (land.images && land.images.length > 0)
    ? land.images
    : ["https://placehold.co/800x500?text=No+Image+Available"];

  const mainImage = allImages[activeImg];
  const priceRaw     = parseFloat(land.price_kes || 0);
  const sizeRaw      = parseFloat(land.size_acres || 0);
  const pricePerAcre = sizeRaw > 0 ? Math.round(priceRaw / sizeRaw).toLocaleString() : "—";

  // Winner logic
  const leadingBid = bids.length > 0 ? bids[0] : null;
  const isWinner = (isExpired || land.status !== 'available') && 
                   leadingBid && 
                   Number(leadingBid.bidder_id) === Number(user.id);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (isExpired) return;
    setBidError(""); setBidSuccess("");
    
    const amount = Number(bidAmount);
    const highestBid = leadingBid ? parseFloat(leadingBid.amount_kes) : priceRaw;
    
    if (amount <= highestBid) {
      setBidError(`Bid must be higher than current price: KES ${highestBid.toLocaleString()}`);
      return;
    }

    setBidLoading(true);
    try {
      await bidsAPI.place(land.id, amount);
      setBidSuccess("🎉 Bid placed successfully! You are now leading.");
      setBidAmount("");
      fetchBids();
    } catch (err) {
      setBidError(err.error || "Failed to place bid.");
    } finally {
      setBidLoading(false);
    }
  };

  const handlePayment = async () => {
    setBidLoading(true);
    try {
      const res = await paymentsAPI.initiate(land.id, user.phone);
      alert(res.CustomerMessage || "Check your phone for the M-Pesa prompt!");
      setShowPaymentModal(false);
    } catch (err) {
      alert("Failed to initiate payment. Please check your phone number in profile.");
    } finally {
      setBidLoading(false);
    }
  };

  const hasCoords = land.latitude && land.longitude;
  const mapCenter = hasCoords ? [land.latitude, land.longitude] : [-1.2921, 36.8219];

  return (
    <div className="ld-root">
      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* ── PAYMENT POPUP ── */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="payment-modal card shadow-lg p-4 border-0 rounded-4">
            <div className="text-center">
              <div className="display-1 mb-3">📱</div>
              <h3 className="fw-bold">M-Pesa Payment</h3>
              <p className="text-muted">You won the auction for <strong>{land.title}</strong>!</p>
              <div className="bg-light p-3 rounded-3 mb-4">
                <span className="d-block small text-uppercase fw-bold text-muted">Amount to Pay</span>
                <span className="fs-3 fw-bold text-success">KES {parseFloat(leadingBid.amount_kes).toLocaleString()}</span>
              </div>
              <button className="btn btn-success btn-lg w-100 fw-bold py-3 rounded-3 mb-2" onClick={handlePayment}>
                Pay via M-Pesa Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <header className="ld-nav">
        <div className="ld-nav-inner">
          <div className="ld-nav-left">
            <button className="ld-back-btn" onClick={onBack} disabled={showPaymentModal} style={{ opacity: showPaymentModal ? 0.5 : 1, cursor: showPaymentModal ? 'not-allowed' : 'pointer' }}>← Back</button>
            <div className="ld-breadcrumb d-none d-md-flex">
              <span>{land.county}</span>
              <span className="ld-bc-sep">›</span>
              <span className="ld-bc-active text-truncate">{land.title}</span>
            </div>
          </div>
          <div className="ld-nav-right">
            <div className={`timer-badge ${isExpired ? 'bg-danger' : 'bg-dark'} text-white px-3 py-1 rounded-pill small fw-bold`}>
              {isExpired ? "AUCTION ENDED" : `⏱ ${timeLeft}`}
            </div>
            <button className="ld-profile-btn" onClick={() => !showPaymentModal && setProfileOpen(true)} disabled={showPaymentModal} style={{ opacity: showPaymentModal ? 0.5 : 1, cursor: showPaymentModal ? 'not-allowed' : 'pointer' }}>
              <div className="ld-profile-avatar">{getInitials(user.first_name || user.username || "U")}</div>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="ld-body">
        <div className="ld-left">
          {isWinner && (
            <div className="alert alert-success border-0 shadow-sm rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between">
              <div>
                <h4 className="fw-bold mb-1">Congratulations! 🏆</h4>
                <p className="mb-0">You won this auction. Secure your lease by completing the payment.</p>
              </div>
              <button className="btn btn-success fw-bold px-4 py-2 rounded-pill" onClick={() => setShowPaymentModal(true)}>
                Claim & Pay Now
              </button>
            </div>
          )}

          <section className="ld-gallery mb-4">
            <div className="ld-gallery-main" style={{height: '400px'}}>
              <img src={mainImage} alt="" className="ld-main-img" />
            </div>
            {allImages.length > 1 && (
              <div className="d-flex gap-2 mt-2 overflow-auto pb-2">
                {allImages.map((img, i) => (
                  <img key={i} src={img} onClick={() => setActiveImg(i)} alt="" className={`rounded cursor-pointer ${activeImg === i ? 'border border-3 border-success' : ''}`} style={{width:'80px', height:'60px', objectFit:'cover'}} />
                ))}
              </div>
            )}
          </section>

          <div className="ld-title-block">
            <h1 className="ld-title">{land.title}</h1>
            <p className="ld-desc mt-3">{land.description}</p>
          </div>

          {/* Amenities Section */}
          <div className="ld-section">
            <h2 className="ld-section-title">Amenities & Features</h2>
            <div className="ld-amenities">
              {[
                { id: 'has_water', label: 'Water Access', icon: 'water_drop', value: land.has_water },
                { id: 'has_electricity', label: 'Electricity', icon: 'bolt', value: land.has_electricity },
                { id: 'has_road_access', label: 'Road Access', icon: 'add_road', value: land.has_road_access },
                { id: 'has_fencing', label: 'Fenced', icon: 'fence', value: land.has_fencing },
                { id: 'has_irrigation', label: 'Irrigation', icon: 'shower', value: land.has_irrigation }
              ].map(item => (
                <div key={item.id} className={`ld-amenity-card ${item.value ? 'amenity-on' : 'amenity-off'}`}>
                  <span className="material-symbols-outlined ld-amenity-icon">{item.icon}</span>
                  <span className="ld-amenity-label">{item.label}</span>
                  <span className="ld-amenity-check">{item.value ? '✓' : '✕'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Bids */}
          <div className="ld-section">
            <h2 className="ld-section-title">Live Bidding</h2>
            <div className="ld-bids-list">
              {bids.length === 0 ? <p className="text-muted">No bids yet.</p> : bids.map((bid) => (
                <div key={bid.id} className={`ld-bid-row ${bid.status === "leading" ? "bid-leading" : ""}`}>
                  <div className="ld-bid-left">
                    <div className="ld-bid-name">{bid.bidder_name}</div>
                    <div className="ld-bid-time">{new Date(bid.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="fw-bold text-success">KES {parseFloat(bid.amount_kes).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bid Form */}
          {!isExpired && (
            <div className="ld-section">
              <div className="ld-bid-form-wrap">
                <h3 className="fw-bold">Place Your Bid</h3>
                <form className="mt-3" onSubmit={handlePlaceBid}>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-white border-end-0">KES</span>
                    <input type="number" className="form-control border-start-0" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="Enter amount" />
                    <button className="btn btn-success px-4 fw-bold" disabled={bidLoading}>
                      {bidLoading ? "..." : "Place Bid"}
                    </button>
                  </div>
                  {bidError && <small className="text-danger d-block mb-2">{bidError}</small>}
                  {bidSuccess && <small className="text-success d-block mb-2">{bidSuccess}</small>}
                </form>
              </div>
            </div>
          )}
        </div>

        <aside className="ld-sidebar">
          <div className="ld-map-card shadow-sm border rounded-4 overflow-hidden mb-4">
            <div style={{ height: '300px' }}>
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {hasCoords && <Marker position={mapCenter} />}
              </MapContainer>
            </div>
            <div className="p-3 text-center d-grid gap-2">
              <a href={`https://www.google.com/maps/search/?api=1&query=${land.latitude},${land.longitude}`} target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm fw-bold">
                View Satellite (Google Maps) ↗
              </a>
            </div>
          </div>

          <div className="ld-stats-card p-4 bg-white border rounded-4 shadow-sm">
            <h5 className="fw-bold mb-3">Listing Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Total Bids:</span>
              <span className="fw-bold">{bids.length}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Highest Bid:</span>
              <span className="fw-bold text-success">KES {leadingBid ? parseFloat(leadingBid.amount_kes).toLocaleString() : priceRaw.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Status:</span>
              <span className={`badge ${localStatus === 'available' ? 'bg-success' : 'bg-danger'}`}>
                {localStatus === 'available' ? 'Active' : (localStatus === 'pending' ? 'Auction Ended' : 'Leased')}
              </span>
            </div>
          </div>

          <div className="ld-contact-card p-4 mt-4 bg-light border-0 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-3">Contact Owner</h5>
            <div className="d-flex align-items-center mb-3">
              <div className="ld-owner-img-wrap me-3">
                {land.owner_pic ? (
                  <img 
                    src={land.owner_pic} 
                    alt={land.owner_name} 
                    style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}} 
                  />
                ) : (
                  <div className="ld-profile-avatar bg-success text-white" style={{width: '60px', height: '60px', fontSize: '1.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center'}}>
                    {getInitials(land.owner_name || "O")}
                  </div>
                )}
              </div>
              <div>
                <div className="fw-bold">{land.owner_name || "Owner"}</div>
                <div className="small text-muted">Verified Landowner</div>
              </div>
            </div>
            <div className="d-grid gap-2">
              <a href={`tel:${land.owner_phone || ""}`} className="btn btn-outline-dark fw-bold rounded-pill">
                📞 {land.owner_phone || "No Phone Provided"}
              </a>
              <a 
                href={`https://wa.me/${(land.owner_phone || "").replace(/\+/g, "")}?text=Hi ${land.owner_name}, I am interested in your land listing: ${land.title} on FarmHub.`} 
                target="_blank" 
                rel="noreferrer" 
                className={`btn btn-success fw-bold rounded-pill ${!land.owner_phone ? "disabled" : ""}`}
                onClick={(e) => !land.owner_phone && e.preventDefault()}
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
