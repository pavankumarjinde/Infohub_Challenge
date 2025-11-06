import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function QuoteGenerator() {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchQuote = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await axios.get('/api/quote')
      setQuote(res.data.content)
      setAuthor(res.data.author)
    } catch (e) {
      setError('Could not fetch quote.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <div>
      <h2>Motivational Quote</h2>
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!isLoading && !error && (
        <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: 18, margin: '20px 0' }}>
          "{quote}"  
          <div style={{ marginTop: 8, fontWeight: 'bold' }}>— {author}</div>
        </div>
      )}
      <button className="button" onClick={fetchQuote}>New Quote</button>
    </div>
  )
}
