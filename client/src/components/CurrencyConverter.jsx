import React, { useState } from 'react'
import axios from 'axios'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidAmount = (val) => {
    const num = parseFloat(val)
    // Reject: empty, NaN, 0, or negative
    return val.trim() !== '' && !isNaN(num) && num > 0
  }

  const convert = async () => {
    if (!isValidAmount(amount)) {
      setError('Please enter a valid positive number.')
      setData(null)
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const res = await axios.get(`/api/currency`, { params: { amount } })
      setData(res.data)
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to convert.')
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2>Currency Converter (INR → USD/EUR)</h2>

      <div className="row" style={{ marginBottom: 10 }}>
        <input
          className="input"
          type="text"
          inputMode="decimal"
          placeholder="Enter amount in INR"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          className="button"
          onClick={convert}
          disabled={!isValidAmount(amount)}
          style={{
            opacity: isValidAmount(amount) ? 1 : 0.6,
            cursor: isValidAmount(amount) ? 'pointer' : 'not-allowed'
          }}
        >
          Convert
        </button>
      </div>

      {isLoading && <div className="loading">Converting...</div>}
      {error && <div className="error">{error}</div>}

      {data && !isLoading && !error && (
        <div>
          <div className="label">USD</div>
          <div style={{ fontSize: 22, marginBottom: 6 }}>${data.usd}</div>
          <div className="label">EUR</div>
          <div style={{ fontSize: 22 }}>€{data.eur}</div>
        </div>
      )}
    </div>
  )
}
