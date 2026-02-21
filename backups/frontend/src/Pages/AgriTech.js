import React, { useState } from "react";
import "./AgriTech.css";

const SOLUTIONS = [
  {
    id: "soil",
    tag: "Precision Agriculture",
    title: "Soil Sensors",
    product: "TerraPulse™ V3",
    price: "From KES 35,000",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8IynI7nkhkrweOpKqnOM_-jYznnIjUXG-CeiVz9-PEKkvKH55_S0wWS_6HSEOIreDrbllQTPFsKXIqSc_4xwU1azLSwiMUMQ_hT4i4hQapeABDjnFdCBGjfACCzjQVg4oK-kXurKPTCNXcQqz4PJgnXKpqUaHSDmyZgi5Qw1wIDPihC-we0qHehM6ikr4fD98poxbi_XUBdiC8eTFSgL5DjsJQ6YAp2VoFvgRz0GizMFM7IyQTpqVBonCgJPpoG-1UgOdyP-GXTY",
    icon: "🌱",
    stat: "-30% fertilizer",
    statColor: "stat-green",
    features: [
      "Real-time NPK & pH monitoring",
      "5-year battery life via solar",
      "Cellular & LoRaWAN connectivity",
    ],
    actions: ["Book Demo", "View Specs"],
    desc: "Deploy IoT sensors across your land to monitor soil health 24/7. Integrates directly with FarmHub's land management dashboard to give landowners and tenants full visibility into field conditions.",
  },
  {
    id: "irrigation",
    tag: "Water Management",
    title: "Smart Irrigation",
    product: "HydroLogic™ Cloud",
    price: "KES 5,800/mo",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAetgZQJ7-MxWhYcIq0GMjczKCGFMC7XdUKxHVKeT0ePs0x8THHVKUx-2zGRGPFGZbdcx7aQiB63bJIZPwwQvcqUw4nnuAEOvhSJ0YxR5FQ9IR6OQK35FMiHjbQxH7qgxBGuaN_c9IbiwAbEHeZTu2hCYjL7yy0uQOvMAwEq5zEAXnzMMcwoOqfp-E6GVjaOAX70M-GCLKQEeStajFQHhV3r48TvMN4zt6WGieYdA9FcNPqXL6vAbz4pU5OxeUmTK8VYP673RmxW3I",
    icon: "💧",
    stat: "-30% water use",
    statColor: "stat-blue",
    features: [
      "AI-driven scheduling based on weather",
      "Remote valve control via mobile app",
      "Leak detection and flow alerts",
    ],
    actions: ["Book Demo", "Pricing Plans"],
    desc: "Automated irrigation cuts water waste by 30%. The system reads weather forecasts and soil moisture data, scheduling watering only when needed — reducing costs for tenants leasing your land.",
  },
  {
    id: "drone",
    tag: "Aerial Intelligence",
    title: "Drone Mapping",
    product: "AeroScan™ Multispectral",
    price: "Per Acre Rates",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuATmnnGpRVDTH6UZBYzD2uLUmqduqPBFNzblga8MQpHghltfISbXhJZujTZomQleyidVp_a-vTFuNyDRxFnzeJRXyCMtmE5RZBYJETJRFtjqRD_TqMP2Wbbto7G30Fi3lTJzSehE29_CPkvTr8bbnuXCyQL_gy03FlTQ5meCCFLCgY3ikwzfg_nmMYB8uudnIJF_T8_NRH2c5ZY5M9HXGYoLPb8JmFETUqnAz26ZFAUWuZHPGe5GAX-9M8JKiyvUIP4tkf4u8mxJe0",
    icon: "🛸",
    stat: "+15% avg yield",
    statColor: "stat-orange",
    features: [
      "NDVI health maps & crop stress analysis",
      "Automated pest & disease spotting",
      "3D topography for drainage planning",
    ],
    actions: ["Book Demo", "Sample Reports"],
    desc: "Aerial multispectral mapping gives you a bird's-eye view of field health. Generated reports plug into FarmHub's land module to support better bidding decisions and lease valuations.",
  },
];

export default function AgriTech() {
  const [activeSection, setActiveSection] = useState("soil");
  const [phonePage, setPhonePage]         = useState(0);
  const [demoModal, setDemoModal]         = useState(null);

  const active = SOLUTIONS.find((s) => s.id === activeSection);

  const phonePages = [
    {
      label: "Dashboard",
      content: (
        <div className="phone-dashboard">
          <div className="phone-dash-header">
            <div>
              <p className="phone-dash-greeting">Good morning 👋</p>
              <p className="phone-dash-name">John Gitahi</p>
            </div>
            <div className="phone-dash-avatar">JG</div>
          </div>
          <div className="phone-dash-stats">
            <div className="phone-dash-stat">
              <span className="phone-stat-icon">🌿</span>
              <span className="phone-stat-val">3</span>
              <span className="phone-stat-lbl">My Listings</span>
            </div>
            <div className="phone-dash-stat">
              <span className="phone-stat-icon">🏷️</span>
              <span className="phone-stat-val">7</span>
              <span className="phone-stat-lbl">Active Bids</span>
            </div>
            <div className="phone-dash-stat">
              <span className="phone-stat-icon">💰</span>
              <span className="phone-stat-val">$1.2k</span>
              <span className="phone-stat-lbl">Wallet</span>
            </div>
          </div>
          <div className="phone-dash-section-title">Recent Activity</div>
          {[
            { icon: "📍", text: "New bid on Nakuru land", time: "2m ago", color: "#4a8f2a" },
            { icon: "💳", text: "M-Pesa payment confirmed", time: "1h ago", color: "#2c5926" },
            { icon: "🌱", text: "Soil sensor alert: low pH", time: "3h ago", color: "#b5893a" },
          ].map((item, i) => (
            <div className="phone-activity-item" key={i}>
              <div className="phone-activity-icon" style={{ background: item.color + "18" }}>
                {item.icon}
              </div>
              <div className="phone-activity-text">
                <span>{item.text}</span>
                <span className="phone-activity-time">{item.time}</span>
              </div>
            </div>
          ))}
          <div className="phone-dash-section-title" style={{ marginTop: 16 }}>Sensor Readings</div>
          <div className="phone-sensor-row">
            <div className="phone-sensor">
              <span className="phone-sensor-label">pH</span>
              <div className="phone-sensor-bar-track">
                <div className="phone-sensor-bar" style={{ width: "62%", background: "#4a8f2a" }} />
              </div>
              <span className="phone-sensor-val">6.2</span>
            </div>
            <div className="phone-sensor">
              <span className="phone-sensor-label">NPK</span>
              <div className="phone-sensor-bar-track">
                <div className="phone-sensor-bar" style={{ width: "78%", background: "#2c5926" }} />
              </div>
              <span className="phone-sensor-val">78%</span>
            </div>
            <div className="phone-sensor">
              <span className="phone-sensor-label">H₂O</span>
              <div className="phone-sensor-bar-track">
                <div className="phone-sensor-bar" style={{ width: "45%", background: "#b5893a" }} />
              </div>
              <span className="phone-sensor-val">45%</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Land Map",
      content: (
        <div className="phone-map">
          <div className="phone-map-header">
            <span className="phone-map-title">My Land Parcels</span>
            <span className="phone-map-badge">Google Maps</span>
          </div>
          <div className="phone-map-placeholder">
            <div className="phone-map-grid">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="phone-map-cell" style={{
                  background: [3, 7, 11, 14, 18].includes(i)
                    ? "rgba(44,89,38,0.35)"
                    : [5, 9, 16, 20].includes(i)
                    ? "rgba(74,143,42,0.2)"
                    : "rgba(44,89,38,0.05)"
                }} />
              ))}
            </div>
            <div className="phone-map-pin" style={{ top: "30%", left: "40%" }}>📍</div>
            <div className="phone-map-pin" style={{ top: "55%", left: "65%" }}>📍</div>
            <div className="phone-map-pin" style={{ top: "20%", left: "70%" }}>📍</div>
            <div className="phone-map-label">Nakuru East</div>
          </div>
          <div className="phone-map-parcels">
            {["15.5 Acres — Nakuru", "5.0 Acres — Naivasha", "45 Acres — Kericho"].map((p, i) => (
              <div className="phone-map-parcel" key={i}>
                <span className="phone-map-dot" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: "Bids",
      content: (
        <div className="phone-bids">
          <div className="phone-bids-header">Active Bids</div>
          {[
            { land: "Prime Arable — Nakuru", bid: "KES 14.2M", bidder: "Tenant A", status: "leading", time: "2h left" },
            { land: "Grazing — Laikipia", bid: "KES 43M", bidder: "Tenant B", status: "outbid", time: "5h left" },
            { land: "Tea Estate — Kericho", bid: "KES 36M", bidder: "Tenant C", status: "leading", time: "1d left" },
          ].map((b, i) => (
            <div className="phone-bid-card" key={i}>
              <div className="phone-bid-top">
                <span className="phone-bid-land">{b.land}</span>
                <span className={`phone-bid-status ${b.status === "leading" ? "status-leading" : "status-outbid"}`}>
                  {b.status === "leading" ? "✓ Leading" : "↑ Outbid"}
                </span>
              </div>
              <div className="phone-bid-bottom">
                <span className="phone-bid-amount">{b.bid}</span>
                <span className="phone-bid-time">{b.time}</span>
              </div>
              {b.status === "outbid" && (
                <button className="phone-bid-raise">Raise Bid</button>
              )}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="at-root">

      {/* ── NAV ── */}
      <header className="at-nav">
        <div className="at-nav-inner">
          <a href="/listings" className="at-brand">
            <div className="at-brand-icon">🌿</div>
            <span className="at-brand-name">FarmHub</span>
          </a>
          <nav className="at-nav-links">
            <a href="/listings">Marketplace</a>
            <a href="/investments">Investment Plans</a>
            <a href="/agritech" className="active">Agri-Tech</a>
            <a href="#">About Us</a>
          </nav>
          <div className="at-nav-right">
            <button className="at-nav-cta">Get Started</button>
            <div className="at-avatar" title="Logout" onClick={() => {
              sessionStorage.removeItem("access_token");
              window.location.href = "/login";
            }}>JG</div>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="at-hero">
        <div className="at-hero-content">
          <div className="at-hero-tag">🚀 Future of Farming</div>
          <h1 className="at-hero-heading">
            Modern Agri-Tech<br />
            <span className="at-hero-accent">for Kenyan Farms</span>
          </h1>
          <p className="at-hero-desc">
            Precision tools built for FarmHub landowners and tenants.
            Monitor soil, automate irrigation, and map your land — all from one platform.
          </p>
          <div className="at-hero-stats">
            <div className="at-hero-stat">
              <strong>-30%</strong><span>Water Use</span>
            </div>
            <div className="at-hero-stat-div" />
            <div className="at-hero-stat">
              <strong>+15%</strong><span>Avg Yield</span>
            </div>
            <div className="at-hero-stat-div" />
            <div className="at-hero-stat">
              <strong>2,500+</strong><span>Farmers</span>
            </div>
          </div>
          <div className="at-hero-actions">
            <button className="at-btn-primary" onClick={() => setDemoModal("general")}>
              Book a Demo
            </button>
            <a href="/listings" className="at-btn-ghost">Browse Land →</a>
          </div>
        </div>

        {/* Phone mockup in hero */}
        <div className="at-hero-phone-wrap">
          <div className="at-phone-frame">
            <div className="at-phone-notch" />
            <div className="at-phone-screen">
              <div className="at-phone-tab-bar">
                {phonePages.map((p, i) => (
                  <button
                    key={i}
                    className={`at-phone-tab ${phonePage === i ? "at-phone-tab-active" : ""}`}
                    onClick={() => setPhonePage(i)}
                  >{p.label}</button>
                ))}
              </div>
              <div className="at-phone-content">
                {phonePages[phonePage].content}
              </div>
            </div>
            <div className="at-phone-home-bar" />
          </div>
        </div>
      </section>

      {/* ── ROI STRIP ── */}
      <section className="at-roi-strip">
        {[
          { icon: "💧", val: "-30%", label: "Water Consumption", color: "#2563eb" },
          { icon: "📈", val: "+15%", label: "Average Crop Yield", color: "#16a34a" },
          { icon: "🌿", val: "-20%", label: "Fertilizer Waste", color: "#4a8f2a" },
          { icon: "⏱️", val: "3s", label: "System Response", color: "#b5893a" },
          { icon: "🔒", val: "JWT", label: "Secure Auth", color: "#1a3a12" },
        ].map((s, i) => (
          <div className="at-roi-item" key={i}>
            <div className="at-roi-icon" style={{ color: s.color }}>{s.icon}</div>
            <div className="at-roi-val" style={{ color: s.color }}>{s.val}</div>
            <div className="at-roi-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── SOLUTIONS ── */}
      <section className="at-solutions">
        <div className="at-solutions-header">
          <h2 className="at-section-title">Our Solutions</h2>
          <p className="at-section-sub">Built for FarmHub's land leasing ecosystem — sensors, irrigation and mapping that integrate with your listings.</p>
          <div className="at-solutions-tabs">
            {SOLUTIONS.map((s) => (
              <button
                key={s.id}
                className={`at-sol-tab ${activeSection === s.id ? "at-sol-tab-active" : ""}`}
                onClick={() => setActiveSection(s.id)}
              >
                {s.icon} {s.title}
              </button>
            ))}
          </div>
        </div>

        {active && (
          <div className="at-sol-panel" key={active.id}>
            <div className="at-sol-left">
              <div className="at-sol-img-wrap">
                <img src={active.img} alt={active.title} />
                <div className="at-sol-img-tag">{active.tag}</div>
                <div className="at-sol-img-stat">
                  <span className={active.statColor}>{active.stat}</span>
                </div>
              </div>
            </div>
            <div className="at-sol-right">
              <div className="at-sol-product-badge">{active.product}</div>
              <h3 className="at-sol-title">{active.title}</h3>
              <p className="at-sol-desc">{active.desc}</p>
              <div className="at-sol-features">
                {active.features.map((f, i) => (
                  <div className="at-sol-feature" key={i}>
                    <span className="at-sol-check">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="at-sol-footer">
                <div className="at-sol-price">
                  <span className="at-sol-price-label">Pricing</span>
                  <span className="at-sol-price-val">{active.price}</span>
                </div>
                <div className="at-sol-btns">
                  <button className="at-btn-primary" onClick={() => setDemoModal(active.title)}>
                    Book Demo
                  </button>
                  <button className="at-btn-outline">{active.actions[1]}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── HOW IT INTEGRATES ── */}
      <section className="at-integrate">
        <h2 className="at-section-title" style={{ textAlign: "center" }}>How It Fits FarmHub</h2>
        <p className="at-section-sub" style={{ textAlign: "center", maxWidth: 520, margin: "8px auto 40px" }}>
          Agri-Tech data flows directly into your land listings, bid valuations, and M-Pesa payment records.
        </p>
        <div className="at-integrate-steps">
          {[
            { step: "01", icon: "🔐", title: "Authenticate", desc: "JWT-secured login for Landowners and Tenants via the FarmHub auth system." },
            { step: "02", icon: "📡", title: "Deploy Sensors", desc: "Install TerraPulse sensors on your listed land. Data syncs to your FarmHub dashboard in real-time." },
            { step: "03", icon: "📍", title: "Map Your Land", desc: "AeroScan drone mapping creates georeferenced plots that appear on Google Maps inside FarmHub." },
            { step: "04", icon: "💳", title: "Pay via M-Pesa", desc: "All AgriTech subscriptions and equipment purchases are processed through M-Pesa integration." },
          ].map((s) => (
            <div className="at-step" key={s.step}>
              <div className="at-step-num">{s.step}</div>
              <div className="at-step-icon">{s.icon}</div>
              <h4 className="at-step-title">{s.title}</h4>
              <p className="at-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARCHITECTURE CALLOUT ── */}
      <section className="at-arch">
        <div className="at-arch-inner">
          <div className="at-arch-text">
            <div className="at-hero-tag" style={{ marginBottom: 16 }}>System Architecture</div>
            <h2 className="at-arch-title">Built on a Solid Stack</h2>
            <p className="at-arch-desc">
              FarmHub follows a three-tier architecture — React.js frontend, Node.js/Express backend, and PostgreSQL database.
              Agri-Tech sensor APIs integrate at the backend layer, feeding data through RESTful endpoints secured with JWT.
            </p>
            <div className="at-arch-stack">
              {["React.js", "Node.js / Express", "PostgreSQL", "M-Pesa API", "Google Maps API"].map((t) => (
                <span className="at-stack-badge" key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="at-arch-diagram">
            {["Frontend (React.js)", "Backend (Node.js/Express)", "Database (PostgreSQL)", "APIs (M-Pesa, Google Maps)"].map((layer, i) => (
              <div className="at-arch-layer" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="at-arch-layer-label">{layer}</div>
                {i < 3 && <div className="at-arch-arrow">↓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="at-proof">
        <p className="at-proof-label">Trusted by 2,500+ Kenyan Farmers</p>
        <div className="at-proof-logos">
          {["🌾 AgriKenya", "🌿 GreenFarms", "🏡 LandCo", "🚜 FarmTech KE", "💧 IrrigatePro"].map((l) => (
            <div className="at-proof-logo" key={l}>{l}</div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="at-footer">
        <div className="at-footer-inner">
          <div>
            <div className="at-footer-brand">
              <div className="at-footer-icon">🌿</div>
              <span className="at-footer-name">FarmHub</span>
            </div>
            <p className="at-footer-desc">
              Kenya's agricultural land leasing platform — connecting landowners and tenants through technology.
            </p>
          </div>
          <div className="at-footer-col">
            <h4>Platform</h4>
            <a href="/listings">Marketplace</a>
            <a href="/investments">Investment Plans</a>
            <a href="/agritech">Agri-Tech</a>
          </div>
          <div className="at-footer-col">
            <h4>System</h4>
            <a href="#">Land Posting</a>
            <a href="#">Bidding Engine</a>
            <a href="#">M-Pesa Payments</a>
            <a href="#">Admin Panel</a>
          </div>
          <div className="at-footer-col">
            <h4>Project</h4>
            <a href="#">KCA University</a>
            <a href="#">SRS Document</a>
            <a href="#">Design Spec</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="at-footer-bottom">
          <p>© 2025 FarmHub Kenya — John Mwangi Gitahi · KCA University · Bachelor of IT</p>
          <div className="at-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>

      {/* ── DEMO MODAL ── */}
      {demoModal && (
        <div className="at-modal-overlay" onClick={() => setDemoModal(null)}>
          <div className="at-modal" onClick={(e) => e.stopPropagation()}>
            <div className="at-modal-header">
              <h3>Book a Demo{demoModal !== "general" ? ` — ${demoModal}` : ""}</h3>
              <button className="at-modal-close" onClick={() => setDemoModal(null)}>✕</button>
            </div>
            <div className="at-modal-body">
              <div className="at-modal-row">
                <div>
                  <label>Full Name</label>
                  <input type="text" placeholder="John Gitahi" className="at-modal-input" />
                </div>
                <div>
                  <label>Phone (M-Pesa)</label>
                  <input type="tel" placeholder="+254 7XX XXX XXX" className="at-modal-input" />
                </div>
              </div>
              <div>
                <label>County / Location</label>
                <select className="at-modal-input">
                  <option>Select County</option>
                  <option>Nakuru</option>
                  <option>Kiambu</option>
                  <option>Laikipia</option>
                  <option>Kilifi</option>
                  <option>Kericho</option>
                </select>
              </div>
              <div>
                <label>Message</label>
                <textarea className="at-modal-input" rows={3} placeholder="Tell us about your farm..." />
              </div>
              <button className="at-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setDemoModal(null)}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}