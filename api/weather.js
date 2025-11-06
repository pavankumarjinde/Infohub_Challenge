// Weather (using WeatherAPI.com)
app.get('/api/weather', async (req, res) => {
  try {
    const { location = '' } = req.query;

    if (!location.trim()) {
      return res.status(400).json({ error: 'Please enter a city name.' });
    }

    // ✅ Your WeatherAPI key
    const apiKey = '5797db9df8b646b186232107250611';

    // Call WeatherAPI
    const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: { key: apiKey, q: location }
    });

    const data = response.data;

    // Send simplified JSON
    res.status(200).json({
      location: `${data.location.name}, ${data.location.country}`,
      temperature: data.current.temp_c,
      description: data.current.condition.text,
      icon: data.current.condition.icon
    });
  } catch (err) {
    console.error('Weather API error:', err.response?.data || err.message);

    if (err.response?.data?.error?.message) {
      return res.status(404).json({ error: err.response.data.error.message });
    }

    res.status(500).json({ error: 'Could not fetch weather data. Please try again.' });
  }
});
