import React from 'react'

const BATCHES = [
  { id: '07:30', label: '07:30', sub: 'Morning Batch', icon: '◐' },
  { id: '09:00', label: '09:00', sub: 'Mid-Morning Batch', icon: '○' },
  { id: '10:30', label: '10:30', sub: 'Late Morning Batch', icon: '◑' },
]

export default function BatchSelector({ value, onChange, error }) {
  return (
    <div className="batch-group">
      <label className="field-label">
        <span className="label-prefix">01 /</span> SELECT BATCH TIMING
      </label>
      <div className="batch-cards">
        {BATCHES.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`batch-card ${value === b.id ? 'active' : ''}`}
            onClick={() => onChange(b.id)}
          >
            <span className="batch-icon">{b.icon}</span>
            <span className="batch-time">{b.label}</span>
            <span className="batch-sub">{b.sub}</span>
            {value === b.id && <span className="batch-check">✓</span>}
          </button>
        ))}
      </div>
      {error && <p className="field-error">{error}</p>}

      <style>{`
        .batch-group { display: flex; flex-direction: column; gap: 10px; }

        .field-label {
          font-family: var(--mono);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--muted);
          text-transform: uppercase;
        }
        .label-prefix { color: var(--accent); margin-right: 6px; }

        .batch-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        @media (max-width: 480px) {
          .batch-cards { grid-template-columns: 1fr; }
        }

        .batch-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          text-align: left;
        }

        .batch-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .batch-card.active {
          border-color: var(--accent);
          background: rgba(232,255,71,0.06);
        }

        .batch-icon {
          font-size: 1.4rem;
          color: var(--accent);
          line-height: 1;
        }

        .batch-time {
          font-family: var(--display);
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
        }

        .batch-sub {
          font-size: 0.65rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .batch-check {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 20px;
          height: 20px;
          background: var(--accent);
          color: var(--bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
        }

        .field-error {
          font-size: 0.7rem;
          color: var(--danger);
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}