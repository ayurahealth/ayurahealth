'use client'
import { useState } from 'react'
import { getApiUrl } from '../../lib/constants'
import type { VedicOracleResponse } from '../../lib/vedic/types'
import BirthChartInput from './BirthChartInput'
import PlanetaryHealthCard from './PlanetaryHealthCard'
import VedicClockWidget from './VedicClockWidget'
import HolographicLabMap from '../diagnostics/HolographicLabMap'

interface Props {
  initialDosha?: string
  labResults?: Array<{ id: string; value: string; status: 'optimal' | 'low' | 'high' }>
  onContextReady?: (context: string) => void
}

export default function VedicOraclePanel({ initialDosha = 'Vata', labResults = [], onContextReady }: Props) {
  const [oracleData, setOracleData] = useState<VedicOracleResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'chart' | 'elements' | 'math' | 'remedies' | 'daily' | 'labs'>('chart')
  const [birthDataEntered, setBirthDataEntered] = useState(false)

  async function fetchOracleData(birthData: {
    dateOfBirth: string
    timeOfBirth: string
    placeOfBirth: string
    latitude: number
    longitude: number
    timezone: number
  }) {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(getApiUrl('/api/vedic/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthData,
          dosha: initialDosha,
          symptoms: [],
          age: 30
        })
      })

      if (!response.ok) throw new Error('Failed to calculate Vedic profile')
      const json = await response.json()
      setOracleData(json.data)
      setBirthDataEntered(true)

      if (onContextReady && json.data.vaidyaContext) {
        onContextReady(json.data.vaidyaContext)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'chart', label: '🌙 Birth Chart', emoji: '🌙' },
    { id: 'elements', label: '🌿 Elements', emoji: '🌿' },
    { id: 'math', label: '🔢 Vedic Math', emoji: '🔢' },
    { id: 'remedies', label: '💎 Remedies', emoji: '💎' },
    { id: 'daily', label: '📅 Today', emoji: '📅' },
    { id: 'labs', label: '🧬 Labs', emoji: '🧬' },
  ] as const

  if (!birthDataEntered) {
    return (
      <div className="premium-glass" style={{
        borderRadius: 'var(--ios-radius-xl)',
        padding: '2.5rem',
        marginBottom: '1.75rem',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔭</div>
          <h2 style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: '1.85rem',
            color: 'hsl(var(--gold-accent))',
            marginBottom: '0.6rem',
            letterSpacing: '0.05em'
          }}>
            Vedic Intelligence Oracle
          </h2>
          <p style={{ color: 'var(--ios-muted)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 1.5rem' }}>
            Enter your birth details to unlock Jyotish (Vedic Astrology), Pancha Bhuta (Five Elements),
            and Vedic Mathematics analysis — powering deeper VAIDYA health insights.
          </p>
        </div>
        <BirthChartInput onSubmit={fetchOracleData} loading={loading} />
        {error && (
          <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
            {error}
          </p>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(5,16,10,0.95), rgba(10,25,15,0.98))',
        borderRadius: 24,
        border: '1px solid rgba(201,168,76,0.3)',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>🔭</div>
        <p style={{ color: '#c9a84c', fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>
          Consulting the Vedic Oracle...
        </p>
        <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Calculating birth chart · Analyzing planetary periods · Computing elemental balance
        </p>
      </div>
    )
  }

  if (!oracleData) return null

  const { birthChart, panchaBhuta, vedicMathInsights, remedies, dailyVedicGuidance, vedicHealthScore, pranaProfile } = oracleData

  return (
    <div className="liquid-glass" style={{
      borderRadius: 'var(--ios-radius-xl)',
      overflow: 'hidden',
      marginBottom: '1.5rem'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.2rem 1.5rem',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: '1.25rem',
            color: 'hsl(var(--gold-accent))',
            margin: 0,
            letterSpacing: '0.02em'
          }}>
            🔭 Vedic Intelligence Oracle
          </h2>
          <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.78rem', margin: '0.2rem 0 0' }}>
            {birthChart.lagna} Lagna · {birthChart.moonSign} Moon · {birthChart.birthNakshatra} Nakshatra
          </p>
        </div>
        <div style={{
          background: 'rgba(201,168,76,0.1)',
          borderRadius: 12,
          padding: '0.4rem 0.8rem',
          border: '1px solid rgba(201,168,76,0.2)'
        }}>
          <span style={{ color: '#c9a84c', fontSize: '0.8rem', fontWeight: 600 }}>
            Health Score: {vedicHealthScore.overall}/100
          </span>
        </div>
      </div>

      {/* Score Bar */}
      <div style={{ padding: '0.8rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Physical', value: vedicHealthScore.physical, color: '#6abf8a' },
            { label: 'Mental', value: vedicHealthScore.mental, color: '#c9a84c' },
            { label: 'Spiritual', value: vedicHealthScore.spiritual, color: '#9b7fd4' },
            { label: 'Longevity', value: vedicHealthScore.longevity, color: '#5bc0eb' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex: 1, minWidth: 70 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: '0.68rem', color: 'rgba(232,223,200,0.5)' }}>{label}</span>
                <span style={{ fontSize: '0.68rem', color }}>{value}</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                <div style={{
                  height: '100%',
                  width: `${value}%`,
                  background: color,
                  borderRadius: 2,
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        scrollbarWidth: 'none'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              minWidth: 70,
              padding: '0.85rem 0.6rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid hsl(var(--gold-accent))' : '2px solid transparent',
              color: activeTab === tab.id ? 'hsl(var(--gold-accent))' : 'var(--ios-muted)',
              fontSize: '0.74rem',
              fontWeight: activeTab === tab.id ? 700 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s var(--ios-ease-standard)'
            }}
          >
            {tab.emoji} {tab.label.split(' ')[1] || tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="native-scroll"
        style={{
          padding: '1.2rem 1.5rem',
          maxHeight: 'min(56vh, 620px)',
          overflowY: 'auto'
        }}
      >

        {/* BIRTH CHART TAB */}
        {activeTab === 'chart' && (
          <div>
            {/* Current Dasha */}
            <div style={{
              background: 'rgba(201,168,76,0.08)',
              borderRadius: 12,
              padding: '1rem',
              border: '1px solid rgba(201,168,76,0.2)',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: '#c9a84c', fontSize: '0.85rem', marginBottom: '0.6rem', fontFamily: 'Georgia, serif' }}>
                ⏳ Current Planetary Period
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.78rem' }}>Mahadasha</span>
                <span style={{ color: '#e8dfc8', fontSize: '0.78rem', fontWeight: 600 }}>{birthChart.currentDasha.lord}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.78rem' }}>Antardasha</span>
                <span style={{ color: '#e8dfc8', fontSize: '0.78rem' }}>{birthChart.currentAntardasha.lord}</span>
              </div>
              <p style={{ color: 'rgba(232,223,200,0.7)', fontSize: '0.78rem', lineHeight: 1.5, margin: 0 }}>
                {birthChart.currentDasha.healthImplication}
              </p>
            </div>

            {/* Planetary positions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              {birthChart.grahaPositions.map(gp => (
                <PlanetaryHealthCard key={gp.graha} position={gp} />
              ))}
            </div>

            {/* Yogas */}
            {birthChart.yogas.length > 0 && (
              <div>
                <h3 style={{ color: '#c9a84c', fontSize: '0.82rem', marginBottom: '0.6rem' }}>✨ Active Yogas</h3>
                {birthChart.yogas.map(yoga => (
                  <div key={yoga.name} style={{
                    background: 'rgba(106,191,138,0.05)',
                    borderRadius: 8,
                    padding: '0.7rem',
                    border: '1px solid rgba(106,191,138,0.15)',
                    marginBottom: '0.4rem'
                  }}>
                    <p style={{ color: '#6abf8a', fontSize: '0.78rem', fontWeight: 600, margin: '0 0 0.3rem' }}>{yoga.name}</p>
                    <p style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.72rem', margin: 0 }}>{yoga.healthImpact}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ELEMENTS TAB */}
        {activeTab === 'elements' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#c9a84c', fontSize: '0.85rem', marginBottom: '0.8rem', fontFamily: 'Georgia, serif' }}>
                🌿 Pancha Bhuta Distribution
              </h3>
              {([
                { name: 'Akasha (Ether)', key: 'akashaPercentage', icon: '🌌', color: '#9b7fd4' },
                { name: 'Vayu (Air)', key: 'vayuPercentage', icon: '💨', color: '#5bc0eb' },
                { name: 'Agni (Fire)', key: 'agniPercentage', icon: '🔥', color: '#ff9f43' },
                { name: 'Jal (Water)', key: 'jalPercentage', icon: '💧', color: '#54a0ff' },
                { name: 'Prithvi (Earth)', key: 'prithviPercentage', icon: '🌍', color: '#6abf8a' },
              ] as const).map(({ name, key, icon, color }) => (
                <div key={key} style={{ marginBottom: '0.7rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'rgba(232,223,200,0.7)', fontSize: '0.78rem' }}>{icon} {name}</span>
                    <span style={{ color, fontSize: '0.78rem', fontWeight: 600 }}>
                      {panchaBhuta[key]}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                    <div style={{
                      height: '100%',
                      width: `${panchaBhuta[key]}%`,
                      background: `linear-gradient(90deg, ${color}88, ${color})`,
                      borderRadius: 3,
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: '0.8rem',
                padding: '0.5rem 0.8rem',
                background: panchaBhuta.overallBalance === 'Balanced' ? 'rgba(106,191,138,0.1)' : 'rgba(201,168,76,0.08)',
                borderRadius: 8,
                border: `1px solid ${panchaBhuta.overallBalance === 'Balanced' ? 'rgba(106,191,138,0.2)' : 'rgba(201,168,76,0.15)'}`
              }}>
                <span style={{ fontSize: '0.78rem', color: panchaBhuta.overallBalance === 'Balanced' ? '#6abf8a' : '#c9a84c' }}>
                  Balance: {panchaBhuta.overallBalance}
                </span>
              </div>
            </div>

            {/* Prana Analysis */}
            <h3 style={{ color: '#c9a84c', fontSize: '0.82rem', marginBottom: '0.6rem' }}>🌬️ Prana Vayu Analysis</h3>
            {pranaProfile.map(p => (
              <div key={p.prana.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0.7rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 8,
                marginBottom: '0.4rem',
                border: '1px solid rgba(255,255,255,0.04)'
              }}>
                <div>
                  <p style={{ color: '#e8dfc8', fontSize: '0.78rem', fontWeight: 600, margin: 0 }}>{p.prana.name} Vayu</p>
                  <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.68rem', margin: '0.1rem 0 0' }}>{p.prana.location}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: i < p.strength ? '#6abf8a' : 'rgba(255,255,255,0.1)'
                      }} />
                    ))}
                  </div>
                  <p style={{ color: p.strength >= 7 ? '#6abf8a' : p.strength >= 5 ? '#c9a84c' : '#ff6b6b', fontSize: '0.68rem', margin: '0.2rem 0 0' }}>
                    {p.strength}/10
                  </p>
                </div>
              </div>
            ))}

            {/* Recommendations */}
            {panchaBhuta.recommendations.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h3 style={{ color: '#c9a84c', fontSize: '0.82rem', marginBottom: '0.6rem' }}>📋 Element Recommendations</h3>
                {panchaBhuta.recommendations.map((rec, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 10,
                    padding: '0.8rem',
                    marginBottom: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 20,
                        background: rec.action === 'Increase' ? 'rgba(106,191,138,0.15)' : rec.action === 'Decrease' ? 'rgba(255,107,107,0.15)' : 'rgba(201,168,76,0.15)',
                        color: rec.action === 'Increase' ? '#6abf8a' : rec.action === 'Decrease' ? '#ff6b6b' : '#c9a84c'
                      }}>{rec.action} {rec.bhuta}</span>
                    </div>
                    <p style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.72rem', margin: 0 }}>
                      {rec.practices.join(' · ')}
                    </p>
                    <p style={{ color: 'rgba(232,223,200,0.5)', fontSize: '0.68rem', margin: '0.3rem 0 0' }}>
                      Foods: {rec.foods.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VEDIC MATH TAB */}
        {activeTab === 'math' && (
          <div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem'
            }}>
              {[
                { label: 'Health Number', value: vedicMathInsights.digitalRoot, icon: '🔢' },
                { label: 'Pattern Type', value: vedicMathInsights.patternType, icon: '📊' },
                { label: 'Biorhythm', value: vedicMathInsights.biorhythmPhase, icon: '〰️' },
                { label: 'Signature', value: vedicMathInsights.numerologicalSignature, icon: '✨' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{
                  background: 'rgba(201,168,76,0.05)',
                  borderRadius: 10,
                  padding: '0.7rem',
                  border: '1px solid rgba(201,168,76,0.1)',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '1.2rem', margin: '0 0 0.3rem' }}>{icon}</p>
                  <p style={{ color: '#c9a84c', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.2rem' }}>{value}</p>
                  <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.65rem', margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>

            {vedicMathInsights.optimalWindows.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ color: '#c9a84c', fontSize: '0.82rem', marginBottom: '0.6rem' }}>⏰ Optimal Windows Today</h3>
                {vedicMathInsights.optimalWindows.map((w, i) => (
                  <div key={w.type + i.toString()} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.6rem 0.8rem',
                    background: 'rgba(106,191,138,0.05)',
                    borderRadius: 8, marginBottom: '0.4rem',
                    border: '1px solid rgba(106,191,138,0.1)'
                  }}>
                    <div>
                      <p style={{ color: '#e8dfc8', fontSize: '0.78rem', margin: 0 }}>{w.type}</p>
                      <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.68rem', margin: '0.2rem 0 0' }}>{w.reason}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#6abf8a', fontSize: '0.75rem', margin: 0 }}>{w.startHour}:00–{w.endHour}:00</p>
                      <p style={{ color: w.quality === 'Excellent' ? '#c9a84c' : '#6abf8a', fontSize: '0.65rem', margin: '0.2rem 0 0' }}>{w.quality}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ color: '#c9a84c', fontSize: '0.82rem', marginBottom: '0.6rem' }}>📐 Sutras Applied</h3>
            {vedicMathInsights.sutrasApplied.slice(0, 4).map((sutra, i) => (
              <div key={sutra.sutraName + i.toString()} style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 8,
                padding: '0.7rem',
                marginBottom: '0.4rem',
                border: '1px solid rgba(255,255,255,0.04)'
              }}>
                <p style={{ color: '#e8dfc8', fontSize: '0.75rem', fontWeight: 600, margin: '0 0 0.2rem' }}>
                  {sutra.sutraName}
                </p>
                <p style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.68rem', fontStyle: 'italic', margin: '0 0 0.3rem' }}>
                  &quot;{sutra.sutraText}&quot;
                </p>
                <p style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.7rem', margin: 0 }}>
                  {sutra.result}
                </p>
              </div>
            ))}

            {vedicMathInsights.ratioAnalysis.length > 0 && (
              <div style={{ marginTop: '0.8rem' }}>
                <h3 style={{ color: '#c9a84c', fontSize: '0.82rem', marginBottom: '0.6rem' }}>⚗️ Biomarker Ratios</h3>
                {vedicMathInsights.ratioAnalysis.map((r, i) => (
                  <div key={r.markers.join('-') + i.toString()} style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 8, padding: '0.7rem',
                    marginBottom: '0.4rem',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <p style={{ color: '#e8dfc8', fontSize: '0.75rem', fontWeight: 600, margin: '0 0 0.2rem' }}>
                      {r.markers.join(' : ')} = {r.ratio}
                    </p>
                    <p style={{ color: '#c9a84c', fontSize: '0.68rem', margin: '0 0 0.2rem' }}>{r.vedicPattern}</p>
                    <p style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.7rem', margin: 0 }}>{r.healthSignificance}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REMEDIES TAB */}
        {activeTab === 'remedies' && (
          <div>
            {remedies.map((remedy, i) => (
              <div key={remedy.title + i.toString()} style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 12,
                padding: '0.9rem',
                marginBottom: '0.6rem',
                border: `1px solid ${remedy.urgency === 'Immediate' ? 'rgba(255,107,107,0.2)' : remedy.urgency === 'Soon' ? 'rgba(201,168,76,0.15)' : 'rgba(106,191,138,0.1)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <span style={{
                      fontSize: '0.62rem', padding: '0.15rem 0.5rem', borderRadius: 20,
                      background: 'rgba(106,191,138,0.1)', color: '#6abf8a',
                      marginRight: '0.4rem'
                    }}>{remedy.type}</span>
                    <span style={{
                      fontSize: '0.62rem', padding: '0.15rem 0.5rem', borderRadius: 20,
                      background: remedy.urgency === 'Immediate' ? 'rgba(255,107,107,0.1)' : 'rgba(201,168,76,0.08)',
                      color: remedy.urgency === 'Immediate' ? '#ff6b6b' : '#c9a84c'
                    }}>{remedy.urgency}</span>
                  </div>
                </div>
                <p style={{ color: '#e8dfc8', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 0.3rem' }}>{remedy.title}</p>
                <p style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.73rem', margin: '0 0 0.3rem', lineHeight: 1.5 }}>{remedy.description}</p>
                <p style={{ color: 'rgba(232,223,200,0.35)', fontSize: '0.68rem', margin: 0 }}>Duration: {remedy.duration}</p>
              </div>
            ))}
          </div>
        )}

        {/* DAILY TAB */}
        {activeTab === 'daily' && (
          <div>
            <VedicClockWidget guidance={dailyVedicGuidance} />
          </div>
        )}
        {/* LABS TAB */}
        {activeTab === 'labs' && (
          <div>
            <h3 style={{ color: '#c9a84c', fontSize: '0.85rem', marginBottom: '0.8rem', fontFamily: 'Georgia, serif' }}>
              🧬 3D Biologic Synthesis Map
            </h3>
            <p style={{ color: 'rgba(232,223,200,0.5)', fontSize: '0.78rem', marginBottom: '1.2rem', lineHeight: 1.5 }}>
              Visualizing modern biomarkers through the lens of Pancha Bhuta (Elemental) and Dhatu (Tissue) systems.
            </p>
            <HolographicLabMap results={labResults} />
          </div>
        )}

      </div>
    </div>
  )
}

