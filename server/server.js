
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Health
app.get('/', (_, res) => res.send('InfoHub API is running'));

// Quote
// Quote Generator using Quotable API
app.get('/api/quote', async (req, res) => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    return res.status(200).json({ content, author });
  } catch (err) {
    console.error('Quote API error:', err.message);

    // fallback: still return one if API fails
    const fallbackQuotes = [
      { content: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
      { content: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
      { content: 'Dream big and dare to fail.', author: 'Norman Vaughan' },
      { content: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
      { content: 'The harder you work for something, the greater you’ll feel when you achieve it.', author: 'Anonymous' }
    ];

    const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    return res.status(200).json(random);
  }
});

// Weather

app.get('/api/weather', async (req, res) => {
  try {
    const { location = '' } = req.query;

    if (!location.trim()) {
      return res.status(400).json({ error: 'Please enter a city name.' });
    }

    // ✅ Your WeatherAPI key
    const apiKey = '5797db9df8b646b186232107250611';

    // Fetch weather directly by city name
    const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
      params: { key: apiKey, q: location }
    });

    const data = response.data;

    // Send simplified JSON back to frontend
    res.status(200).json({
      location: `${data.location.name}, ${data.location.country}`,
      temperature: data.current.temp_c,
      description: data.current.condition.text,
      icon: data.current.condition.icon
    });
  } catch (err) {
    console.error('Weather API error:', err.response?.data || err.message);

    // Return proper error message if invalid city
    if (err.response?.data?.error?.message) {
      return res.status(404).json({ error: err.response.data.error.message });
    }

    res.status(500).json({ error: 'Could not fetch weather data. Please try again.' });
  }
});

// Currency
// Currency
app.get('/api/currency', async (req, res) => {
  try {
    const amountRaw = req.query.amount;
    const amount = parseFloat(amountRaw);

    // ✅ Input validation
    if (!amountRaw || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Please enter a valid positive number.' });
    }

    const apiKey = 'c607afd8a1330689f9bddb76';
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/INR`;

    const resp = await axios.get(url);
    const rates = resp.data?.conversion_rates;

    const usd = +(amount * rates.USD).toFixed(4);
    const eur = +(amount * rates.EUR).toFixed(4);

    return res.status(200).json({ usd, eur });
  } catch (err) {
    console.error('Currency API failed:', err.message);
    res.status(500).json({ error: 'Could not fetch currency data.' });
  }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`InfoHub API on http://localhost:${PORT}`));
