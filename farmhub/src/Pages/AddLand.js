import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listingsAPI } from "../api";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "./AddLand.css";

// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const COUNTIES = [
  { id: 'nakuru',      name: 'Nakuru',      center: [-0.3031, 36.0800] },
  { id: 'kiambu',      name: 'Kiambu',      center: [-1.1462, 36.8231] },
  { id: 'narok',       name: 'Narok',       center: [-1.0781, 35.8601] },
  { id: 'laikipia',    name: 'Laikipia',    center: [0.3606, 36.7388] },
  { id: 'uasin-gishu', name: 'Uasin Gishu', center: [0.5143, 35.2697] },
  { id: 'kilifi',      name: 'Kilifi',      center: [-3.6307, 39.8499] },
  { id: 'nairobi',     name: 'Nairobi',     center: [-1.2921, 36.8219] },
  { id: 'mombasa',     name: 'Mombasa',     center: [-4.0352, 39.6641] },
  { id: 'kisumu',      name: 'Kisumu',      center: [-0.0917, 34.7680] },
];

function LocationPicker({ onLocationSelect, position }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function AddLand() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previews, setPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    county: "nairobi",
    location: "",
    size_acres: "",
    price_kes: "",
    latitude: -1.2921,
    longitude: 36.8219,
    auction_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    has_water: false,
    has_electricity: false,
    has_road_access: false,
    has_fencing: false,
    has_irrigation: false,
  });

  const [mapCenter, setMapCenter] = useState([-1.2921, 36.8219]);

  useEffect(() => {
    document.title = "List Your Land | FarmHub Kenya";
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      
      // Update map center when county changes
      if (name === 'county') {
        const countyData = COUNTIES.find(c => c.id === value);
        if (countyData) {
          setMapCenter(countyData.center);
          updated.latitude = countyData.center[0];
          updated.longitude = countyData.center[1];
        }
      }
      return updated;
    });
  };

  const handleLocationSelect = (latlng) => {
    setFormData(prev => ({
      ...prev,
      latitude: latlng.lat,
      longitude: latlng.lng
    }));
  };

  const parseDMS = (dmsStr) => {
    try {
      // Pattern for 0°59'43.3"S 36°39'28.0"E
      const regex = /(\d+)°(\d+)'(\d+\.?\d*)"([NS])\s+(\d+)°(\d+)'(\d+\.?\d*)"([EW])/i;
      const match = dmsStr.match(regex);
      
      if (match) {
        const [_, latD, latM, latS, latDir, lngD, lngM, lngS, lngDir] = match;
        
        let lat = parseInt(latD) + parseInt(latM)/60 + parseFloat(latS)/3600;
        if (latDir.toUpperCase() === 'S') lat = -lat;
        
        let lng = parseInt(lngD) + parseInt(lngM)/60 + parseFloat(lngS)/3600;
        if (lngDir.toUpperCase() === 'W') lng = -lng;

        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
        setMapCenter([lat, lng]);
        setError("");
      } else {
        setError("Invalid DMS format. Please use 0°59'43.3\"S 36°39'28.0\"E");
      }
    } catch (e) {
      setError("Error parsing coordinates.");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.title || !formData.location || !formData.size_acres || !formData.price_kes) {
        throw new Error("Please fill in all required fields.");
      }

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        let value = formData[key];
        if (key === 'latitude' || key === 'longitude') {
          value = parseFloat(Number(value).toFixed(6));
        }
        data.append(key, value);
      });
      selectedFiles.forEach(file => {
        data.append('uploaded_images', file);
      });

      await listingsAPI.create(data);
      setSuccess("Land listing created successfully!");
      setTimeout(() => navigate("/listings"), 2000);
    } catch (err) {
      console.error("Upload error:", err);
      if (typeof err === 'object' && !err.message) {
        const errorMsgs = Object.keys(err).map(field => {
          const val = err[field];
          return `${field}: ${Array.isArray(val) ? val[0] : val}`;
        }).join(" | ");
        setError(errorMsgs || "Failed to create listing.");
      } else {
        setError(err.message || "Failed to create listing.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-land-root" style={{ marginTop: '80px' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="bg-success text-white p-4 text-center">
                <h2 className="fw-bold mb-0">List Your Land</h2>
                <p className="mb-0 opacity-75">Capture precise location and details for farmers</p>
              </div>
              <div className="card-body p-4 p-md-5">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="add-land-form">
                  <div className="row">
                    <div className="col-md-6">
                      <section className="form-section mb-4">
                        <h5 className="border-bottom pb-2 mb-3 text-success fw-bold">Basic Information</h5>
                        <div className="mb-3">
                          <label className="form-label fw-medium">Listing Title*</label>
                          <input type="text" name="title" className="form-control" placeholder="e.g., 10-Acre Fertile Land" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-medium">Description*</label>
                          <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required></textarea>
                        </div>
                      </section>

                      <section className="form-section mb-4">
                        <h5 className="border-bottom pb-2 mb-3 text-success fw-bold">Size, Price & Timeline</h5>
                        <div className="row">
                          <div className="col-6 mb-3">
                            <label className="form-label fw-medium">Size (Acres)*</label>
                            <input type="number" step="0.01" name="size_acres" className="form-control" value={formData.size_acres} onChange={handleChange} required />
                          </div>
                          <div className="col-6 mb-3">
                            <label className="form-label fw-medium">Start Price (KES)*</label>
                            <input type="number" name="price_kes" className="form-control" value={formData.price_kes} onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-medium text-danger fw-bold">Bidding Deadline (Auction End)*</label>
                          <input 
                            type="datetime-local" 
                            name="auction_ends_at" 
                            className="form-control border-danger" 
                            value={formData.auction_ends_at} 
                            onChange={handleChange} 
                            required 
                          />
                          <small className="text-muted">Bidding will automatically close at this time.</small>
                        </div>
                      </section>
                    </div>

                    <div className="col-md-6">
                      <section className="form-section mb-4">
                        <h5 className="border-bottom pb-2 mb-3 text-success fw-bold">Exact Map Location</h5>
                        <div className="mb-3">
                          <label className="form-label fw-medium">County*</label>
                          <select name="county" className="form-select" value={formData.county} onChange={handleChange} required>
                            {COUNTIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-medium">Area Name*</label>
                          <input type="text" name="location" className="form-control" placeholder="e.g., Molo, Salgaa" value={formData.location} onChange={handleChange} required />
                        </div>
                        <div className="map-picker-container rounded-3 overflow-hidden border mb-2" style={{ height: '250px' }}>
                          <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationPicker onLocationSelect={handleLocationSelect} position={[formData.latitude, formData.longitude]} />
                          </MapContainer>
                        </div>
                        <p className="text-muted small mb-3">Click on the map to pin the exact location or enter coordinates below.</p>
                        
                        <div className="mb-3">
                          <label className="form-label small fw-bold">DMS Coordinates (0°59'43.3"S 36°39'28.0"E)</label>
                          <div className="input-group input-group-sm">
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder={`0°59'43.3"S 36°39'28.0"E`}
                              onBlur={(e) => parseDMS(e.target.value)}
                            />
                            <button className="btn btn-outline-secondary" type="button" onClick={(e) => parseDMS(e.target.previousSibling.value)}>Apply</button>
                          </div>
                          <small className="text-muted" style={{fontSize: '10px'}}>Paste from Google Maps (DMS format) to auto-fill below.</small>
                        </div>

                        <div className="row g-2">
                          <div className="col-6">
                            <label className="form-label small fw-bold">Latitude</label>
                            <input 
                              type="number" 
                              step="0.000001" 
                              name="latitude" 
                              className="form-control form-control-sm" 
                              value={formData.latitude} 
                              onChange={handleChange} 
                            />
                          </div>
                          <div className="col-6">
                            <label className="form-label small fw-bold">Longitude</label>
                            <input 
                              type="number" 
                              step="0.000001" 
                              name="longitude" 
                              className="form-control form-control-sm" 
                              value={formData.longitude} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  <section className="form-section mb-4">
                    <h5 className="border-bottom pb-2 mb-3 text-success fw-bold">Photos & Amenities</h5>
                    <div className="mb-3">
                      <input type="file" multiple accept="image/*" className="form-control" onChange={handleFileChange} required={selectedFiles.length === 0} />
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {previews.map((src, i) => <img key={i} src={src} alt="" className="rounded shadow-sm" style={{width: '60px', height: '60px', objectFit: 'cover'}} />)}
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="form-check d-flex align-items-center gap-2">
                          <input className="form-check-input" type="checkbox" name="has_water" checked={formData.has_water} onChange={handleChange} id="w" />
                          <label className="form-check-label d-flex align-items-center gap-1" htmlFor="w">
                            <span className="material-symbols-outlined small">water_drop</span> Water
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check d-flex align-items-center gap-2">
                          <input className="form-check-input" type="checkbox" name="has_electricity" checked={formData.has_electricity} onChange={handleChange} id="e" />
                          <label className="form-check-label d-flex align-items-center gap-1" htmlFor="e">
                            <span className="material-symbols-outlined small">bolt</span> Electricity
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check d-flex align-items-center gap-2">
                          <input className="form-check-input" type="checkbox" name="has_road_access" checked={formData.has_road_access} onChange={handleChange} id="r" />
                          <label className="form-check-label d-flex align-items-center gap-1" htmlFor="r">
                            <span className="material-symbols-outlined small">add_road</span> Road Access
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check d-flex align-items-center gap-2">
                          <input className="form-check-input" type="checkbox" name="has_fencing" checked={formData.has_fencing} onChange={handleChange} id="f" />
                          <label className="form-check-label d-flex align-items-center gap-1" htmlFor="f">
                            <span className="material-symbols-outlined small">fence</span> Fenced
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check d-flex align-items-center gap-2">
                          <input className="form-check-input" type="checkbox" name="has_irrigation" checked={formData.has_irrigation} onChange={handleChange} id="i" />
                          <label className="form-check-label d-flex align-items-center gap-1" htmlFor="i">
                            <span className="material-symbols-outlined small">shower</span> Irrigation
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-success btn-lg fw-bold py-3" disabled={loading}>
                      {loading ? "Publishing..." : "Publish Listing →"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
