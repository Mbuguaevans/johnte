import React, { useState } from "react";
import "./InvestmentPlans.css";

const PLANS = [
  {
    id: 1,
    category: "crops",
    tag: "Seasonal Harvest",
    verified: true,
    title: "Organic Wheat Crowdfunding",
    desc: "Short-term gains from seasonal wheat harvesting in the North plains. Rich volcanic soil with guaranteed offtake agreements.",
    roi: "15%",
    duration: "6m",
    risk: "Med",
    riskColor: "risk-med",
    funded: 75,
    fundedLabel: "75% ($37,500 / $50,000)",
    minEntry: "$500",
    status: "open",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3qrOk9DN9p4_JzD6V0doq1ZNfB3C4BaiHAfcsJhs1ophg9AjCSJEyVh_RAMxpvRppNUjTWTcLk__LTjKsdluETg_JJRNCL5dmuLhqWKUO2li4Ns7niuweHB6SbDMBRJQWI6o80_HTGi8UhFlyA-8btvhiJNfz5J0tNnDNUkNGdMYrczFuw115dXiVa3R6_PGRWMeN0-K-pHhCgVNh6esbct-Ks9uxBJgoWHjg8wB0jzGceHhrG3fYQPcw-Eds6CZYpva8afsaQZQ",
  },
  {
    id: 2,
    category: "land",
    tag: "Wealth Builder",
    verified: false,
    title: "Savannah Land Appreciation",
    desc: "Long-term equity in prime arable land with compounding value. Ideal for patient investors seeking stable returns.",
    roi: "8%+",
    duration: "5y",
    risk: "Low",
    riskColor: "risk-low",
    funded: 20,
    fundedLabel: "20% ($200k / $1M)",
    minEntry: "$2,500",
    status: "open",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIGeIxPOVn3rtyVJd8NJHS_gHY7AOqKT0XAh33-WnLIUvds_i5J0MCBFUY9vfzlmS49hCvxdIFatfMUAAsJdKqXxk9PbHhlY8pHOlRsVApVFwYCH62H8Aj3LmQ9yjIMt8UJ3_pp7Ws_S3LsskckXdQmnsSzd9V65aDLF38D8ODlDfvxpKok94jV-RKTZTudqTZeDPO5jTq2inHhCW7Gog0mou1O06PMdf9Ta492NZaSF1q5a2dm-8N6Q_rNRCO8treDmAJ0C5Dl0g",
  },
  {
    id: 3,
    category: "commercial",
    tag: "Commercial",
    verified: true,
    title: "Commercial Dairy Stakes",
    desc: "Industrial scale dairy production with automated systems and proven cash flow history.",
    roi: "25%",
    duration: "24m",
    risk: "High",
    riskColor: "risk-high",
    funded: 100,
    fundedLabel: "100% Funded",
    minEntry: "$1,000",
    status: "funded",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUA6_HFxPn8mIVq5d0GcrtfPxthNIxYV0znW7u1jAFYjJ36jFj1R-A-r30Z4b-BpgQ5mKPxlw2CT8FshsMRHGLt2Upb_OYrzl7rvaqd-nUgxSlZ8DkmZbG3L6cdv4Zyt2QRaY5tPEy9jJvLldfuNXmhj4hxAvmIBYOzl2hkfYj_Cw-cjeAm7bvlQsIZv9E7p1ytJJGA-4KlBE0yRznYjDvOF0Z84mNo_62p7eMbqkoOrtrMJBblDfSu9n1idFL3igXggB3Wmba1ws",
  },
  {
    id: 4,
    category: "crops",
    tag: "High Yield",
    verified: true,
    title: "Avocado Orchard Fund",
    desc: "Invest in a maturing avocado orchard in Murang'a with export-grade produce and contracted buyers.",
    roi: "18%",
    duration: "12m",
    risk: "Low",
    riskColor: "risk-low",
    funded: 55,
    fundedLabel: "55% ($110k / $200k)",
    minEntry: "$750",
    status: "open",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFEhoqhzZEZN7UeE6baqNKq2WpsQY6_nbkbsr2gNBmyN-cAxYiloIUsbBZtJ8v8R63sdUi3WJSnXsFVfSmTFAfVgxG8HNUrBXn25kdrA9vZfUXq3FxO4-dHXgblWRgWRspBvG55ehZzpCbMYAyhosfFgsK0OhgP2ElfFMO_X3fGRGp5qktlwTazSAC1R9ZOenkv8E7UycH4aNoQ-uXcz3bMhn6xpyLCuVDcx0D0NIPvAPtPE3BA-3MlUhge49lxY9Qf8kLZifoWLc",
  },
  {
    id: 5,
    category: "land",
    tag: "New Listing",
    verified: false,
    title: "Rift Valley Farmland Pool",
    desc: "Pooled investment in three parcels of fertile Rift Valley farmland. Lease income distributed quarterly.",
    roi: "11%",
    duration: "3y",
    risk: "Low",
    riskColor: "risk-low",
    funded: 40,
    fundedLabel: "40% ($80k / $200k)",
    minEntry: "$1,000",
    status: "open",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxM88sDWMHqhOJT_Dv1eqCl0gWZ9BG4hDWKxm_QU_lU6LbXKxP8VwT9nYKmD1hjR59ullSutZ3ir3OhQKIG36jBYd0pAv5EeX9jey_wqvyQd36oHtUucAIi1dtdC66Fk903u38Ergo9gP3ueqzYyRvnA7bhzP_Ez4XfdkSUr3F7bK-JPs-6mtzbeRjAcbUw4totK_YzMnmbR3IT1VqaLch2OmRtBE6A0hpnD1HXIJnFOS3BgjtfqmMjFEfxdpQVg3WdYFXKRYrCBQ",
  },
  {
    id: 6,
    category: "commercial",
    tag: "Premium",
    verified: true,
    title: "Tea Processing Plant Stake",
    desc: "Co-own a share in a Kericho tea processing facility supplying major export markets.",
    roi: "20%",
    duration: "36m",
    risk: "Med",
    riskColor: "risk-med",
    funded: 88,
    fundedLabel: "88% ($440k / $500k)",
    minEntry: "$3,000",
    status: "open",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYOu6jxkJZbPp7RP8T2Wpz77q1YoL0HXu7pORTX6kW3buqUx6briGlFhA5-rmy2jJBZL3qyZ5M7mnKYMks_SNMhIRXdDDSoAxLNWMyhcz3HAoDet6jKKNnQLg9YaQ_iHN-3AUtJSeTUlSWYrZp34vkJYD1TK_GSO7qYjAddMtUxEkPF-CKAaAZwZbkJqnYAzSjPxFms5cS0X-zg2EFZHVbqKWj6Tmcacc7ABN3bjqQVoHqCIUtJy5eLd0OzdFOXVAkdtnrIkLBOWk",
  },
];

const TABS = ["All", "Crops", "Land", "Commercial"];

export default function InvestmentPlans() {
  const [activeTab, setActiveTab]   = useState("All");
  const [investing, setInvesting]   = useState(null);
  const [saved, setSaved]           = useState([]);
  const [sort, setSort]             = useState("newest");

  const toggleSave = (id) =>
    setSaved((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  const filtered = PLANS
    .filter((p) => activeTab === "All" || p.category === activeTab.toLowerCase())
    .sort((a, b) => {
      if (sort === "roi-desc") return parseFloat(b.roi) - parseFloat(a.roi);
      if (sort === "roi-asc")  return parseFloat(a.roi) - parseFloat(b.roi);
      if (sort === "funded")   return b.funded - a.funded;
      return 0;
    });

  return (
    <div className="ip-root">

      {/* ── NAV ── */}
      <header className="ip-nav">
        <div className="ip-nav-inner">
          <a href="/listings" className="ip-brand">
            <div className="ip-brand-icon">🌿</div>
            <span className="ip-brand-name">FarmHub</span>
          </a>
          <nav className="ip-nav-links">
            <a href="/listings">Marketplace</a>
            <a href="/investments" className="active">Investment Plans</a>
            <a href="/agritech">Agri-Tech</a>
            <a href="#">About Us</a>
          </nav>
          <div className="ip-nav-right">
            <div className="ip-wallet-badge">💰 Wallet: $1,250</div>
            <button className="ip-list-btn">+ List Investment</button>
            <div className="ip-avatar" onClick={handleLogout} title="Logout">U</div>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="ip-hero">
        <div className="ip-hero-text">
          <div className="ip-hero-tag">📈 Agricultural Investments</div>
          <h1 className="ip-hero-heading">
            Grow Your Wealth<br />
            <span className="ip-hero-accent">with Kenyan Farmland</span>
          </h1>
          <p className="ip-hero-desc">
            Invest in vetted agricultural projects — from crop crowdfunding to land appreciation funds.
            All transactions secured via M-Pesa.
          </p>
          <div className="ip-hero-stats">
            <div className="ip-hero-stat"><strong>KES 2.4B+</strong><span>Total Invested</span></div>
            <div className="ip-hero-stat-div" />
            <div className="ip-hero-stat"><strong>340+</strong><span>Active Plans</span></div>
            <div className="ip-hero-stat-div" />
            <div className="ip-hero-stat"><strong>12–25%</strong><span>Avg ROI</span></div>
          </div>
        </div>
        <div className="ip-hero-cards">
          <div className="ip-hero-card ip-hero-card-1">
            <span className="ip-hc-icon">🌾</span>
            <div>
              <div className="ip-hc-title">Crops</div>
              <div className="ip-hc-sub">Short-term • 6–12m</div>
            </div>
            <div className="ip-hc-roi">+15%</div>
          </div>
          <div className="ip-hero-card ip-hero-card-2">
            <span className="ip-hc-icon">🏡</span>
            <div>
              <div className="ip-hc-title">Land</div>
              <div className="ip-hc-sub">Long-term • 3–5y</div>
            </div>
            <div className="ip-hc-roi">+8%</div>
          </div>
          <div className="ip-hero-card ip-hero-card-3">
            <span className="ip-hc-icon">🏭</span>
            <div>
              <div className="ip-hc-title">Commercial</div>
              <div className="ip-hc-sub">Mid-term • 1–3y</div>
            </div>
            <div className="ip-hc-roi">+25%</div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="ip-main">

        {/* ── TOP BAR ── */}
        <div className="ip-topbar">
          <div className="ip-topbar-left">
            <div className="ip-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`ip-tab ${activeTab === tab ? "ip-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >{tab}</button>
              ))}
            </div>
            <span className="ip-results-count">
              <strong>{filtered.length}</strong> plans available
            </span>
          </div>
          <div className="ip-topbar-right">
            <span className="ip-sort-label">Sort by</span>
            <select
              className="ip-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="roi-desc">ROI: High to Low</option>
              <option value="roi-asc">ROI: Low to High</option>
              <option value="funded">Most Funded</option>
            </select>
          </div>
        </div>

        {/* ── PLANS GRID ── */}
        <div className="ip-grid">
          {filtered.map((plan, i) => (
            <div
              key={plan.id}
              className={`ip-card ${plan.status === "funded" ? "ip-card-funded" : ""}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Image */}
              <div className="ip-card-img">
                <img
                  src={plan.img}
                  alt={plan.title}
                  className={plan.status === "funded" ? "img-grayscale" : ""}
                />
                <div className="ip-card-tag">{plan.tag}</div>
                {plan.verified && <div className="ip-verified">✓ Verified</div>}
                {plan.status === "funded" && (
                  <div className="ip-funded-overlay">
                    <span className="ip-funded-badge">Fully Funded</span>
                  </div>
                )}
                <button
                  className={`ip-save-btn ${saved.includes(plan.id) ? "saved" : ""}`}
                  onClick={() => toggleSave(plan.id)}
                >
                  {saved.includes(plan.id) ? "♥" : "♡"}
                </button>
              </div>

              {/* Body */}
              <div className="ip-card-body">
                <h3 className={`ip-card-title ${plan.status === "funded" ? "title-funded" : ""}`}>
                  {plan.title}
                </h3>
                <p className="ip-card-desc">{plan.desc}</p>

                {/* Stats row */}
                <div className="ip-stats">
                  <div className="ip-stat">
                    <span className="ip-stat-label">ROI</span>
                    <span className={`ip-stat-val ${plan.status === "funded" ? "val-faded" : "val-green"}`}>
                      {plan.roi}
                    </span>
                  </div>
                  <div className="ip-stat ip-stat-mid">
                    <span className="ip-stat-label">Duration</span>
                    <span className={`ip-stat-val ${plan.status === "funded" ? "val-faded" : ""}`}>
                      {plan.duration}
                    </span>
                  </div>
                  <div className="ip-stat">
                    <span className="ip-stat-label">Risk</span>
                    <span className={`ip-stat-val ${plan.status === "funded" ? "val-faded" : plan.riskColor}`}>
                      {plan.risk}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="ip-progress">
                  <div className="ip-progress-labels">
                    <span>Funding Progress</span>
                    <span className={plan.status === "funded" ? "label-faded" : "label-green"}>
                      {plan.fundedLabel}
                    </span>
                  </div>
                  <div className="ip-progress-track">
                    <div
                      className={`ip-progress-bar ${plan.status === "funded" ? "bar-faded" : ""}`}
                      style={{ width: `${plan.funded}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                {plan.status === "open" ? (
                  <div className="ip-card-footer">
                    <div className="ip-min">
                      <span className="ip-min-label">Min Entry</span>
                      <span className="ip-min-val">{plan.minEntry}</span>
                    </div>
                    <button
                      className="ip-invest-btn"
                      onClick={() => setInvesting(plan)}
                    >
                      Invest Now
                    </button>
                  </div>
                ) : (
                  <button className="ip-sold-btn" disabled>Sold Out</button>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="ip-empty">
              <div style={{ fontSize: 56 }}>🌱</div>
              <p>No investment plans in this category yet.</p>
            </div>
          )}
        </div>

      </main>

      {/* ── TRUST STRIP ── */}
      <section className="ip-trust">
        {[
          { icon: "🔒", val: "JWT Secured", label: "All transactions" },
          { icon: "📱", val: "M-Pesa", label: "Payment gateway" },
          { icon: "✅", val: "Verified", label: "All landowners" },
          { icon: "📊", val: "Real-time", label: "ROI tracking" },
          { icon: "🏦", val: "KES Backed", label: "Local currency" },
        ].map((t, i) => (
          <div className="ip-trust-item" key={i}>
            <span className="ip-trust-icon">{t.icon}</span>
            <div>
              <div className="ip-trust-val">{t.val}</div>
              <div className="ip-trust-label">{t.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <footer className="ip-footer">
        <div className="ip-footer-inner">
          <div>
            <div className="ip-footer-brand">
              <div className="ip-footer-icon">🌿</div>
              <span className="ip-footer-name">FarmHub</span>
            </div>
            <p className="ip-footer-desc">
              Kenya's leading agricultural land leasing and investment platform.
            </p>
          </div>
          <div className="ip-footer-col">
            <h4>Platform</h4>
            <a href="/listings">Marketplace</a>
            <a href="/investments">Investment Plans</a>
            <a href="/agritech">Agri-Tech</a>
          </div>
          <div className="ip-footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </div>
          <div className="ip-footer-col">
            <h4>Contact</h4>
            <a href="#">Support</a>
            <a href="#">About Us</a>
            <a href="#">KCA University</a>
          </div>
        </div>
        <div className="ip-footer-bottom">
          <p>© 2025 FarmHub Kenya. All rights reserved.</p>
          <div className="ip-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>

      {/* ── INVEST MODAL ── */}
      {investing && (
        <div className="ip-modal-overlay" onClick={() => setInvesting(null)}>
          <div className="ip-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ip-modal-header">
              <h3 className="ip-modal-title">Invest in {investing.title}</h3>
              <button className="ip-modal-close" onClick={() => setInvesting(null)}>✕</button>
            </div>
            <div className="ip-modal-body">
              <div className="ip-modal-stats">
                <div className="ip-modal-stat">
                  <span>ROI</span>
                  <strong className="val-green">{investing.roi}</strong>
                </div>
                <div className="ip-modal-stat">
                  <span>Duration</span>
                  <strong>{investing.duration}</strong>
                </div>
                <div className="ip-modal-stat">
                  <span>Min Entry</span>
                  <strong>{investing.minEntry}</strong>
                </div>
                <div className="ip-modal-stat">
                  <span>Risk</span>
                  <strong className={investing.riskColor}>{investing.risk}</strong>
                </div>
              </div>
              <div className="ip-modal-row">
                <div>
                  <label>Amount to Invest ($)</label>
                  <input
                    type="number"
                    className="ip-modal-input"
                    placeholder={`Min ${investing.minEntry}`}
                  />
                </div>
                <div>
                  <label>M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    className="ip-modal-input"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              </div>
              <button
                className="ip-modal-confirm"
                onClick={() => setInvesting(null)}
              >
                Confirm via M-Pesa 📱
              </button>
              <p className="ip-modal-note">
                By investing you agree to FarmHub's terms. Investments carry risk and returns are not guaranteed.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}