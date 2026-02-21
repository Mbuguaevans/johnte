import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Section3.css';

const LandingFeatures = () => {
  const stats = [
    { value: "15k+", label: "verified acres" },
    { value: "2,500+", label: "Active Farmers" },
    { value: "47", label: "Counties Covered" },
    { value: "KES 50M", label: "Lease Value Secured" }
  ];

  const features = [
    {
      icon: "🤝",
      title: "Direct Leasing",
      description: "Connect directly with landowners or farmers, no middlemen involved. No hidden fees, just pure agricultural partnership."
    },
    {
      icon: "✅",
      title: "Verified Listings",
      description: "Every farm listing undergoes a KYC verification process including title deed checks and soil health assessments."
    },
    {
      icon: "💰",
      title: "Secure Payments",
      description: "Integrated escrow payments ensure that funds are only released once lease milestones are met. Your investment is protected."
    }
  ];

  return (
    <div id="features">
      <Container fluid className="magic-pink-bg py-5 mt-0">  
        <Container>
          {/* Stats Section */}
          <Row className="text-center mb-5 g-4">
            {stats.map((stat, index) => (
              <Col key={index} lg={3} md={6} sm={6}>
                <Card className="stat-card border-0 shadow-sm h-100 py-3 bg-white">
                  <Card.Body>
                    <h2 className="text-success fw-bold">{stat.value}</h2>
                    <p className="text-muted text-uppercase small">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Divider */}
          <hr className="my-5" />

          {/* Why Choose Section */}
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold mb-3">Why Choose FarmHub?</h2>
              <p className="lead text-dark">
                We provide a secure, transparent, and seamless platform built specifically for the Kenyan agricultural landscape.
              </p>
            </Col>
          </Row>

          {/* Features Grid */}
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} lg={4} md={6}>
                <Card className="feature-card border-0 shadow-sm h-100 bg-white">
                  <Card.Body className="text-center p-4">
                    <div className="feature-icon mb-3 fs-1">{feature.icon}</div>
                    <Card.Title className="fw-bold mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default LandingFeatures;