import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faTwitter,
    faInstagram,
    faYoutube,
  } from "@fortawesome/free-brands-svg-icons";
export const Footer = () => {
  return (
    <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Marketplace</a>
              </li>
              <li>
                <a href="#">Community</a>
              </li>
              <li>
                <a href="#">Weather & Irrigation</a>
              </li>
              <li>
                <a href="#">Pest & Disease Scan</a>
              </li>
              <li>
                <a href="#">Government Schemes</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact & Support</h4>
            <ul>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">WhatsApp Support</a>
              </li>
              <li>
                <a href="#">Email: support@360agri.com</a>
              </li>
              <li>
                <a href="#">Call: 1234-5678-90</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="#">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>
        </div>
        <div className="Homepage-footer-bottom">
          <p>&copy; {new Date().getFullYear()} 360° Agri Platform. All rights reserved.</p>
        </div>
      </footer>
  )
}
