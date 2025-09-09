import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Styles/SensorPage.css'; // Separate CSS file
import { useSensorStore } from "../stores/useSensorStore.js";

export const SensorPage = () => {
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

  const {setSensorDataStore}=useSensorStore();
  // Fetch latest sensor data
  const fetchLatestData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://192.168.114.65:8000/data');
      setSensorDataStore(response);
      if (response.data) {
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

  useEffect(() => {
    fetchLatestData(); // Initial fetch
    // Poll for new data every 5 seconds
    const interval = setInterval(fetchLatestData, 2000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="sensor-dashboard-container">
      <div className="sensor-dashboard-card">
        <h2 className="sensor-dashboard-title">Sensor Dashboard</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="sensor-data-list">
            {[
              { label: "Temperature", value: sensorData.temperature, unit: "°C" },
              { label: "Humidity", value: sensorData.humidity, unit: "%" },
              { label: "Soil Moisture", value: sensorData.soil_moisture, unit: "%" },
              { label: "Light", value: sensorData.light, unit: "" },
              { label: "Rain", value: sensorData.rain, unit: "" },
            ].map(({ label, value, unit }) => (
              <div 
                key={label} 
                className="sensor-data-item"
              >
                <span className="sensor-label">{label}</span>
                <span className="sensor-value">
                  {value} {unit}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="last-updated">
          <span>Last updated:</span>
          <span className="last-updated-time">
            {lastUpdated.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};