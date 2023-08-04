import "./styles.css";
import React, { useState, useEffect } from "react";
import SearchBar from "./Searchbar";
import debounce from "lodash.debounce";
import Hourly from "./Hourly"; // Import the Hourly component here

export default function App() {
  const [weather, setWeather] = useState([]);
  const [gif, setGif] = useState("New York");


  const forecast = (hour) => {
    const currentTime = new Date();
    const forecastTime = new Date(hour.time);

    if (forecastTime >= currentTime) {
      return (
        <Hourly
          key={hour.time}
          className={"insidediv"}
          time={forecastTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          image={hour.condition.icon}
          temperature={hour.temp_f}
        />
      );
    } else {
      return null; // Don't render if the time is in the past
    }
  };


  useEffect(() => {
    // Debounce the fetchWeatherData function to avoid multiple API calls in quick succession
    const debouncedFetchWeatherData = debounce(fetchWeatherData, 500);

    debouncedFetchWeatherData(gif);

    return () => {
      // Cleanup function to cancel any pending debounced calls
      debouncedFetchWeatherData.cancel();
    };
  }, [gif]);

  const fetchWeatherData = (searchTerm) => {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=bba7508009844dc8bfb115610233007&q=${searchTerm}&days=10&aqi=yes&alerts=yes`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((json) => setWeather(json))
      .catch((error) => {
        // Handle the error here, e.g., log it or show a message to the user.
        console.error("Error fetching weather data:", error);
        // You can also set the weather state to null or a default value in case of an error.
        // setWeather(null);
      });
  };

  const getWeekdayFromDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long" }; // "long" gives the full weekday name
    console.log(options)
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const isPreviousDate = (dateString) => {
    const currentDate = new Date().toLocaleDateString();
    return new Date(dateString) < new Date(currentDate);
  };

  const updateArea = (newArea) => {
    setGif(newArea);
  };


  return (
    <div className="containers">
    <div className="weather-card">
    <div className="search-bar-container"> {/* Add this container */}
        <SearchBar
           className="custom-search-bar"
           className1="search-suggestions"
           updateArea={updateArea}
        />
        </div>
      <div className="weather-card__header">
        <h1 className="header-name">{weather.location?.name}</h1>
        <h1 className="weather-card__temperature temp">
          {Math.trunc(weather.current?.temp_f) + "°"}
        </h1>
        <h1 className="weather-card__condition">
          {weather.current?.condition?.text}
        </h1>
      </div>

      <div className="hourly-forecast">
        <p><i class="fa-solid fa-clock"></i> HOURLY FORECAST</p>
        <div className="hourly">
      {weather.forecast &&
        weather.forecast.forecastday[0].hour.map(forecast)}
    </div>
    </div>



    <div className="weather-forecast">
        {weather.forecast &&
          weather.forecast.forecastday
            .filter((day) => !isPreviousDate(day.date))
            .map((day) => (


<div key={day.date} class="container text-center">
  <div class="row ">
    <div class="col-lg-3 col-md-6 col-sm-12"><p className="weather-card__day">
                  {day.date === new Date().toJSON().slice(0, 10)
                    ? "Today"
                    : getWeekdayFromDate(day.date)}
                </p></div>
    <div class="col-lg-3 col-md-6 col-sm-12"><img src={day.day?.condition?.icon} alt="Condition" /></div>
    <div class="col-lg-3 col-md-6 col-sm-12"><p className="weather-card__temperature">
                  {"Low: " + Math.trunc(day.day?.mintemp_f) + "°"}
                </p></div>
    <div class="col-lg-3 col-md-6 col-sm-12"><p className="weather-card__temperature">
                  {"High: " +Math.trunc(day.day?.maxtemp_f) + "°"}
                </p></div>
  </div>
</div>

            ))}
      </div>



    </div>
    </div>
  );
}
