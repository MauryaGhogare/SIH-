import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faUserCircle, faTachometerAlt, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { useLanguage } from "../stores/useLanguage";
import { useBidStore } from "../stores/useBidStore";
import NotificationSystem from "../components/community/NotificationSystem";

const translations = {
  Eng: {
    appName: "360° Agri",
    navLinks: {
      home: "Home",
      marketplace: "Marketplace",
      community: "Community",
      loans: "Loans",
      weatherIrrigation: "Weather & Irrigation",
      pestDiseaseScan: "Pest & Disease Scan",
      governmentSchemes: "Government Schemes"
    }
  },
  Mar: {
    appName: "३६०° शेती",
    navLinks: {
      home: "मुख्यपृष्ठ",
      marketplace: "बाजारपेठ",
      community: "समुदाय",
      loans: "कर्ज",
      weatherIrrigation: "हवामान आणि सिंचन",
      pestDiseaseScan: "किडा आणि रोग स्कॅन",
      governmentSchemes: "सरकारी योजना"
    }
  },
  Hin: {
    appName: "३६०° कृषि",
    navLinks: {
      home: "होम",
      marketplace: "मार्केटप्लेस",
      community: "समुदाय",
      loans: "ऋण",
      weatherIrrigation: "मौसम और सिंचाई",
      pestDiseaseScan: "कीट और रोग स्कैन",
      governmentSchemes: "सरकारी योजनाएं"
    }
  }
};

export const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const { shortlisted } = useBidStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const t = translations[language] || translations.Eng;

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to={"/"} className="logo">
          <FontAwesomeIcon icon={faLeaf} />
          <span>{t.appName}</span>
        </Link>
      </div>
      <div className="nav-center">
        <ul className="nav-links">
          <li>
            <Link to="/" className="Home">
              {t.navLinks.home}
            </Link>
          </li>
          <li>
            <Link to="/marketplace" className="Marketplace">
              {t.navLinks.marketplace}
            </Link>
          </li>
          <li>
            <Link to="/community" className="Community">
              {t.navLinks.community}
            </Link>
          </li>
          <li>
            <Link to="/loans" className="Loans">
              {t.navLinks.loans}
            </Link>
          </li>
          <li>
            <Link to="/weather" className="Weather-Irrigation">
              {t.navLinks.weatherIrrigation}
            </Link>
          </li>
          <li>
            <Link to="/pest-scan" className="Pest-Disease-Scan">
              {t.navLinks.pestDiseaseScan}
            </Link>
          </li>
          <li>
            <Link to="/schemes" className="Government-Schemes">
              {t.navLinks.governmentSchemes}
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav-right">
        <div className="language-selector">
          <select value={language} onChange={handleLanguageChange}>
            <option value="Eng">English</option>
            <option value="Mar">मराठी</option>
            <option value="Hin">हिन्दी</option>
          </select>
        </div>
        <NotificationSystem />
        <Link to={"/dashboard"} className="dashboard-link" style={{ position: 'relative' }}>
          <FontAwesomeIcon icon={faTachometerAlt} />
          <span className="bid-count">{shortlisted.length}</span>
        </Link>
        <div className="profile-dropdown" onMouseLeave={() => setShowProfileMenu(false)}>
          <button className="user-profile" onClick={() => setShowProfileMenu(v => !v)}>
            <FontAwesomeIcon icon={faUserCircle} />
            <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: 6, fontSize: 12 }} />
          </button>
          {showProfileMenu && (
            <div className="profile-menu">
              <Link to="/profile">Profile</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/logout">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};