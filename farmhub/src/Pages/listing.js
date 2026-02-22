import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { listingsAPI } from "../api";
import "./listing.css";
import LandDetail from "./LandDetail";
import ProfilePanel from "./ProfilePanel";

const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Narok",
  "Laikipia", "Kilifi", "Uasin Gishu", "Machakos", "Kajiado",
  "Nyeri", "Muranga", "Kericho", "Bomet", "Kakamega", "Bungoma"
];

const fetcher = (params) => listingsAPI.getAll(params);

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiryDate) return;
    const interval = setInterval(() => {
      const end = new Date(expiryDate).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("CLOSED");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  return (
    <div className="card-timer">
      <span className="material-symbols-outlined small me-1">schedule</span>
      {timeLeft || "Loading..."}
    </div>
  );
};

export default function Listings() {
  const [selectedLand, setSelectedLand] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Advanced Filters
  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("all");
  const [minAcres, setMinAcres] = useState(1); // Default to 1 acre and above
  const [amenities, setAmenities] = useState([]);
  const [sort, setSort] = useState("newest");
  const [viewType, setViewType] = useState("grid"); // grid or list
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  // Real-time fetching with SWR
  const { data: lands = [], error, isLoading, mutate } = useSWR(
    ['listings', county, sort, amenities, minAcres, search],
    () => fetcher({ search, county, sort, amenities, min_acres: minAcres }),
    { 
      refreshInterval: 10800000, // Re-fetch every 3 hours
      revalidateOnFocus: true // Re-fetch when the tab is clicked back
    }
  );

  const toggleAmenity = (amenity) => {
    // Toggle amenity in filter list
    setAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  if (selectedLand) {
    return <LandDetail land={selectedLand} onBack={() => { setSelectedLand(null); mutate(); }} />;
  }

  return (
    <div className="listings-root" style={{ marginTop: '80px' }}>
      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* ─── MAIN ─── */}
      <main className="l-main">
        
        {/* SIDEBAR FILTERS */}
        <aside className={`l-aside ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
          <div className="l-aside-sticky">
            <div className="filter-panel">
              <div className="filter-header">
                <span className="filter-title">
                  <span className="material-symbols-outlined">tune</span> Filters
                </span>
                <div className="d-flex gap-2">
                  <button className="filter-reset" onClick={() => {
                    setCounty('all');
                    setMinAcres(1);
                    setAmenities([]);
                    setSearch('');
                  }}>Reset</button>
                  <button className="d-lg-none border-0 bg-transparent" onClick={() => setMobileFiltersOpen(false)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              {/* ... existing filter groups ... */}

              <div className="filter-group">
                <label className="filter-label">Location</label>
                <div className="select-wrap">
                  <select className="filter-select" value={county} onChange={(e) => setCounty(e.target.value)}>
                    <option value="all">All Counties</option>
                    {COUNTIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                  </select>
                  <span className="material-symbols-outlined select-arrow">expand_more</span>
                </div>
              </div>

              <div className="filter-divider"></div>

              <div className="filter-group">
                <div className="range-header">
                  <label className="filter-label">Min Land Size (Acres)</label>
                  <span className="range-val">{minAcres} Acres +</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="200" 
                  step="1" 
                  value={minAcres}
                  onChange={(e) => setMinAcres(e.target.value)}
                />
                <div className="range-labels">
                  <span>1 Acre</span>
                  <span>200 Acres</span>
                </div>
              </div>

              <div className="filter-divider"></div>

              <div className="filter-group">
                <label className="filter-label">Amenities</label>
                <div className="amenity-list">
                  {[
                    {id: 'has_water', label: 'Water Access', icon: 'water_drop'},
                    {id: 'has_electricity', label: 'Electricity', icon: 'bolt'},
                    {id: 'has_road_access', label: 'Road Access', icon: 'add_road'},
                    {id: 'has_fencing', label: 'Fenced', icon: 'fence'},
                    {id: 'has_irrigation', label: 'Irrigation', icon: 'shower'}
                  ].map(item => (
                    <label className="amenity-item" key={item.id}>
                      <input 
                        type="checkbox" 
                        checked={amenities.includes(item.id)}
                        onChange={() => toggleAmenity(item.id)}
                      />
                      <span className="material-symbols-outlined small">{item.icon}</span>
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <div className="l-content">
          {/* SEARCH BOX FOR MARKETPLACE */}
          <div className="top-bar mb-4">
             <div className="l-search flex-grow-1 me-3">
                <span className="material-symbols-outlined">search</span>
                <input 
                  type="text" 
                  placeholder="Search farms, counties..." 
                  className="border-0 w-100"
                  style={{outline: 'none'}}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && mutate()}
                />
              </div>
              <button className="btn btn-success fw-bold px-4" onClick={() => mutate()}>Search</button>
          </div>

          <div className="top-bar">
            <div className="results-info">
              <span className="results-count">Showing <strong>{lands.length}</strong> fertile parcels</span>
              <div className="view-toggle">
                <button className={`view-btn ${viewType === 'grid' ? 'active' : ''}`} onClick={() => setViewType('grid')}>
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button className={`view-btn ${viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('list')}>
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>
            </div>

            <div className="sort-wrap">
              <span className="sort-label">Sort by:</span>
              <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="size">Size: Large to Small</option>
              </select>
            </div>
          </div>

          {isLoading && lands.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
              <p className="mt-3">Scanning for best land deals...</p>
            </div>
          ) : (
            <div className="listings-grid">
              {lands.length === 0 ? (
                <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm w-100">
                  <span className="material-symbols-outlined display-1 text-muted">agriculture</span>
                  <h3 className="mt-3">No farms match your filters</h3>
                  <p className="text-muted">Try adjusting your land size or county.</p>
                </div>
              ) : (
                lands.map((land) => (
                  <div className="l-card" key={land.id} onClick={() => setSelectedLand(land)}>
                    <div className="card-img-wrap">
                      <img src={land.images?.[0] || 'https://placehold.co/600x400?text=FarmHub+Land'} alt={land.title} />
                      <div className="card-badge badge-featured">Verified</div>
                      <CountdownTimer expiryDate={land.auction_ends_at} />
                      <button className="card-fav" onClick={(e) => { e.stopPropagation(); }}>
                        <span className="material-symbols-outlined">favorite</span>
                      </button>
                      <div className="price-ribbon">
                        <span className="ribbon-price">KES {Number(land.price_kes).toLocaleString()}</span>
                        <span className="ribbon-size">{land.size_acres} Acres</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{land.title}</h3>
                      <div className="card-location">
                        <span className="material-symbols-outlined small">location_on</span>
                        {land.county}, Kenya
                      </div>
                      <p className="card-desc">{land.description}</p>
                      <div className="card-tags">
                        {land.has_water && <span className="card-tag">Water</span>}
                        {land.has_electricity && <span className="card-tag">Power</span>}
                        {land.has_road_access && <span className="card-tag">Road</span>}
                        {land.has_fencing && <span className="card-tag">Fenced</span>}
                        {land.has_irrigation && <span className="card-tag">Irrigation</span>}
                      </div>
                      <button className="card-cta">
                        Place Bid <span className="material-symbols-outlined small">gavel</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button className="mobile-filter-btn" onClick={() => setMobileFiltersOpen(true)}>
          <span className="material-symbols-outlined">tune</span>
          Filters
        </button>
      </main>
    </div>
  );
}