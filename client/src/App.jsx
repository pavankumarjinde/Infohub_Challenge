import React, { useState } from 'react'
import WeatherModule from './components/WeatherModule.jsx'
import CurrencyConverter from './components/CurrencyConverter.jsx'
import QuoteGenerator from './components/QuoteGenerator.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('Weather')

  const tabs = ['Weather', 'Currency', 'Quotes']

  return (
    <div className="container">
      <h1>InfoHub</h1>
      <div className="nav">
        {tabs.map(t => (
          <button key={t}
            className={`tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'Weather' && <WeatherModule />}
        {activeTab === 'Currency' && <CurrencyConverter />}
        {activeTab === 'Quotes' && <QuoteGenerator />}
      </div>
      <p><small>Seamless SPA: no page reloads, clean loading/error states.</small></p>
    </div>
  )
}
