// Currency
app.get('/api/currency', async (req, res) => {
  const amount = parseFloat(req.query.amount || '1');
  if (Number.isNaN(amount) || amount < 0) {
    return res.status(400).json({ error: 'Invalid amount. Provide a non-negative number.' });
  }

  try {
    console.log('Fetching live currency data...');
    // Try Open ER API (no key, public)
    const resp = await axios.get('https://open.er-api.com/v6/latest/INR', { timeout: 5000 });
    const rates = resp.data?.rates;
    if (!rates?.USD || !rates?.EUR) throw new Error('Invalid data');
    console.log('✅ Live rates fetched:', rates.USD, rates.EUR);

    const usd = +(amount * rates.USD).toFixed(4);
    const eur = +(amount * rates.EUR).toFixed(4);
    return res.status(200).json({ usd, eur });
  } catch (err) {
    console.warn('⚠️  Could not reach live API, using fallback rates:', err.message);

    // --- GUARANTEED FALLBACK ---
    const fallbackRates = { USD: 0.012, EUR: 0.011 };
    const usd = +(amount * fallbackRates.USD).toFixed(4);
    const eur = +(amount * fallbackRates.EUR).toFixed(4);

    return res.status(200).json({
      usd,
      eur,
      note: 'Used fallback rates (offline mode).'
    });
  }
});
