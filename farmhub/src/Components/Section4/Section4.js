import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import './Section4.css'

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Create Your Profile",
      description: "Join as a farmer looking for land or a landowner with space. It takes less than 2 minutes."
    },
    {
      number: "2",
      title: "Discover or List",
      description: "Browse thousands of acres across Kenya or showcase your land to our growing community of active farmers."
    },
    {
      number: "3",
      title: "Sign Agreement",
      description: "Finalize terms and sign legally binding digital agreements within the platform. Start planting!"
    }
  ];

  return (
    <Container className="py-5">
      <Row className="align-items-center">
        {/* Left Column - Steps */}
        <Col lg={6} className="mb-4 mb-lg-0">
          <h2 className="fw-bold mb-4">
            Ready to start? <span className="text-success">It's simpler than you think.</span>
          </h2>

          <div className="steps-container">
            {steps.map((step, index) => (
              <Card key={index} className="border-0 shadow-sm mb-3 step-card">
                <Card.Body className="d-flex align-items-start p-4">
                  {/* Step Number Circle */}
                  <div className="step-number-circle me-4">
                    <span className="step-number">{step.number}</span>
                  </div>

                  {/* Step Content */}
                  <div>
                    <h5 className="fw-bold mb-2">{step.title}</h5>
                    <p className="text-muted mb-0">{step.description}</p>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>

        {/* Right Column - Image */}
      <Col lg={6}>
  <div className="image-section">
    <img
      src="/images/1a.jpg"  // Change this to your image path
      alt="Farmer using FarmHub app on tablet in field"
      className="img-fluid rounded shadow-lg"
      style={{
        border: '8px solid white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}
    />
  </div>
</Col>
      </Row>
    </Container>
  );
};

export default HowItWorks;