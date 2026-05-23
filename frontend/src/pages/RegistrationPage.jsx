import React, { useState } from 'react'
import BatchSelector from '../components/BatchSelector.jsx'
import FormInput from '../components/FormInput.jsx'
import { registerStudent } from '../services/api.js'

const INITIAL = { name: '', email: '', phone: '', batch: '' }

export default function RegistrationPage({ onSuccess }) {
  const [form, setForm]       = useState(INITIAL)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.batch)                              e.batch  = 'Please select a batch timing'
    if (!form.name.trim())                        e.name   = 'Name is required'
    else if (form.name.trim().length < 2)         e.name   = 'Name must be at least 2 characters'
    if (!form.email.trim())                       e.email  = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim())                       e.phone  = 'Phone number is required'
    else if (!/^[6-9]\d{9}$/.test(form.phone))   e.phone  = 'Enter a valid 10-digit Indian mobile number'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      const result = await registerStudent(form)
      onSuccess({ ...form, id: result.id || result.studentId })
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      {/* Left panel */}
      <aside className="panel-left">
        <div className="logo">
          <span className="logo-mark">EB</span>
          <span className="logo-text">EduBatch</span>
        </div>
        <div className="panel-content">
          <h1 className="hero-title">
            <span className="line">STUDENT</span>
            <span className="line accent">REGIS-</span>
            <span className="line accent">TRATION</span>
          </h1>
          <p className="hero-desc">
            Choose your preferred morning batch and complete your enrollment in under 60 seconds.
          </p>
          <div className="stats">
            <div className="stat"><span className="stat-num">3</span><span className="stat-label">Batches</span></div>
            <div className="stat"><span className="stat-num">AM</span><span className="stat-label">Sessions</span></div>
            <div className="stat"><span className="stat-num">∞</span><span className="stat-label">Learning</span></div>
          </div>
        </div>
        <div className="panel-footer">
          <span className="sys-label">SYS_STATUS</span>
          <span className="sys-dot" />
          <span className="sys-value">ONLINE</span>
        </div>
      </aside>

      {/* Right panel — form */}
      <main className="panel-right">
        <div className="form-container">
          <div className="form-header">
            <p className="form-meta">ENROLLMENT FORM // v1.0</p>
            <h2 className="form-title">New Registration</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="fields">
              <BatchSelector
                value={form.batch}
                onChange={(v) => { setForm(f => ({ ...f, batch: v })); setErrors(e => ({ ...e, batch: '' })) }}
                error={errors.batch}
              />

              <FormInput
                label="Full Name"
                index={2}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ravi Kumar"
                error={errors.name}
              />
              <FormInput
                label="Email Address"
                index={3}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. ravi@example.com"
                error={errors.email}
              />
              <FormInput
                label="Phone Number"
                index={4}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                error={errors.phone}
              />
            </div>

            {apiError && (
              <div className="api-error">
                <span>⚠</span> {apiError}
              </div>
            )}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <span className="loading-text">
                  <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                  REGISTERING
                </span>
              ) : (
                <>COMPLETE REGISTRATION <span className="btn-arrow">→</span></>
              )}
            </button>
          </form>
        </div>
      </main>

      <style>{`
        .page {
          display: grid;
          grid-template-columns: 420px 1fr;
          min-height: 100vh;
          animation: fadeUp 0.5s ease forwards;
        }
        @media (max-width: 860px) {
          .page { grid-template-columns: 1fr; }
        }

        /* Left Panel */
        .panel-left {
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          gap: 40px;
          position: sticky;
          top: 0;
          height: 100vh;
        }
        @media (max-width: 860px) {
          .panel-left { position: relative; height: auto; }
        }

        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-mark {
          width: 38px; height: 38px;
          background: var(--accent);
          color: var(--bg);
          font-family: var(--display);
          font-weight: 800;
          font-size: 0.85rem;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px;
          letter-spacing: -0.02em;
        }
        .logo-text {
          font-family: var(--display);
          font-weight: 700;
          font-size: 1rem;
          color: var(--text);
          letter-spacing: 0.05em;
        }

        .panel-content { flex: 1; }

        .hero-title {
          display: flex;
          flex-direction: column;
          font-family: var(--display);
          font-weight: 800;
          font-size: clamp(2.8rem, 4vw, 3.6rem);
          line-height: 0.95;
          letter-spacing: -0.04em;
          margin-bottom: 24px;
        }
        .line { display: block; color: var(--text); }
        .accent { color: var(--accent); }

        .hero-desc {
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.7;
          max-width: 280px;
          margin-bottom: 40px;
        }

        .stats { display: flex; gap: 28px; }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-num {
          font-family: var(--display);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--accent);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.62rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .panel-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }
        .sys-label { font-size: 0.62rem; color: var(--muted); letter-spacing: 0.12em; }
        .sys-dot {
          width: 6px; height: 6px;
          background: var(--success);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        .sys-value { font-size: 0.62rem; color: var(--success); letter-spacing: 0.12em; }

        /* Right Panel */
        .panel-right {
          padding: 40px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
        }

        .form-container {
          width: 100%;
          max-width: 560px;
          display: flex;
          flex-direction: column;
          gap: 36px;
          padding-top: 20px;
        }

        .form-meta {
          font-size: 0.65rem;
          color: var(--muted);
          letter-spacing: 0.15em;
          margin-bottom: 6px;
        }
        .form-title {
          font-family: var(--display);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.02em;
        }

        .fields { display: flex; flex-direction: column; gap: 24px; }

        .api-error {
          background: rgba(255,77,106,0.08);
          border: 1px solid var(--danger);
          border-radius: var(--radius);
          padding: 12px 16px;
          font-size: 0.78rem;
          color: var(--danger);
          letter-spacing: 0.03em;
        }

        .submit-btn {
          width: 100%;
          background: var(--accent);
          color: var(--bg);
          border: none;
          border-radius: var(--radius);
          padding: 16px 24px;
          font-family: var(--mono);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--accent-dim);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-arrow { font-size: 1rem; }

        .loading-text { display: flex; align-items: center; gap: 3px; }
        .dot { animation: blink 1s step-end infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </div>
  )
}