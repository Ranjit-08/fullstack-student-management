import React from 'react'

export default function FormInput({ label, index, type = 'text', name, value, onChange, placeholder, error }) {
  return (
    <div className="input-group">
      <label className="field-label" htmlFor={name}>
        <span className="label-prefix">{String(index).padStart(2, '0')} /</span> {label.toUpperCase()}
      </label>
      <div className={`input-wrap ${error ? 'has-error' : ''}`}>
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
        />
        <span className="input-cursor" />
      </div>
      {error && <p className="field-error">⚠ {error}</p>}

      <style>{`
        .input-group { display: flex; flex-direction: column; gap: 8px; }

        .field-label {
          font-family: var(--mono);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--muted);
          text-transform: uppercase;
        }
        .label-prefix { color: var(--accent); margin-right: 6px; }

        .input-wrap {
          position: relative;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--surface);
          transition: border-color 0.2s;
          display: flex;
          align-items: center;
        }

        .input-wrap:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(232,255,71,0.08);
        }

        .input-wrap.has-error { border-color: var(--danger); }

        .input-wrap input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 14px 16px;
          font-family: var(--mono);
          font-size: 0.9rem;
          color: var(--text);
          letter-spacing: 0.03em;
        }

        .input-wrap input::placeholder { color: var(--muted); }

        .field-error {
          font-size: 0.68rem;
          color: var(--danger);
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}