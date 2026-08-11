import { useState } from 'react'
import './App.css'

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/eventi@gioielleriarabino.com'
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Hotel+Superga+Cuneo'

const emptyForm = {
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

async function postToFormSubmit(payload) {
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('FormSubmit error:', res.status, await res.text())
    }
  } catch (err) {
    console.error('Network error during form submit — continuing anyway:', err)
  }
}

function buildIcs() {
  const uid = `chanel-rabino-${Date.now()}@gioielleriarabino.com`
  const description =
    'In the greatest strength lies softness — J12 · CHANEL. Un evento Rabino 1895 in collaborazione con Chanel.'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gioielleria Rabino 1895//Invito Chanel//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'DTSTAMP:20260918T180000Z',
    'DTSTART:20260918T180000Z',
    'DTEND:20260918T190000Z',
    'SUMMARY:Elefantino × Chanel — Rabino 1895',
    `DESCRIPTION:${description}`,
    'LOCATION:Rooftop\\, Hotel Superga / Cuneo',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'elefantino-chanel-rabino.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function App() {
  const [stage, setStage] = useState('teaser')
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [rsvp, setRsvp] = useState(null)
  const [accompagnatore, setAccompagnatore] = useState('')
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false)
  const [rsvpDone, setRsvpDone] = useState(false)

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function validate() {
    const next = {}
    if (!form.nome.trim()) next.nome = 'Campo obbligatorio'
    if (!form.cognome.trim()) next.cognome = 'Campo obbligatorio'
    if (!form.email.trim()) next.email = 'Campo obbligatorio'
    else if (!isValidEmail(form.email)) next.email = 'Email non valida'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    await postToFormSubmit({
      _subject: 'Nuova registrazione — Invito Chanel × Rabino',
      nome: form.nome.trim(),
      cognome: form.cognome.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim() || '—',
    })
    setSubmitting(false)
    setStage('details')
  }

  async function handleRsvp() {
    if (!rsvp) return
    setRsvpSubmitting(true)
    await postToFormSubmit({
      _subject: 'Conferma presenza — Invito Chanel × Rabino',
      nome: form.nome.trim(),
      cognome: form.cognome.trim(),
      email: form.email.trim(),
      presenza: rsvp === 'yes' ? 'Sarò presente' : 'Non potrò',
      accompagnatore:
        rsvp === 'yes' ? accompagnatore.trim() || '—' : '—',
    })
    setRsvpSubmitting(false)
    setRsvpDone(true)
  }

  return (
    <div className="app-shell">
      {stage === 'teaser' && (
        <section className="teaser stage" key="teaser">
          <p className="teaser-brand">GIOIELLERIA RABINO 1895</p>

          <div className="teaser-center">
            <h1 className="teaser-chanel">CHANEL</h1>
            <img
              className="teaser-icon"
              src="/assets/elefantino.png"
              alt="Elefantino Chanel"
            />
            <p className="teaser-date">18 SETTEMBRE</p>
            <p className="teaser-city">CUNEO</p>
          </div>

          <button
            type="button"
            className="teaser-cta"
            onClick={() => setStage('form')}
          >
            SCOPRI L&apos;INVITO →
          </button>
        </section>
      )}

      {stage === 'form' && (
        <section className="page stage" key="form">
          <button
            type="button"
            className="back-btn"
            onClick={() => setStage('teaser')}
          >
            ← INDIETRO
          </button>

          <p className="eyebrow">REGISTRAZIONE</p>
          <h2 className="title-serif">Il tuo invito ti aspetta</h2>
          <p className="subtitle">
            Inserisci i tuoi dati per accedere ai dettagli dell&apos;evento
            esclusivo Chanel × Rabino 1895.
          </p>

          <form className="form" onSubmit={handleRegister} noValidate>
            <div className={`field${errors.nome ? ' has-error' : ''}`}>
              <label htmlFor="nome">Nome*</label>
              <input
                id="nome"
                name="nome"
                autoComplete="given-name"
                value={form.nome}
                onChange={(e) => updateField('nome', e.target.value)}
              />
              {errors.nome && <span className="field-error">{errors.nome}</span>}
            </div>

            <div className={`field${errors.cognome ? ' has-error' : ''}`}>
              <label htmlFor="cognome">Cognome*</label>
              <input
                id="cognome"
                name="cognome"
                autoComplete="family-name"
                value={form.cognome}
                onChange={(e) => updateField('cognome', e.target.value)}
              />
              {errors.cognome && (
                <span className="field-error">{errors.cognome}</span>
              )}
            </div>

            <div className={`field${errors.email ? ' has-error' : ''}`}>
              <label htmlFor="email">Email*</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="telefono">Telefono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                value={form.telefono}
                onChange={(e) => updateField('telefono', e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Invio…' : 'ACCEDI AI DETTAGLI'}
            </button>
          </form>
        </section>
      )}

      {stage === 'details' && (
        <section className="stage" key="details">
          <div className="hero">
            <img src="/assets/j12-hero.jpg" alt="Chanel J12" />
            <div className="hero-overlay">
              <p className="hero-claim">
                In the greatest strength lies softness
              </p>
              <p className="hero-meta">J12 · CHANEL</p>
            </div>
          </div>

          <div className="details-body">
            <p className="eyebrow">L&apos;EVENTO</p>
            <h2 className="title-serif" style={{ fontStyle: 'normal' }}>
              Elefantino × Chanel
            </h2>

            <div className="details-list">
              <div className="detail-row">
                <span className="detail-label">DATA</span>
                <span className="detail-value">18 Settembre 2026</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">ORARIO</span>
                <span className="detail-value">18:00 · in via di conferma</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">LOCATION</span>
                <span className="detail-value">
                  Rooftop, Hotel Superga / Cuneo
                  <br />
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                    indicazioni ↗
                  </a>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">DRESS CODE</span>
                <span className="detail-value">Elegante</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">INVITO</span>
                <span className="detail-value">
                  Valido per 2 persone (1+1)
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-outline calendar-btn"
              onClick={buildIcs}
            >
              + AGGIUNGI AL CALENDARIO
            </button>

            <div className="rsvp">
              {!rsvpDone ? (
                <>
                  <h3 className="rsvp-title">Conferma la tua presenza</h3>
                  <p className="rsvp-sub">
                    Facci sapere se potrai essere con noi.
                  </p>

                  <div className="rsvp-toggles">
                    <button
                      type="button"
                      className={`btn-toggle${rsvp === 'yes' ? ' is-active' : ''}`}
                      onClick={() => setRsvp('yes')}
                    >
                      Sarò presente
                    </button>
                    <button
                      type="button"
                      className={`btn-toggle${rsvp === 'no' ? ' is-active' : ''}`}
                      onClick={() => {
                        setRsvp('no')
                        setAccompagnatore('')
                      }}
                    >
                      Non potrò
                    </button>
                  </div>

                  {rsvp === 'yes' && (
                    <div className="field companion-field">
                      <label htmlFor="accompagnatore">
                        Nome accompagnatore
                      </label>
                      <input
                        id="accompagnatore"
                        name="accompagnatore"
                        value={accompagnatore}
                        onChange={(e) => setAccompagnatore(e.target.value)}
                        placeholder="Opzionale"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn-primary"
                    disabled={!rsvp || rsvpSubmitting}
                    onClick={handleRsvp}
                  >
                    {rsvpSubmitting ? 'Invio…' : 'CONFERMA'}
                  </button>
                </>
              ) : (
                <p className="rsvp-thanks">
                  {rsvp === 'yes'
                    ? 'Grazie — non vediamo l’ora di accoglierti.'
                    : 'Grazie per avercelo fatto sapere. Ci mancherai.'}
                </p>
              )}
            </div>

            <a
              className="discover-link"
              href="https://www.gioielleriarabino.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              SCOPRI RABINO 1895 →
            </a>

            <footer className="footer">
              <img
                className="footer-logo"
                src="/assets/rabino-wordmark.png"
                alt="Gioielleria Rabino 1895"
              />
              <p className="footer-note">
                UN EVENTO RABINO 1895 IN COLLABORAZIONE CON CHANEL
              </p>
            </footer>
          </div>
        </section>
      )}
    </div>
  )
}
