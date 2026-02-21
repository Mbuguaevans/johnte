import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './HeroSection.css';

function HeroSection() {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/images/1a.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    paddingTop: '80px'
  };

  return (
    <section className="text-white" style={heroStyle}>
      <Container>
        <Row className="justify-content-start align-items-center">
          <Col lg={6} md={8} className="ps-lg-5 text-start">
            {/* Tagline - Top left */}
            <div className="tagline mb-3">
              <span className="badge bg-warning text-dark fs-6 fw-bold px-3 py-2">
                KENYA'S #1 LAND PLATFORM
              </span>
            </div>

            {/* Main Heading - Left aligned */}
            <h1 className="hero-main-title fw-bold mb-4">
              Connect Land to<br />Opportunity
            </h1>

            {/* Subheading - Left aligned */}
            <div className="hero-subtitle mb-5">
              <p className="mb-2">
                The most trusted platform for agricultural land leasing in Kenya.
              </p>
              <p>
                Empowering farmers and landowners to grow together with secure,
                verified listings.
              </p>
            </div>

            {/* Buttons - Left aligned, horizontal */}
            <div className="hero-buttons d-flex flex-wrap gap-4">
              <Button
                variant="warning"
                size="lg"
                className="px-5 py-3 fw-bold btn-warning-custom"
              >
                List Your Land →
              </Button>

              <Button
                variant="outline-light"
                size="lg"
                className="px-5 py-3 fw-bold"
              >
                Find Land
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;