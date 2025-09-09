import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faStore,
  faUsers,
  faBug,
  faMicrophone,
  faCloudSunRain,
  faMicrophoneAlt,
  faWater,
  faUmbrella,
  faInfoCircle,
  faBell,
  faSnowflake,
  faSmog,
  faSun,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { Navbar } from "../componets/navbar";
import { useReviewStore } from "../stores/useReviewStore";
import { Toaster } from "react-hot-toast";
import { Footer } from "../componets/footer";
import { useLanguage } from "../stores/useLanguage";
import { useSensorStore } from "../stores/useSensorStore.js";


// Translations object (kept from previous implementation)
const translations = {
  // ... (keep existing translations)
};

const getWeatherIcon = (weatherId) => {
  // ... (keep existing icon logic)
};

const Homepage = ({ authUser }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.Eng;

  // Sensor Data State
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
    soil_moisture: "--",
    light: "--",
    rain: "--",
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSensorDataStore } = useSensorStore();

  // Fetch latest sensor data
  const fetchLatestSensorData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://192.168.114.65:8000/data');
      
      if (response.data) {
        setSensorDataStore(response.data);
        setSensorData(response.data);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      setError("Failed to fetch sensor data");
    } finally {
      setIsLoading(false);
    }
  };

  // Weather Data State and Fetching (kept from previous implementation)
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    humidity: 0,
    precipitation: 0,
    windSpeed: 0,
    forecast: [],
  });

  // Existing review and other states
  const { reviews, isSendingReview, getReviews, sendReview } = useReviewStore();
  const [reviewData, setReviewData] = useState({
    stars: 0,
    reviewmsg: "",
  });

  // Effect for fetching sensor data
  useEffect(() => {
    fetchLatestSensorData(); // Initial fetch

    // Poll for new data every 2 seconds
    const interval = setInterval(fetchLatestSensorData, 2000);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // Existing useEffect for other data fetching (reviews, etc.)
  useEffect(() => {
    // Initial fetch for weather data
    // fetchWeatherData(authUser, setWeatherData, setIsLoading, setError);

    // Fetch reviews from API
    getReviews();
  }, [authUser, getReviews]);

  // Rest of the component remains the same, but update temperature display
  return (
    <div className="homepage">
      <Navbar />
      <section className="dashboard-section">
        <div className="dashboard-grid">
          {/* Weather Insights */}
          <div className="dashboard-card weather-insights">
            {/* <h3>{t.weatherInsights}</h3> */}
            <div className="weather-content">
              <div className="weather-main">
                <div className="weather-icon">
                  {isLoading ? (
                    <span>Loading...</span>
                  ) : error ? (
                    <span>Error: {error}</span>
                  ) : (
                    <FontAwesomeIcon
                      icon={
                        weatherData.forecast && weatherData.forecast.length > 0
                          ? weatherData.forecast[0].icon
                          : faCloudSunRain
                      }
                    />
                  )}
                </div>
                <div
                  className="temperature"
                  // style={{ color: setColor(weatherData.temperature) }}
                >
                  <div>{sensorData.temperature}</div>
                  <span>°C</span>
                </div>
              </div>
              <div className="weather-details">
                <div className="weather-detail">
                  <FontAwesomeIcon icon={faWater} />
                  <span>{sensorData.humidity}% Humidity</span>
                </div>
                <div className="weather-detail">
                  <FontAwesomeIcon icon={faUmbrella} />
                  <span>{weatherData.precipitation}% Chance of Rain</span>
                </div>
              </div>
              {/* Rest of the component remains the same */}
            </div>
          </div>

          {/* Smart Irrigation */}
          <div className="dashboard-card irrigation-card">
            {/* <h3>{t.smartIrrigation}</h3> */}
            <div className="irrigation-content">
              <div className="irrigation-gauge">
                <svg className="gauge-svg">
                  <circle
                    className="gauge-background"
                    cx="70"
                    cy="70"
                    r="60"
                  ></circle>
                  <circle
                    className="gauge-progress"
                    cx="70"
                    cy="70"
                    r="60"
                    style={{
                      strokeDasharray: `${(sensorData.soil_moisture / 100) * 377} 377`,
                    }}
                  ></circle>
                </svg>
              </div>
              <div className="irrigation-status">
                {/* <h4>{t.irrigationStatus}</h4> */}
                <div className={`status-indicator ${sensorData.soil_moisture < 30 ? 'off' : 'on'}`}>
                  {sensorData.soil_moisture < 30 ? "OFF" : "ON"}
                </div>
                <p>
                  {sensorData.soil_moisture < 30 
                    ? "Soil is too dry, irrigation needed!" 
                    : "Soil moisture is adequate"}
                </p>
              </div>
            </div>
          </div>

          {/* Existing sections remain the same */}
        </div>
      </section>

      {/* Rest of the component remains unchanged */}
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default Homepage;