import React, { useEffect, useState } from 'react'

export default function SuccessPage({ student, onRegisterAnother, onViewStudents }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const batchLabel = {
    '07:30': '07:30 AM — Morning Batch',
    '09:00': '09:00 AM — Mid-Morning Batch',
    '10:30': '10:30 AM — Late Morning Batch',
  }[student.batch] || student.batch

  return (
    <div className={`success-page ${visible ? 'visible' : ''}`}>
      <div className="success-card">
        <div className="success-top">
          <div className="success-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="22" stroke="var(--accent)" strokeWidth="2"/>
              <path className="check" d="M14 24L21 31L34 17" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="success-badge">Enrollment Confirmed</div>
        </div>

        <div className="success-body">
          <h1 className="success-title">
            Welcome aboard,<br/>
            <span>{student.name.split(' ')[0]}!</span>
          </h1>
          <p className="success-desc">Your registration is complete. See you in class!</p>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <span className="detail-key">Batch Time</span>
            <span className="detail-val accent">{batchLabel}</span>
          </div>
          <div className="detail-card">
            <span className="detail-key">Student ID</span>
            <span className="detail-val mono">#{String(student.id || '0001').padStart(4, '0')}</span>
          </div>
          <div className="detail-card">
            <span className="detail-key">Full Name</span>
            <span className="detail-val">{student.name}</span>
          </div>
          <div className="detail-card">
            <span className="detail-key">Email</span>
            <span className="detail-val">{student.email}</span>
          </div>
          <div className="detail-card full">
            <span className="detail-key">Phone</span>
            <span className="detail-val">{student.phone}</span>
          </div>
        </div>

        <div className="success-actions">
          <button className="action-btn primary" onClick={onViewStudents}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            View All Students
          </button>
          <button className="action-btn secondary" onClick={onRegisterAnother}>
            Register Another
          </button>
        </div>
      </div>

      <style>{`
        .success-page {
          min-height: calc(100vh - 60px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .success-page.visible { opacity: 1; transform: translateY(0); }

        .success-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 44px;
          max-width: 500px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 32px;
          box-shadow: var(--shadow-lg);
        }

        .success-top { display: flex; align-items: center; gap: 16px; }

        .success-icon { width: 52px; height: 52px; flex-shrink: 0; }
        .success-icon svg { width: 100%; height: 100%; }
        .check {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: drawCheck 0.5s ease 0.3s forwards;
        }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }

        .success-badge {
          background: var(--green-dim);
          border: 1px solid rgba(46,204,143,0.25);
          color: var(--green);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
        }

        .success-title {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: var(--text);
        }
        .success-title span { color: var(--accent); }
        .success-desc { font-size: 0.9rem; color: var(--text2); margin-top: 8px; }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .detail-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .detail-card.full { grid-column: 1 / -1; }
        .detail-key { font-size: 0.68rem; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
        .detail-val { font-size: 0.88rem; color: var(--text); font-weight: 700; word-break: break-word; }
        .detail-val.accent { color: var(--accent); }
        .detail-val.mono { font-family: var(--mono); font-size: 0.9rem; color: var(--blue); }

        .success-actions { display: flex; gap: 10px; }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 20px;
          border-radius: var(--radius);
          font-family: var(--display);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .action-btn.primary {
          background: var(--accent);
          color: var(--bg);
        }
        .action-btn.primary:hover {
          background: #d4f53d;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(200,241,53,0.2);
        }
        .action-btn.secondary {
          background: var(--surface2);
          color: var(--text2);
          border: 1px solid var(--border2);
        }
        .action-btn.secondary:hover {
          border-color: var(--text2);
          color: var(--text);
        }
      `}</style>
    </div>
  )
}