import React from 'react'

const BATCHES = [
  { id: '07:30', label: '07:30', sub: 'Morning', icon: '🌅' },
  { id: '09:00', label: '09:00', sub: 'Mid-Morning', icon: '☀️' },
  { id: '10:30', label: '10:30', sub: 'Late Morning', icon: '🌤️' },
]

export default function BatchSelector({ value, onChange, error }) {
  return (
    <div className="batch-group">
      <label className="field-label">
        <span className="step-badge">01</span>
        Select Batch Timing
      </label>
      <div className="batch-cards">
        {BATCHES.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`batch-card ${value === b.id ? 'active' : ''}`}
            onClick={() => onChange(b.id)}
          >
            <span className="batch-emoji">{b.icon}</span>
            <span className="batch-time">{b.label}</span>
            <span className="batch-sub">{b.sub}</span>
            {value === b.id && <span className="batch-check">✓</span>}
          </button>
        ))}
      </div>
      {error && <p className="field-error">⚠ {error}</p>}

      <style>{`
        .batch-group { display: flex; flex-direction: column; gap: 10px; }

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
          background: var(--accent-glow);
          border: 1px solid var(--accent);
          color: var(--accent);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem;
          font-family: var(--mono);
          font-weight: 500;
          flex-shrink: 0;
        }

        .batch-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        @media (max-width: 500px) {
          .batch-cards { grid-template-columns: 1fr; }
        }

        .batch-card {
          position: relative;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 20px 16px 16px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
          transition: all 0.2s ease;
          text-align: left;
        }
        .batch-card:hover {
          border-color: var(--accent);
          background: var(--surface2);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(200,241,53,0.08);
        }
        .batch-card.active {
          border-color: var(--accent);
          background: var(--accent-glow);
          box-shadow: 0 0 0 1px var(--accent), 0 8px 24px rgba(200,241,53,0.1);
        }

        .batch-emoji { font-size: 1.4rem; line-height: 1; margin-bottom: 2px; }

        .batch-time {
          font-family: var(--display);
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--text);
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .batch-sub {
          font-size: 0.7rem;
          color: var(--text3);
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        .batch-check {
          position: absolute;
          top: 10px; right: 10px;
          width: 22px; height: 22px;
          background: var(--accent);
          color: var(--bg);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
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