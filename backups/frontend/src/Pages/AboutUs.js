import React, { useState } from "react";
import "./AboutUs.css";

const TEAM = [
  {
    name: "Dr. Sarah Mwangi",
    role: "Founder & CEO",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBITwGR-KU8vWw3rX_U0kDyBS6vPtJN_KY_c6Q_eTit5UHt4TtGbH55pI_xsFfVICermE3YPm5iN0F1hGbnWK0Jo7MJUPpb4-iI9tgdPYKMMbW6lEMfb8vu9LkcbEreX-nZIzZb_x6ZPAm8Oaly-7fDWHgGBq6Q2EC7Z5jr6G8QMSKFvwBBwxAwhzLw0IMsbrdwprElJyQ0kjUariT0tDby_jSDWmhjISX9zaXUk2ENyARewVhzEbwouke1IAuRt_59bQkKt6H1as4",
    bio: "15 years in agricultural finance. Led Kenya's first farmland crowdfunding initiative.",
    linkedin: "#",
  },
  {
    name: "David Kiprop",
    role: "Head of Agronomy",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYCRN2Sp1vfJvw-5jReRJ8VmkrseMP0Zy8FIE979ZhW3TE7gGVa06zDzWsiS365Wmt_jskrWTVY10EMnu8UD83WwlYXwNOP0rptheLbz58taDzksl6aidxG7tVrKi5ONibIKrHn9gnuhSLXHTp-v0IvRKPnwsUDzYKn4wOmv6Oy5nF7QpWOp_IEApJN3ms1-7DOHYtuoWnB8eZOiRH40pAiZ4JywmjExcyGKrPO2xiry9mCAC70U38vOFYJOM9hXcilcslAKcEYPM",
    bio: "PhD in Soil Science, Egerton University. Expert in precision agriculture and crop rotation.",
    linkedin: "#",
  },
  {
    name: "Linda Atieno",
    role: "Community Lead",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIbN3IxXgZ6vPyp4akCx-QamPBKghO8oDNWulLk0rLzZorD2Qo-7PH4aNYwpherB8V7llSWPPExPqz6yi835mLCIJ6l-xGYsV7sohDrj5_N1XVMOFhUDhD_6pb17acrOJPWNe55WeV30K6FTeB5dxEk3sxQ04VzHAyyx8HK14lc8nKXB5dVEgagYQMwjq-OKM0CyaNlp2yQQseKE_g6wXjJ49kRspw8lEa5bOmyGHWMRoDvMkhe4RRGM6MxGUdb36W6gNFtpAYbJ8",
    bio: "Connects over 5,000 smallholder farmers to the FarmHub platform across 12 counties.",
    linkedin: "#",
  },
  {
    name: "Samuel Odhiambo",
    role: "Operations Director",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHYgbt7oL3RELCCv1CMxTimju5jOdIxr-bL5EW3TVHm_9hKivem_MQXr50otd1CT3UAXr_y5ztRvSI0v2Z-EXIOMEejiHspriuvDLPsvEKY12NBKZM2VMLCNgoKuh1yED4GSAWnaHxFM1hXahVKb7YmJdg3oLF9tKfM07klhUj3RAszJgVomI7Q3Pc3PtzXxDV9-Sujl8gKukwVpIt2FurVUnsQ1rrN4j6GvjAabQpql4737Rd_ihklhgb6Lo3Pw0Cvq_pf_HhsGY",
    bio: "Oversees platform logistics, M-Pesa integration, and Google Maps land verification.",
    linkedin: "#",
  },
];

const VALUES = [
  { icon: "🌱", title: "Sustainability", desc: "We champion farming practices that protect Kenya's land for future generations." },
  { icon: "🤝", title: "Inclusion",      desc: "Every farmer, from large estates to half-acre plots, deserves equal access to technology." },
  { icon: "🔒", title: "Trust",          desc: "Transparent transactions, verified listings, and JWT-secured accounts for every user." },
  { icon: "📡", title: "Innovation",     desc: "From M-Pesa payments to drone mapping, we bring cutting-edge tools to agriculture." },
];

const MILESTONES = [
  { year: "2021", event: "FarmHub founded at KCA University, Nairobi." },
  { year: "2022", event: "Launched first land listing module with Google Maps integration." },
  { year: "2023", event: "M-Pesa payment gateway live — 500+ transactions in first month." },
  { year: "2024", event: "Crossed 5,000 registered farmers across 12 Kenyan counties." },
  { year: "2025", event: "Investment Plans & Agri-Tech Solutions modules launched." },
];

export default function AboutUs() {
  const [activeMilestone, setActiveMilestone] = useState(null);

  return (
    <div className="ab-root" style={{ marginTop: '80px' }}>

      {/* Navbar is now handled in App.js for this route */}

      {/* ── HERO ── */}
      <section className="ab-hero">
        <div className="ab-hero-img-wrap">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB_XBf5ZWmY41QRJE4AwTaPuVXD4nGoj04J-sMwMBTYIfn_B4F1h_cZCE4HMO9pAdDPmV9QMiWaEAaxK1ulMNBcSNHSxr8BpNgw5jq_Q728YgX-waOYCvaN02LqhvTqFg2YJImdBaOlVaUQtqLhAo31PlqyhJWFeKVhNosWp3eUIhTiMQ2z58DCBa3pUYsuJJznGMGqOc4GUFHp61CjnxOsdyoE-Gp4-2XxuA67azOFfAiKmQI5cCj9v5DhaNIrIleQhBRMDqknL8"
            alt="Kenyan highlands tea plantation"
          />
          <div className="ab-hero-overlay" />
          <div className="ab-hero-content">
            <span className="ab-hero-tag">EST. 2021</span>
            <h1 className="ab-hero-heading">
              Empowering the<br />Backbone of Kenya
            </h1>
            <p className="ab-hero-sub">
              Bridging the gap between traditional farming wisdom and modern agricultural technology — one lease at a time.
            </p>
            <div className="ab-hero-stats">
              <div className="ab-hero-stat">
                <strong>5,000+</strong><span>Farmers</span>
              </div>
              <div className="ab-hero-stat-div" />
              <div className="ab-hero-stat">
                <strong>12+</strong><span>Counties</span>
              </div>
              <div className="ab-hero-stat-div" />
              <div className="ab-hero-stat">
                <strong>+25%</strong><span>Avg Yield</span>
              </div>
              <div className="ab-hero-stat-div" />
              <div className="ab-hero-stat">
                <strong>KES 2.4B+</strong><span>Transacted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="ab-section ab-mv">
        <div className="ab-section-inner">
          <div className="ab-section-header">
            <div className="ab-section-tag">Who We Are</div>
            <h2 className="ab-section-title">Our Core Purpose</h2>
            <p className="ab-section-sub">
              FarmHub was built with a simple belief — every Kenyan farmer deserves access to the same tools as the world's best agricultural enterprises.
            </p>
          </div>
          <div className="ab-mv-grid">
            <div className="ab-mv-card">
              <div className="ab-mv-icon">🧠</div>
              <h3 className="ab-mv-title">Our Mission</h3>
              <p className="ab-mv-desc">
                To provide Kenyan farmers with modern tools, data-driven insights, and direct market access — sustainably increasing yields and improving livelihoods across the country.
              </p>
            </div>
            <div className="ab-mv-card ab-mv-card-dark">
              <div className="ab-mv-icon">👁️</div>
              <h3 className="ab-mv-title" style={{ color: "#fff" }}>Our Vision</h3>
              <p className="ab-mv-desc" style={{ color: "rgba(255,255,255,0.7)" }}>
                A sustainable, food-secure Kenya powered by thriving smallholder farmers who are globally competitive, technologically empowered, and financially included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="ab-section ab-values-section">
        <div className="ab-section-inner">
          <div className="ab-section-header">
            <div className="ab-section-tag">What Drives Us</div>
            <h2 className="ab-section-title">Our Values</h2>
          </div>
          <div className="ab-values-grid">
            {VALUES.map((v, i) => (
              <div className="ab-value-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="ab-value-icon">{v.icon}</div>
                <h4 className="ab-value-title">{v.title}</h4>
                <p className="ab-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="ab-section ab-story-section">
        <div className="ab-section-inner ab-story-inner">
          <div className="ab-story-text">
            <div className="ab-section-tag">How We Started</div>
            <h2 className="ab-section-title">The FarmHub Story</h2>
            <p className="ab-story-para">
              FarmHub began in the heart of rural Kenya, where our founders witnessed firsthand the challenges small-scale farmers faced: unpredictable weather patterns, lack of quality inputs, and exploitation by middlemen who controlled access to land and markets.
            </p>
            <p className="ab-story-para">
              We realized that technology wasn't reaching the people who needed it most. By combining agricultural expertise with accessible mobile tools, we created a platform that treats every farmer as an entrepreneur — giving them the data, land access, and financial tools they need to succeed.
            </p>
            <p className="ab-story-para">
              Today, FarmHub connects landowners and tenants through a secure leasing platform backed by M-Pesa payments, Google Maps visualisation, and a bidding engine that ensures fair land pricing for everyone.
            </p>
          </div>
          <div className="ab-story-right">
            <div className="ab-story-img-wrap">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYFV3-pmAT7A5JKYGEuJPh5GLiof0YMfVs9570j0xdmyIGuT9v0VTBuQA4LQeKng-La-EZWb3r7SF3Lj5TbY79FntGu4TFKFO91mRlf54rMbiW_jZRr2JfAR3d2hxI_9_j5XzK3sHJ8hDkHm3zKWie9tVVPG2M8Gf7jkLpo3Aiys5Dz37MMnPG3tOV10fLBYm9oxBOhTp3Xa97vSj_K0uIRAGvzolAz2JCRpHhO5R5GN1LHYzw1VOK8Dfk8B2I5-5unfvUNJEfucI"
                alt="Smiling Kenyan farmer holding maize"
              />
            </div>
            {/* Timeline */}
            <div className="ab-timeline">
              {MILESTONES.map((m, i) => (
                <div
                  key={i}
                  className={`ab-milestone ${activeMilestone === i ? "ab-milestone-active" : ""}`}
                  onClick={() => setActiveMilestone(activeMilestone === i ? null : i)}
                >
                  <div className="ab-milestone-year">{m.year}</div>
                  <div className="ab-milestone-line">
                    <div className="ab-milestone-dot" />
                    {i < MILESTONES.length - 1 && <div className="ab-milestone-connector" />}
                  </div>
                  <div className="ab-milestone-event">{m.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="ab-section ab-team-section">
        <div className="ab-section-inner">
          <div className="ab-section-header">
            <div className="ab-section-tag">The People Behind It</div>
            <h2 className="ab-section-title">Our Leadership</h2>
            <p className="ab-section-sub">Expertise across agronomy, technology, finance, and community development.</p>
          </div>
          <div className="ab-team-grid">
            {TEAM.map((person, i) => (
              <div className="ab-team-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="ab-team-img-wrap">
                  <img src={person.img} alt={person.name} />
                  <div className="ab-team-overlay">
                    <a href={person.linkedin} className="ab-team-linkedin">in</a>
                  </div>
                </div>
                <div className="ab-team-info">
                  <h4 className="ab-team-name">{person.name}</h4>
                  <p className="ab-team-role">{person.role}</p>
                  <p className="ab-team-bio">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ab-cta">
        <div className="ab-cta-inner">
          <div className="ab-cta-text">
            <h2 className="ab-cta-title">Be Part of the Growth</h2>
            <p className="ab-cta-desc">
              Join thousands of farmers already using FarmHub to transform their harvest, lease land, and invest in Kenya's agricultural future.
            </p>
          </div>
          <div className="ab-cta-actions">
            <a href="/listings" className="ab-cta-btn-primary">Browse Land Listings</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ab-footer">
        <div className="ab-footer-inner">
          <div>
            <div className="ab-footer-brand">
              <div className="ab-footer-icon">🌿</div>
              <span className="at-footer-name">FarmHub</span>
            </div>
            <p className="ab-footer-desc">
              Kenya's leading agricultural land leasing and investment platform. Connecting landowners with tenants since 2021.
            </p>
          </div>
          <div className="ab-footer-col">
            <h4>Platform</h4>
            <a href="/listings">Marketplace</a>
            <a href="/about">About Us</a>
          </div>
          <div className="ab-footer-col">
            <h4>Company</h4>
            <a href="/about">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div className="ab-footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
        <div className="ab-footer-bottom">
          <p>© 2025 FarmHub Kenya — KCA University · Bachelor of IT · John Mwangi Gitahi</p>
          <div className="ab-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}