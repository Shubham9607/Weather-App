import React, { useState } from "react";
import { FiSun, FiCloud, FiCloudRain, FiAlertTriangle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const API_KEY = "3850ba829f15595f2097576f95f03da6";

  const fetchWeather = async () => {
    if (city) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    fetchWeather();
  };

  const handleTempToggle = () => {
    setIsCelsius(!isCelsius);
  };

  const getWeatherIcon = (description) => {
    switch (description) {
      case "clear sky":
        return <FiSun className="text-yellow-500" size={60} />;
      case "few clouds":
      case "scattered clouds":
      case "broken clouds":
        return <FiCloud className="text-gray-500" size={60} />;
      case "rain":
      case "shower rain":
      case "thunderstorm":
        return <FiCloudRain className="text-blue-400" size={60} />;
      default:
        return <FiSun size={60} />;
    }
  };

  return (
    <div className="flex flex-col items-center bg-blue-500 p-20 rounded-3xl shadow-lg text-white max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-10 ">Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 rounded mb-10 w-full text-black "
      />
      <button
        onClick={handleSearch}
        className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition"
      >
        {loading ? <FaSpinner className="animate-spin" /> : "Get Weather"}
      </button>

      {error && (
        <div className="mt-6 text-red-600 flex items-center">
          <FiAlertTriangle size={24} className="mr-2" />
          {error}
        </div>
      )}

      {weather && weather.sys && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold">
            {weather.name}, {weather.sys?.country}
          </h2>
          {getWeatherIcon(weather.weather[0]?.description)}
          <p className="text-lg mt-2">
            {weather.weather[0]?.description
              .charAt(0)
              .toUpperCase() + weather.weather[0]?.description.slice(1)}
          </p>
          <p className="text-3xl font-bold">
            {isCelsius
              ? `${Math.round(weather.main?.temp)}°C`
              : `${Math.round((weather.main?.temp * 9) / 5 + 32)}°F`}
          </p>
          <div className="flex justify-between mt-4 text-sm">
            <span>Humidity: {weather.main?.humidity}%</span>
            <span>Wind: {Math.round(weather.wind?.speed)} m/s</span>
          </div>
          <button
            onClick={handleTempToggle}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Switch to {isCelsius ? "°F" : "°C"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Weather;
