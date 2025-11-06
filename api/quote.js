const axios = require('axios');

module.exports = async (req, res) => {
  try {
    try {
      const q = await axios.get('https://api.quotable.io/random');
      const { content, author } = q.data;
      return res.status(200).json({ content, author });
    } catch (e) {
      // Fallback to local quotes
      const quotes = [
        { content: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
        { content: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
        { content: 'Dream big and dare to fail.', author: 'Norman Vaughan' }
      ];
      const random = quotes[Math.floor(Math.random() * quotes.length)];
      return res.status(200).json(random);
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch a quote.' });
  }
};
