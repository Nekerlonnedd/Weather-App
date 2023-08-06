import "./styles.css";
import React, { useState, useEffect } from "react";
import SearchBar from "./Searchbar";
import HourlyForecastSetup from "./HourlyForecastSetup"
import Header from "./Header";
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

        <SearchBar
           className="custom-search-bar"
           className1="search-suggestions"
           className2="search-bar-container"
           updateArea={updateArea}
        />

        <Header
        className1={"weather-card__header"}
        className2={"header-name"}
        className3={"weather-card__temperature temp"}
        className4={"weather-card__condition"}
        location={weather.location?.name}
        temperature={weather.current?.temp_f}
        condition={weather.current?.condition?.text} />

       <HourlyForecastSetup
       className1={"hourly-forecast"}
       className2={"fa-solid fa-clock"}
       className3={"hourly"}
       mapForecast={weather.forecast &&
         weather.forecast.forecastday[0].hour.map(forecast)}
       />

    <div className="weather-forecast">
        {weather.forecast &&
          weather.forecast.forecastday
            .filter((day) => !isPreviousDate(day.date))
            .map((day) => (
<div key={day.date} className="container text-center">
  <div className="row ">
    <div className="col-lg-3 col-md-6 col-sm-12"><p className="weather-card__day">
                  {day.date === new Date().toJSON().slice(0, 10)
                    ? "Today"
                    : getWeekdayFromDate(day.date)}
                </p></div>
    <div className="col-lg-3 col-md-6 col-sm-12"><img src={day.day?.condition?.icon} alt="Condition" /></div>
    <div className="col-lg-3 col-md-6 col-sm-12"><p className="weather-card__temperature">
                  {"Low: " + Math.trunc(day.day?.mintemp_f) + "°"}
                </p></div>
    <div className="col-lg-3 col-md-6 col-sm-12"><p className="weather-card__temperature">
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
