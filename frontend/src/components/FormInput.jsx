import React from 'react'

export default function FormInput({ label, index, type = 'text', name, value, onChange, placeholder, error }) {
  return (
    <div className="input-group">
      <label className="field-label" htmlFor={name}>
        <span className="step-badge">{String(index).padStart(2, '0')}</span>
        {label}
      </label>
      <div className={`input-wrap ${error ? 'has-error' : ''} ${value ? 'has-value' : ''}`}>
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
      </div>
      {error && <p className="field-error">⚠ {error}</p>}

      <style>{`
        .input-group { display: flex; flex-direction: column; gap: 8px; }

        .field-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text2);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .step-badge {
          width: 22px; height: 22px;
          background: var(--surface2);
          border: 1px solid var(--border2);
          color: var(--text3);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem;
          font-family: var(--mono);
          font-weight: 500;
          flex-shrink: 0;
        }

        .input-wrap {
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          background: var(--surface);
          transition: all 0.2s;
        }
        .input-wrap:focus-within {
          border-color: var(--accent);
          background: var(--surface2);
          box-shadow: 0 0 0 3px rgba(200,241,53,0.08);
        }
        .input-wrap.has-error { border-color: var(--red); }
        .input-wrap.has-value:not(:focus-within) { border-color: var(--border2); }

        .input-wrap input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 13px 16px;
          font-family: var(--display);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text);
        }
        .input-wrap input::placeholder {
          color: var(--text3);
          font-weight: 400;
        }

        .field-error {
          font-size: 0.72rem;
          color: var(--red);
          font-family: var(--mono);
        }
      `}</style>
    </div>
  )
}