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
    if (!form.batch)                              e.batch = 'Please select a batch timing'
    if (!form.name.trim())                        e.name  = 'Name is required'
    else if (form.name.trim().length < 2)         e.name  = 'Name must be at least 2 characters'
    if (!form.email.trim())                       e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim())                       e.phone = 'Phone number is required'
    else if (!/^[6-9]\d{9}$/.test(form.phone))   e.phone = 'Enter a valid 10-digit Indian mobile number'
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
      const msg = err.response?.data?.message || ''
      setApiError(msg.includes('CORS') ? msg : (msg || 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reg-page">
      {/* Left panel */}
      <aside className="left-panel">
        <div className="left-content">
          <div className="hero-tag">Enrollment Portal</div>
          <h1 className="hero-title">
            Student<br />
            <span className="hero-accent">Registration</span>
          </h1>
          <p className="hero-desc">
            Choose your preferred morning batch and complete your enrollment in under 60 seconds.
          </p>

          <div className="batch-preview">
            {['07:30', '09:00', '10:30'].map(t => (
              <div key={t} className={`bp-item ${form.batch === t ? 'bp-active' : ''}`}>
                <span className="bp-dot" />
                <span className="bp-time">{t} AM</span>
              </div>
            ))}
          </div>
        </div>

        <div className="left-footer">
          <span className="status-dot" />
          <span className="status-text">System Online</span>
          <span className="status-sep">·</span>
          <span className="status-text">3 Batches Available</span>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="right-panel">
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">New Enrollment</h2>
            <p className="form-sub">Fill in your details to register</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="fields">
              <BatchSelector
                value={form.batch}
                onChange={(v) => { setForm(f => ({ ...f, batch: v })); setErrors(e => ({ ...e, batch: '' })) }}
                error={errors.batch}
              />
              <FormInput label="Full Name"       index={2} name="name"  value={form.name}  onChange={handleChange} placeholder="e.g. Ranjit Kumar" error={errors.name} />
              <FormInput label="Email Address"   index={3} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} />
              <FormInput label="Phone Number"    index={4} type="tel"   name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile" error={errors.phone} />
            </div>

            {apiError && (
              <div className="api-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {apiError}
              </div>
            )}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Registering...
                </span>
              ) : (
                <span className="btn-inner">
                  Complete Registration
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
            </button>
          </form>
        </div>
      </main>

      <style>{`
        .reg-page {
          display: grid;
          grid-template-columns: 400px 1fr;
          min-height: calc(100vh - 60px);
          animation: fadeIn 0.4s ease;
        }
        @media (max-width: 860px) {
          .reg-page { grid-template-columns: 1fr; }
        }

        /* Left */
        .left-panel {
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          overflow: hidden;
        }
        @media (max-width: 860px) {
          .left-panel { position: relative; height: auto; top: 0; }
        }

        .left-content { display: flex; flex-direction: column; gap: 28px; }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--accent-glow);
          border: 1px solid rgba(200,241,53,0.25);
          color: var(--accent);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 100px;
          width: fit-content;
        }

        .hero-title {
          font-family: var(--display);
          font-size: clamp(2.6rem, 4vw, 3.4rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: var(--text);
        }
        .hero-accent { color: var(--accent); }

        .hero-desc {
          font-size: 0.9rem;
          color: var(--text2);
          line-height: 1.7;
          max-width: 300px;
          font-weight: 400;
        }

        .batch-preview {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
        }
        .bp-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius);
          transition: background 0.2s;
        }
        .bp-item.bp-active { background: var(--accent-glow); }
        .bp-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--border2);
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .bp-item.bp-active .bp-dot { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
        .bp-time {
          font-family: var(--mono);
          font-size: 0.85rem;
          color: var(--text2);
          font-weight: 500;
        }
        .bp-item.bp-active .bp-time { color: var(--accent); }

        .left-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }
        .status-dot {
          width: 7px; height: 7px;
          background: var(--green);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .status-text { font-size: 0.72rem; color: var(--text3); font-weight: 500; }
        .status-sep { color: var(--border2); }

        /* Right */
        .right-panel {
          padding: 48px 40px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
        }

        .form-card {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-header { display: flex; flex-direction: column; gap: 6px; }
        .form-title {
          font-size: 1.9rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: var(--text);
        }
        .form-sub { font-size: 0.88rem; color: var(--text2); font-weight: 400; }

        .fields { display: flex; flex-direction: column; gap: 22px; }

        .api-error {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--red-dim);
          border: 1px solid var(--red);
          border-radius: var(--radius);
          padding: 12px 16px;
          font-size: 0.82rem;
          color: var(--red);
          font-family: var(--mono);
        }

        .submit-btn {
          width: 100%;
          background: var(--accent);
          color: var(--bg);
          border: none;
          border-radius: var(--radius);
          padding: 15px 24px;
          font-family: var(--display);
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          background: #d4f53d;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(200,241,53,0.25);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-inner, .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(6,7,10,0.2);
          border-top-color: var(--bg);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>
    </div>
  )
}