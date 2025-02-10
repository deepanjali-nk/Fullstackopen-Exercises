import { useState, useEffect } from "react";
import axios from "axios";
import CountryDetails from "./CountryDetails";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setSelectedCountry(null); // Reset selection when typing
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(query.toLowerCase())
  );

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h1>Find Countries</h1>
      <input type="text" value={query} onChange={handleQueryChange} placeholder="Search..." />

      {filteredCountries.length > 10 && <p>Too many matches, please specify another filter.</p>}

      {filteredCountries.length > 1 && filteredCountries.length <= 10 && (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>
              {country.name.common}{" "}
              <button onClick={() => handleShowCountry(country)}>Show</button>
            </li>
          ))}
        </ul>
      )}

      {(filteredCountries.length === 1 || selectedCountry) && (
        <CountryDetails country={selectedCountry || filteredCountries[0]} />
      )}
    </div>
  );
};

export default App;
