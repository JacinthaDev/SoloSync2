import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TripForm = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const navigate = useNavigate();
  const { user_id } = useParams(); 
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    start_date: '',
    end_date: '',
    description: '',
  });
  
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [cityName, setCityName] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (formData.country) {
        try {
          const country = countries.find((c) => c.name === formData.country);
          const response = await fetch(`/api/cities?country_code=${country.alpha2}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setCities(data);
          if (data.length > 0) {
            setCityName(data[0].name); 
            setIsPrefilled(true); 
            setFormData((prevData) => ({ ...prevData, city: data[0].name })); 
          } else {
            setCityName(''); 
            setIsPrefilled(false);
          }
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      }
    };
    fetchCities();
  }, [formData.country, countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, country: value, city: '' }));
    setCities([]);
    setFilteredCities([]);
    setIsPrefilled(false); 
    setCityName(''); 
  };

  const handleCityChange = (e) => {
    if (!isPrefilled || cities.length === 0) {
      setCityName(e.target.value);
      setFormData((prevData) => ({ ...prevData, city: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0]; 
    const { start_date, end_date } = formData;
    if (start_date < today) {
      alert("The start date cannot be in the past.");
      return; 
    }
    if (end_date < start_date) {
      alert("The end date must be later than the start date.");
      return;
    }
    try {
      const response = await fetch(`/api/users/${user_id}/itineraries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to create itinerary');
      }
      const result = await response.json();

      setFormData({
        city: '',
        country: '',
        start_date: '',
        end_date: '',
        description: '',
      });
      setIsPrefilled(false); 
      setCityName(''); 

      navigate(`/api/users/${user_id}/itineraries`);
    } catch (error) {
      console.error('Error creating itinerary:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto p-6 bg-yellow-100 rounded-lg shadow-md max-w-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Create An Itinerary</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Country:</span>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
            placeholder="Type to search for a country..."
            list="countries-list"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
          <datalist id="countries-list">
            {countries.map((country) => (
              <option key={country.alpha2} value={country.name}>
                {country.name}
              </option>
            ))}
          </datalist>
        </label>
        
        {formData.country && (
          <label className="block">
            <span className="text-gray-700">City:</span>
            <input
              type="text"
              name="city"
              value={isPrefilled ? cityName : formData.city}
              onChange={handleCityChange}
              list="cities-list"
              placeholder="Select a city"
              disabled={isPrefilled && cities.length > 0}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <datalist id="cities-list">
              {filteredCities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </datalist>
          </label>
        )}
        
        {formData.city && (
          <>
            <label className="block">
              <span className="text-gray-700">Start Date:</span>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                min={today}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">End Date:</span>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date || today}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </label>
          </>
        )}
        
        {formData.start_date && formData.end_date && (
          <label className="block">
            <span className="text-gray-700">Tell other Syncers why you're traveling:</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a description"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
        )}
        
        <button type="submit" className="w-full bg-blue-400 text-white font-bold p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={() => window.location.reload()}
        > 
          Create Itinerary
        </button>
      </form>
    </div>
  );
};

export default TripForm;
