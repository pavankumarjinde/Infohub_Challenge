import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function WeatherModule() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const apiKey = '5797db9df8b646b186232107250611'

  // 🔍 Fetch live city suggestions
  const fetchSuggestions = async (input) => {
    setQuery(input)
    if (input.trim().length < 1) {
      setSuggestions([]) // hide if empty
      return
    }
    try {
      const res = await axios.get(`https://api.weatherapi.com/v1/search.json`, {
        params: { key: apiKey, q: input }
      })
      setSuggestions(res.data || [])
    } catch {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (name, country) => {
    const fullName = `${name}, ${country}`
    setQuery(fullName)
    setSuggestions([])
    fetchWeather(fullName)
  }

  // 🌤️ Fetch weather info
  const fetchWeather = async (q = query) => {
    if (!q.trim()) {
      setError('Please enter a city name.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const res = await axios.get(`/api/weather`, { params: { location: q } })
      setData(res.data)
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load weather.')
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch default weather for Hyderabad on load
  useEffect(() => {
    fetchWeather('Hyderabad, India')
  }, [])

  return (
    <div>
      <h2>Weather</h2>

      {/* Search Input + Suggestions */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <input
          className="input"
          value={query}
          onChange={(e) => fetchSuggestions(e.target.value)}
          placeholder="Type a city name (e.g., D)"
          autoComplete="off"
          style={{ width: '100%' }}
        />

        {/* Dropdown Suggestions */}
        {suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            zIndex: 100,
            top: '100%',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            {suggestions.map((city) => (
              <li
                key={`${city.id}-${city.name}`}
                onClick={() => handleSuggestionClick(city.name, city.country)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#1e293b',
                  fontWeight: 500,
                  fontSize: '15px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0e7ff'
                  e.currentTarget.style.color = '#1e3a8a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff'
                  e.currentTarget.style.color = '#1e293b'
                }}
              >
                {city.name}, <span style={{ opacity: 0.7 }}>{city.country}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="button" onClick={() => fetchWeather(query)}>Check</button>

      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {/* Weather Info */}
      {data && !isLoading && !error && (
        <div style={{ textAlign: 'center' }}>
          <div className="label">Location</div>
          <div style={{ fontSize: 22, marginBottom: 6 }}>{data.location}</div>
          <div className="label">Temperature</div>
          <div style={{ fontSize: 22, marginBottom: 6 }}>{data.temperature} °C</div>
          <div className="label">Condition</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>{data.description}</div>
          {data.icon && <img src={data.icon} alt={data.description} />}
        </div>
      )}
    </div>
  )
}
