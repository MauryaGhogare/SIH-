import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import {SensorPage} from "./sensorPage.jsx";
import { useLanguage } from "../stores/useLanguage";
import { useSensorStore } from "../stores/useSensorStore.js";
import axios from "axios";
// Translations object
const translations = {
  Eng: {
    weatherInsights: "WEATHER INSIGHTS",
    smartIrrigation: "SMART IRRIGATION",
    soilPhLevel: "SOIL PH LEVEL",
    uploadLitmusPaper: "Upload Litmus Paper Image",
    cropSpecificPhGuide: "Crop-specific pH Guide",
    ourFeatures: "Our Features",
    irrigationStatus:"IRRIGATION STATUS",
    features: [
      {
        icon: faChartLine,
        title: "Yield Prediction & Smart Recommendations",
        description:
          "Get AI-powered yield predictions and discover the best crops for your land based on soil conditions and climate.",
        ctaText: "Analyze My Land",
      },
      {
        icon: faStore,
        title: "Farmer-to-Consumer Marketplace",
        description:
          "Sell your produce directly to consumers without middlemen. Get better prices and connect with buyers.",
        ctaText: "Explore Marketplace",
      },
      {
        icon: faUsers,
        title: "Community & Farmer Network",
        description:
          "Join discussions with fellow farmers. Share knowledge, ask questions, and learn from experienced agriculturists.",
        ctaText: "Join the Community",
      },
      {
        icon: faBug,
        title: "Pest & Disease Detection",
        description:
          "Upload images of your crops to instantly identify pests and diseases. Get treatment recommendations.",
        ctaText: "Scan My Crop",
      },
      {
        icon: faMicrophoneAlt,
        title: "Multilingual Voice & Chat Support",
        description:
          "Ask questions in your language using voice or text. Get instant answers to all your farming queries.",
        ctaText: "Talk to AI",
      },
      {
        icon: faCloudSunRain,
        title: "Smart Irrigation, Fertilizer & Weather Insights",
        description:
          "Monitor soil moisture, get fertilizer recommendations, and stay updated with real-time weather forecasts.",
        ctaText: "Monitor My Farm",
      },
    ],
    reviewSection: {
      title: "Customer Reviews",
      totalReviews: "Total Reviews",
      averageRating: "Average Rating",
      shareExperience: "Share Your Experience",
      rating: "Rating:",
      yourReview: "Your Review:",
      submitReview: "Submit Review",
      submitting: "Submitting...",
      noReviews: "No reviews yet. Be the first to share your experience!",
    },
  },
  Mar: {
    weatherInsights: "हवामान माहिती",
    smartIrrigation: "स्मार्ट सिंचन",
    soilPhLevel: "माती पीएच पातळी",
    uploadLitmusPaper: "लिटमस पेपर प्रतिमा अपलोड करा",
    cropSpecificPhGuide: "पीक-विशिष्ट पीएच मार्गदर्शक",
    ourFeatures: "आमच्या वैशिष्ट्ये",
    irrigationStatus:"सिंचन स्थिती",
    features: [
      {
        icon: faChartLine,
        title: "उत्पन्न अंदाज आणि स्मार्ट शिफारशी",
        description:
          "AI-द्वारे उत्पन्न अंदाज घ्या आणि माती आणि हवामानावर आधारित आपल्या जमिनीसाठी सर्वोत्तम पीक शोधा.",
        ctaText: "माझी जमीन विश्लेषित करा",
      },
      {
        icon: faStore,
        title: "शेतकरी ते ग्राहक बाजारपेठ",
        description:
          "मध्यस्थांशिवाय थेट ग्राहकांना आपला माल विकाल. चांगले दर मिळवा आणि खरेदीदारांशी संपर्क साधा.",
        ctaText: "बाजारपेठ तपासा",
      },
      {
        icon: faUsers,
        title: "समुदाय आणि शेतकरी नेटवर्क",
        description:
          "इतर शेतकऱ्यांशी चर्चा करा. ज्ञान शेरा, प्रश्न विचारा आणि अनुभवी शेतकऱ्यांकडून शिका.",
        ctaText: "समुदायात सामील व्हा",
      },
      {
        icon: faBug,
        title: "किटक आणि रोग शोधन",
        description:
          "आपल्या पिकांच्या प्रतिमा अपलोड करा आणि लगेच किटक आणि रोग ओळखा. उपचार शिफारशी मिळवा.",
        ctaText: "माझे पीक स्कॅन करा",
      },
      {
        icon: faMicrophoneAlt,
        title: "बहुभाषिक व्हॉइस आणि चॅट सपोर्ट",
        description:
          "आपल्या भाषेत व्हॉइस किंवा टेक्स्ट द्वारे प्रश्न विचारा. शेती संबंधित सर्व क्वेरींची लगेच उत्तरे मिळवा.",
        ctaText: "AI शी बोला",
      },
      {
        icon: faCloudSunRain,
        title: "स्मार्ट सिंचन, खत आणि हवामान अंतर्दृष्टी",
        description:
          "माती ओलावा मॉनिटर करा, खत शिफारशी घ्या आणि रीयल-टाइम हवामान पूर्वानुमान अपडेट्स मिळवा.",
        ctaText: "माझे शेत मॉनिटर करा",
      },
    ],
    reviewSection: {
      title: "ग्राहक समीक्षा",
      totalReviews: "एकूण समीक्षा",
      averageRating: "सरासरी रेटिंग",
      shareExperience: "आपला अनुभव शेरा",
      rating: "रेटिंग:",
      yourReview: "आपली समीक्षा:",
      submitReview: "समीक्षा पाठवा",
      submitting: "सबमिट करत आहे...",
      noReviews: "अजून कोणतीही समीक्षा नाही. आपला अनुभव प्रथम शेरा!",
    },
  },
};

const getWeatherIcon = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return faCloudSunRain; // Thunderstorm
  if (weatherId >= 300 && weatherId < 500) return faCloudSunRain; // Drizzle
  if (weatherId >= 500 && weatherId < 600) return faUmbrella; // Rain
  if (weatherId >= 600 && weatherId < 700) return faSnowflake; // Snow
  if (weatherId >= 700 && weatherId < 800) return faSmog; // Atmosphere
  if (weatherId === 800) return faSun; // Clear
  return faCloud; // Clouds
};

// Function to get day name from timestamp
const getDayName = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const API_KEY = "e5ef05c6820508453e04a11b7702f570";

const fetchWeatherData = async (
  authUser,
  setWeatherData,
  setIsLoading,
  setError
) => {
  try {
    setIsLoading(true);

    const location =
      authUser?.district && authUser?.state
        ? `${authUser.district}, ${authUser.state}`
        : "Delhi, India"; // Default location

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        location
      )}&units=metric&appid=${API_KEY}`
    );

    if (!forecastResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const forecastData = await forecastResponse.json();
    const currentWeatherItem = forecastData.list[0];

    const current = {
      temperature: Math.round(currentWeatherItem.main.temp),
      humidity: currentWeatherItem.main.humidity,
      precipitation: currentWeatherItem.pop
        ? Math.round(currentWeatherItem.pop * 100)
        : 0,
      windSpeed: Math.round(currentWeatherItem.wind.speed),
      icon: getWeatherIcon(currentWeatherItem.weather[0].id),
    };

    const dailyForecasts = [];
    const today = new Date().getDate();
    const processedDays = new Set();

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.getDate();
      if (day === today) return;

      if (!processedDays.has(day)) {
        processedDays.add(day);
        dailyForecasts.push({
          day: getDayName(item.dt),
          icon: getWeatherIcon(item.weather[0].id),
          temp: Math.round(item.main.temp),
        });
      }
    });

    const forecasts = dailyForecasts.slice(0, 4);
    forecasts.unshift({
      day: "Today",
      icon: current.icon,
      temp: current.temperature,
    });

    setWeatherData({
      temperature: current.temperature,
      humidity: current.humidity,
      precipitation: current.precipitation,
      windSpeed: current.windSpeed,
      forecast: forecasts,
    });

    setIsLoading(false);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    setError(err.message);
    setIsLoading(false);
  }
};

const Homepage = ({ authUser }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.Eng;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    humidity: 0,
    precipitation: 0,
    windSpeed: 0,
    forecast: [],
  });

  const [soilData, setSoilData] = useState({
    moisture: 77,
    phLevel: 9,
    status: "off",
  });

  const intervalRef = useRef(null);

  // Get review data and functions from the store
  const { reviews, isSendingReview, getReviews, sendReview } = useReviewStore();
  const [reviewData, setReviewData] = useState({
    stars: 0,
    reviewmsg: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    // Initial fetch for weather data
    fetchWeatherData(authUser, setWeatherData, setIsLoading, setError);

    // Fetch reviews from API
    getReviews();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [authUser, getReviews]);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [phLevel, setPhLevel] = useState("N/A");
  const [phStatus, setPhStatus] = useState("Unknown");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      processImage(file);
    }
  };
  const processImage = (file) => {
    // Simulated pH processing logic
    setTimeout(() => {
      // Random pH level between 4.5 and 8.5
      const randomPh = (Math.random() * 4 + 4.5).toFixed(1);
      setPhLevel(randomPh);

      // Set pH status based on value
      if (randomPh < 6.0) {
        setPhStatus("Acidic");
      } else if (randomPh > 7.5) {
        setPhStatus("Alkaline");
      } else {
        setPhStatus("Neutral");
      }
    }, 1000);
  };

  const setColor = (temp) => {
    return temp > 35 ? "#e13019" : "black";
  };

  // Review handling functions
  const handleStarClick = (rating) => {
    setReviewData((prev) => ({
      ...prev,
      stars: rating,
    }));
  };

  const handleStarHover = (rating) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewData.stars) {
      return;
    }

    await sendReview(reviewData);
    setReviewData({ stars: 0, reviewmsg: "" });
  };

  const getAverageRating = () => {
    if (!reviews || reviews.length === 0) return "N/A";
    const sum = reviews.reduce((acc, review) => acc + review.reviewstar, 0);
    return (sum / reviews.length).toFixed(1);
  };



  /////////////////////////////////////////////////////
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
    soil_moisture: "--",
    light: "--",
    rain: "--",
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { setSensorDataStore } = useSensorStore();
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
  fetchLatestSensorData
  // const interval = setInterval(fetchLatestSensorData, 2000);

  useEffect(() => {
    getReviews();
  }, [authUser, getReviews]);
  
  return (
    <div className="homepage">
      <Navbar />
      {/* <SensorPage /> */}
      <section className="dashboard-section">
        <div className="dashboard-grid">
          {/* Weather Insights */}
          <div className="dashboard-card weather-insights">
            <h3>{t.weatherInsights}</h3>
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
                  style={{ color: setColor(weatherData.temperature) }}
                >
                  {/* <div>{data.temperature}</div> */}
                  <span>{sensorData.temperature}°C</span>
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
              {weatherData.forecast && weatherData.forecast.length > 0 && (
                <div className="weather-forecast">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="forecast-day">
                      <div className="day-name">{day.day}</div>
                      <FontAwesomeIcon icon={day.icon} />
                      <div className="day-temp">{day.temp}°C</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Smart Irrigation */}
          <div className="dashboard-card irrigation-card">
            <h3>{t.smartIrrigation}</h3>
            <div className="irrigation-content">
              <div className="irrigation-gauge">
                <div className="gauge-circle">
                  <div className="gauge-value">{sensorData.soil_moisture}%</div>
                </div>
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
                <h4>{t.irrigationStatus}</h4>
                <div className={`status-indicator ${sensorData.soil_moisture < 30 ? 'On' : 'Off'}`}>{sensorData.soil_moisture < 30 ? "On" : "Off"}
                </div>
                <p>
                  {sensorData.soil_moisture < 30 
                    ? "Soil is too dry, irrigation needed!" 
                    : "Soil moisture is adequate"}
                </p>
              </div>
            </div>
          </div>

          {/* Soil PH Level */}
          <div className="dashboard-card soil-ph-card">
            <h3>{t.soilPhLevel}</h3>
            <div className="soil-content">
              {uploadedImage ? (
                <>
                <div>
                  <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Litmus Test"
                    className="ph-image"
                  />
                  <div className="ph-value">{phLevel}</div>
                </div>
                  <div className="ph-status">
                    <div className="status-label">{phStatus}</div>
                  </div>
                </>
              ) : (
                <div className="upload-section">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <p>{t.uploadLitmusPaper}</p>
                </div>
              )}
              <div className="ph-guide">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>{t.cropSpecificPhGuide}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="Homepage-feature-card">
        <h2>{t.ourFeatures}</h2>
        <div className="features-grid">
          {t.features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button
                className="cta-button"
                onClick={() => {
                  if (
                    feature.title === "Farmer-to-Consumer Marketplace" ||
                    feature.title === "शेतकरी ते ग्राहक बाजारपेठ"
                  ) {
                    navigate("/marketplace");
                  } else if (
                    feature.title === "Community & Farmer Network" ||
                    feature.title === "समुदाय आणि शेतकरी नेटवर्क"
                  ) {
                    navigate("/community");
                  }
                }}
              >
                {feature.ctaText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Review Dashboard Section */}
      <section className="review-dashboard-section">
        <div className="review-dashboard-container">
          <div className="review-dashboard-header">
            <h2>{t.reviewSection.title}</h2>
            <div className="review-stats">
              <div className="review-stat-card">
                <h3>{t.reviewSection.totalReviews}</h3>
                <p className="stat-number">{reviews?.length || 0}</p>
              </div>
              <div className="review-stat-card">
                <h3>{t.reviewSection.averageRating}</h3>
                <p className="stat-number">{getAverageRating()}</p>
                <div className="average-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${parseFloat(getAverageRating()) >= star ? 'filled' : 'empty'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="review-dashboard-content">
            <div className="review-form-container">
              <h3>{t.reviewSection.shareExperience}</h3>
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="rating-selector">
                  <label>{t.reviewSection.rating}</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`star ${(hoveredStar || reviewData.stars) >= star ? 'filled' : 'empty'}`}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={handleStarLeave}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="review-text">
                  <label>{t.reviewSection.yourReview}</label>
                  <textarea
                    name="reviewmsg"
                    value={reviewData.reviewmsg}
                    onChange={handleReviewChange}
                    required
                    placeholder="Tell us about your experience..."
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSendingReview || !reviewData.stars}
                >
                  {isSendingReview
                    ? t.reviewSection.submitting
                    : t.reviewSection.submitReview}
                </button>
              </form>
            </div>

            <div className="reviews-list">
              <div className="reviews-grid">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <span className="reviewer-name">{review.name}</span>
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star ${i < review.reviewstar ? 'filled' : 'empty'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="review-content">{review.reviewmsg}</p>
                      <div className="review-footer">
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-reviews-message">
                    <p>{t.reviewSection.noReviews}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="quick-access">
        <button>
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      </div>

      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default Homepage;
