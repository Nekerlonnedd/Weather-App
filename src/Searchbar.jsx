import React, { useState } from "react";
import debounce from "lodash.debounce";

const SearchBar = (props) => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Function to fetch search suggestions based on user input
  const fetchSuggestions = async (input) => {
    // Replace the API_KEY with your actual WeatherAPI key
    const API_KEY = "bba7508009844dc8bfb115610233007";
    const API_URL = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${input}`;
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSuggestions(data.map((item) => item.name)); // Extracting names as suggestions
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]); // Clear suggestions in case of an error
    }
  };

  // Debounce the fetchSuggestions function to avoid multiple API calls on each keystroke
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Function to handle user input change
  const handleInputChange = (event) => {
    const input = event.target.value;
    setSearchInput(input);
    debouncedFetchSuggestions(input);
  };

  // Function to send area value to the parent component
  const sendValue = (event) => {
    const selectedArea = event.target.innerText;
    props.updateArea(selectedArea); // Update the area state in the parent component
    setSearchInput("")
    setSuggestions([])
  };

  return (

    <div className={props.className2}>
    <div className={props.className}>
      <input
        type="text"
        value={searchInput}
        onChange={handleInputChange}
        placeholder="Search for a city or country"
      />
      {suggestions.length > 0 && (
        <div className={props.className1}>
          <ul >
            {suggestions.map((suggestion, index) => (
              <button onClick={sendValue} key={index}>
                {suggestion}
              </button>
            ))}
          </ul>
       </div>
      )}
    </div>
    </div>
  );
};

export default SearchBar;
