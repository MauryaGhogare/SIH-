import React from "react";
import { Link } from "react-router-dom";
import { Sprout, Shield, Users, ArrowRight, CloudRain, BarChart, Award } from "lucide-react";
import "../Styles/LandingPage.css";
import { Toaster } from "react-hot-toast";

const LandingPage = () => {
  const FeatureCard = ({ Icon, title, description }) => (
    <div className="feature-card">
      <div className="feature-icon-container">
        <Icon className="feature-icon" />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
  
  // Data for features
  const featuresData = [
    {
      icon: Sprout,
      title: "Smart Crop Monitoring",
      description: "Real-time monitoring of crop health and growth with AI-powered insights and recommendations."
    },
    {
      icon: Shield,
      title: "Disease Prevention",
      description: "Early detection of crop diseases and pest infestations using computer vision and predictive analytics."
    },
    {
      icon: CloudRain,
      title: "Weather Intelligence",
      description: "Hyperlocal weather forecasts and irrigation recommendations tailored to your specific fields."
    },
    {
      icon: Users,
      title: "Farmer Community",
      description: "Connect with other farmers and agricultural experts for guidance, support, and knowledge sharing."
    },
    {
      icon: BarChart,
      title: "Yield Analytics",
      description: "Track performance across seasons with advanced analytics to optimize planting and harvest schedules."
    },
    {
      icon: Award,
      title: "Sustainability Metrics",
      description: "Monitor your farm's environmental impact and improve sustainable farming practices."
    }
  ];
  
  // Data for testimonials
  const testimonialData = [
    {
      text: "FarmConnect has revolutionized how I manage my crops. The disease detection feature saved my entire harvest last season.",
      name: "James Wilson",
      farm: "Wilson Family Farms"
    },
    {
      text: "The weather forecasting is incredibly accurate. I've reduced water usage by 30% while improving my yields.",
      name: "Maria Rodriguez",
      farm: "Green Valley Organics"
    }
  ];
  
  // Data for steps
  const stepsData = [
    {
      title: "Set Up Your Farm Profile",
      description: "Create your account and input your farm details, crop types, and field boundaries."
    },
    {
      title: "Connect Smart Sensors",
      description: "Install our simple plug-and-play sensors or connect existing equipment to start gathering data."
    },
    {
      title: "Get Actionable Insights",
      description: "Receive real-time recommendations and alerts to optimize your farming operations."
    }
  ];
  
  // Social links
  const socialLinks = [
    { name: "Facebook", abbr: "FB", link: "#" },
    { name: "Twitter", abbr: "TW", link: "#" },
    { name: "Instagram", abbr: "IG", link: "#" },
    { name: "LinkedIn", abbr: "LI", link: "#" }
  ];
  
  // Footer links
  const footerLinks = [
    {
      heading: "Product",
      links: [
        { text: "Features", url: "/features" },
        { text: "Integrations", url: "/integrations" },
        { text: "Updates", url: "/updates" }
      ]
    },
    {
      heading: "Company",
      links: [
        { text: "About", url: "/about" },
        { text: "Team", url: "/team" },
        { text: "Careers", url: "/careers" },
        { text: "Contact", url: "/contact" }
      ]
    },
    {
      heading: "Resources",
      links: [
        { text: "Guides", url: "/guides" },
        { text: "Help Center", url: "/help" },
        { text: "Community", url: "/community" }
      ]
    }
  ];
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <Sprout className="logo-icon" />
              <span className="logo-text-header">FarmConnect</span>
            </div>
            <div className="nav-links">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="badge">
                <Sprout size={14} />
                <span>Agritech Solution</span>
              </div>
              <h1 className="hero-title">
                Smart Farming for a <span className="highlight">Better Tomorrow</span>
              </h1>
              <p className="hero-description">
                Join thousands of farmers using technology to improve yields, prevent crop diseases, and make data-driven decisions for sustainable agriculture.
              </p>
              <div className="hero-buttons">
                <Link to="/signup" className="get-started-btn">
                  Get Started Free <ArrowRight className="btn-icon" />
                </Link>
              </div>
            </div>
            <div className="hero-image-container"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose FarmConnect?</h2>
          <p className="section-description">Everything you need to manage your farm efficiently and sustainably</p>
          <div className="features-grid">
            {featuresData.map((feature, index) => (
              <FeatureCard 
                key={index}
                Icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="container">
          <h2 className="section-title">What Farmers Are Saying</h2>
          <div className="testimonials-grid">
            {testimonialData.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <img 
                    src="/api/placeholder/64/64" 
                    alt={testimonial.name} 
                    className="testimonial-avatar"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-farm">{testimonial.farm}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How FarmConnect Works</h2>
          <p className="section-description">Get started in three simple steps</p>
          
          <div className="steps-container">
            {stepsData.map((step, index) => (
              <div className="step-card" key={index}>
                <div className="step-number">{index + 1}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Transform Your Farming?</h2>
          <p className="cta-description">
            Thousands of farmers already using FarmConnect to improve yields and make data-driven decisions.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-btn">
              Get Started Now <ArrowRight className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <Sprout className="logo-icon" />
                <span className="logo-text">FarmConnect</span>
              </div>
              <p className="footer-tagline">
                Empowering farmers with smart technology for sustainable agriculture
              </p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a href={social.link} className="social-link" aria-label={social.name} key={index}>
                    <span>{social.abbr}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {footerLinks.map((section, index) => (
              <div className="footer-links" key={index}>
                <h4 className="footer-heading">{section.heading}</h4>
                <ul className="footer-menu">
                  {section.links.map((link, i) => (
                    <li key={i}><Link to={link.url}>{link.text}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">© {new Date().getFullYear()} FarmConnect. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};

export default LandingPage;