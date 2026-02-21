import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  Facebook, Twitter, Instagram, Linkedin,
  GeoAlt, Phone, Envelope
} from 'react-bootstrap-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <Container>
        <Row>
          {/* Brand & Description */}
          <Col lg={4} md={6} className="mb-4">
            <h3 className="fw-bold text-success mb-3">FarmHub</h3>
            <p className="text-light mb-4">
              The leading digital marketplace for agricultural land leasing and management in Kenya.
              Building the future of farming.
            </p>
            <div className="d-flex gap-3 mb-4">
              <a href="#" className="text-white hover-green"><Facebook size={24} /></a>
              <a href="#" className="text-white hover-green"><Twitter size={24} /></a>
              <a href="#" className="text-white hover-green"><Instagram size={24} /></a>
              <a href="#" className="text-white hover-green"><Linkedin size={24} /></a>
            </div>
            <div className="d-flex align-items-center text-light mb-2">
              <Phone className="me-2" size={18} />
              <span>+254 700 123 456</span>
            </div>
            <div className="d-flex align-items-center text-light">
              <Envelope className="me-2" size={18} />
              <span>hello@farmhub.co.ke</span>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="fw-bold mb-3">Explore</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light footer-link">Browse Farms</a></li>
              <li><a href="#" className="text-light footer-link">How it Works</a></li>
              <li><a href="#" className="text-light footer-link">Verified Land</a></li>
              <li><a href="#" className="text-light footer-link">Soil Reports</a></li>
            </ul>
          </Col>

          {/* Company */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="fw-bold mb-3">Company</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light footer-link">About Us</a></li>
              <li><a href="#" className="text-light footer-link">Careers</a></li>
              <li><a href="#" className="text-light footer-link">Our Blog</a></li>
              <li><a href="#" className="text-light footer-link">Contact</a></li>
            </ul>
          </Col>

          {/* Support */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="fw-bold mb-3">Support</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light footer-link">Help Center</a></li>
              <li><a href="#" className="text-light footer-link">Privacy Policy</a></li>
              <li><a href="#" className="text-light footer-link">Terms of Service</a></li>
              <li><a href="#" className="text-light footer-link">FAQ</a></li>
            </ul>
          </Col>

          {/* Locations */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="fw-bold mb-3">
              <GeoAlt className="me-2" /> Locations
            </h5>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-success rounded-pill px-3 py-2">NAIROBI</span>
              <span className="badge bg-success rounded-pill px-3 py-2">NAKURU</span>
              <span className="badge bg-success rounded-pill px-3 py-2">ELDORET</span>
              <span className="badge bg-secondary rounded-pill px-3 py-2">+8 MORE</span>
            </div>
          </Col>
        </Row>

        {/* Divider */}
        <hr className="border-light my-4" />

        {/* Copyright */}
        <Row className="text-center">
          <Col>
            <p className="mb-2">
              © {currentYear} FarmHub Kenya Ltd. All rights reserved.
            </p>
            <p className="text-light small">
              Reg. No. PVT-2024-FH-001 | Certified by Agriculture Ministry of Kenya
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;