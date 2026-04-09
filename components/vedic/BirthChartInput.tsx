'use client'
import { useState } from 'react'

interface Props {
  onSubmit: (data: {
    dateOfBirth: string
    timeOfBirth: string
    placeOfBirth: string
    latitude: number
    longitude: number
    timezone: number
  }) => void
  loading: boolean
}

// Simplified timezone/location map for common cities
const CITY_DATA: Record<string, { lat: number; lng: number; tz: number; country: string }> = {
  Mumbai: { lat: 19.076, lng: 72.8777, tz: 5.5, country: 'India' },
  Delhi: { lat: 28.6139, lng: 77.209, tz: 5.5, country: 'India' },
  Bangalore: { lat: 12.9716, lng: 77.5946, tz: 5.5, country: 'India' },
  Chennai: { lat: 13.0827, lng: 80.2707, tz: 5.5, country: 'India' },
  Kolkata: { lat: 22.5726, lng: 88.3639, tz: 5.5, country: 'India' },
  Pune: { lat: 18.5204, lng: 73.8567, tz: 5.5, country: 'India' },
  Tokyo: { lat: 35.6762, lng: 139.6503, tz: 9, country: 'Japan' },
  Osaka: { lat: 34.6937, lng: 135.5023, tz: 9, country: 'Japan' },
  Sendai: { lat: 38.2682, lng: 140.8694, tz: 9, country: 'Japan' },
  London: { lat: 51.5074, lng: -0.1278, tz: 0, country: 'UK' },
  'New York': { lat: 40.7128, lng: -74.006, tz: -5, country: 'USA' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, tz: -8, country: 'USA' },
  Dubai: { lat: 25.2048, lng: 55.2708, tz: 4, country: 'UAE' },
  Singapore: { lat: 1.3521, lng: 103.8198, tz: 8, country: 'Singapore' },
  Sydney: { lat: -33.8688, lng: 151.2093, tz: 11, country: 'Australia' },
}

export default function BirthChartInput({ onSubmit, loading }: Props) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('12:00')
  const [city, setCity] = useState('')
  const [customCity, setCustomCity] = useState('')
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [tz, setTz] = useState(5.5)
  const [showCustom, setShowCustom] = useState(false)

  function handleCitySelect(cityName: string) {
    setCity(cityName)
    const data = CITY_DATA[cityName]
    if (data) {
      setLat(data.lat)
      setLng(data.lng)
      setTz(data.tz)
      setShowCustom(false)
    } else if (cityName === 'Other') {
      setShowCustom(true)
    }
  }

  function handleSubmit() {
    if (!date) return
    const placeOfBirth = showCustom ? customCity : (city || 'Unknown')
    onSubmit({
      dateOfBirth: date,
      timeOfBirth: time || '12:00',
      placeOfBirth,
      latitude: lat || 20,
      longitude: lng || 77,
      timezone: tz
    })
  }

  const isValid = date.length === 10 && (city || (showCustom && customCity))

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.78rem', display: 'block', marginBottom: '0.4rem' }}>
          Date of Birth *
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          style={{
            width: '100%', padding: '0.7rem 0.8rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 10, color: '#e8dfc8',
            fontSize: '0.88rem',
            boxSizing: 'border-box',
            colorScheme: 'dark'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.78rem', display: 'block', marginBottom: '0.4rem' }}>
          Time of Birth <span style={{ color: 'rgba(232,223,200,0.35)' }}>(approximate is fine)</span>
        </label>
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          style={{
            width: '100%', padding: '0.7rem 0.8rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 10, color: '#e8dfc8', fontSize: '0.88rem',
            boxSizing: 'border-box',
            colorScheme: 'dark'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.78rem', display: 'block', marginBottom: '0.4rem' }}>
          Place of Birth *
        </label>
        <select
          value={city}
          onChange={e => handleCitySelect(e.target.value)}
          style={{
            width: '100%', padding: '0.7rem 0.8rem',
            background: 'rgba(5,16,10,0.9)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 10, color: '#e8dfc8', fontSize: '0.88rem',
            boxSizing: 'border-box'
          }}
        >
          <option value="">Select city...</option>
          <optgroup label="India">
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
          <optgroup label="Japan">
            {['Tokyo', 'Osaka', 'Sendai'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
          <optgroup label="International">
            {['London', 'New York', 'Los Angeles', 'Dubai', 'Singapore', 'Sydney'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
          <option value="Other">Other city...</option>
        </select>

        {showCustom && (
          <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
            <input
              placeholder="City name"
              value={customCity}
              onChange={e => setCustomCity(e.target.value)}
              style={{
                gridColumn: '1 / -1', padding: '0.5rem 0.7rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 8, color: '#e8dfc8', fontSize: '0.8rem'
              }}
            />
            <input
              placeholder="Latitude"
              type="number"
              step="0.01"
              value={lat || ''}
              onChange={e => setLat(parseFloat(e.target.value))}
              style={{
                padding: '0.5rem 0.7rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 8, color: '#e8dfc8', fontSize: '0.8rem'
              }}
            />
            <input
              placeholder="Longitude"
              type="number"
              step="0.01"
              value={lng || ''}
              onChange={e => setLng(parseFloat(e.target.value))}
              style={{
                padding: '0.5rem 0.7rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 8, color: '#e8dfc8', fontSize: '0.8rem'
              }}
            />
            <input
              placeholder="UTC offset (e.g. 5.5)"
              type="number"
              step="0.5"
              value={tz}
              onChange={e => setTz(parseFloat(e.target.value))}
              style={{
                padding: '0.5rem 0.7rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 8, color: '#e8dfc8', fontSize: '0.8rem'
              }}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid || loading}
        style={{
          width: '100%', padding: '0.9rem',
          background: isValid && !loading
            ? 'linear-gradient(135deg, #2d5a1b, #3d7a28)'
            : 'rgba(255,255,255,0.05)',
          border: 'none', borderRadius: 12,
          color: isValid && !loading ? '#e8dfc8' : 'rgba(232,223,200,0.3)',
          fontSize: '0.9rem', fontWeight: 600, cursor: isValid && !loading ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s'
        }}
      >
        {loading ? '🔭 Calculating...' : '✨ Reveal My Vedic Profile'}
      </button>

      <p style={{ textAlign: 'center', color: 'rgba(232,223,200,0.25)', fontSize: '0.65rem', marginTop: '0.7rem' }}>
        Birth data is used only for Vedic calculations and stored locally. Not shared with third parties.
      </p>
    </div>
  )
}

