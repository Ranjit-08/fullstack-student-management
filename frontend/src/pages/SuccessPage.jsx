import React, { useEffect, useState } from 'react'

export default function SuccessPage({ student, onRegisterAnother }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const batchLabel = {
    '07:30': 'Morning Batch — 07:30 AM',
    '09:00': 'Mid-Morning Batch — 09:00 AM',
    '10:30': 'Late Morning Batch — 10:30 AM',
  }[student.batch] || student.batch

  return (
    <div className={`success-page ${visible ? 'visible' : ''}`}>
      <div className="card">
        <div className="top-bar">
          <span className="tag">ENROLLMENT CONFIRMED</span>
          <span className="tag-id">#{String(student.id || '0001').padStart(4, '0')}</span>
        </div>

        <div className="checkmark-wrap">
          <svg className="checkmark" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="28" stroke="var(--accent)" strokeWidth="2" />
            <path className="check-path" d="M18 30 L26 38 L42 22" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="success-title">You're In,<br /><span>{student.name.split(' ')[0]}!</span></h1>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-key">BATCH</span>
            <span className="detail-val">{batchLabel}</span>
          </div>
          <div className="detail-item">
            <span className="detail-key">NAME</span>
            <span className="detail-val">{student.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-key">EMAIL</span>
            <span className="detail-val">{student.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-key">PHONE</span>
            <span className="detail-val">{student.phone}</span>
          </div>
        </div>

        <p className="note">
          A confirmation will be sent to your email. Please arrive 10 minutes before your batch starts.
        </p>

        <button className="back-btn" onClick={onRegisterAnother}>
          ← Register Another Student
        </button>
      </div>

      <style>{`
        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .success-page.visible { opacity: 1; transform: translateY(0); }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 48px 40px;
          max-width: 480px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          text-align: center;
        }

        .top-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          justify-content: space-between;
        }
        .tag {
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          color: var(--success);
          background: rgba(61,255,160,0.08);
          border: 1px solid rgba(61,255,160,0.2);
          padding: 4px 10px;
          border-radius: 4px;
        }
        .tag-id {
          font-size: 0.65rem;
          color: var(--muted);
          letter-spacing: 0.1em;
        }

        .checkmark-wrap {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .checkmark { width: 60px; height: 60px; }
        .check-path {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: drawCheck 0.5s ease 0.3s forwards;
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }

        .success-title {
          font-family: var(--display);
          font-size: 2.4rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--text);
        }
        .success-title span { color: var(--accent); }

        .details-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          text-align: left;
        }
        .detail-item {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-key {
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: var(--muted);
        }
        .detail-val {
          font-size: 0.82rem;
          color: var(--text);
          font-weight: 700;
          word-break: break-word;
        }

        .note {
          font-size: 0.72rem;
          color: var(--muted);
          line-height: 1.6;
          max-width: 340px;
        }

        .back-btn {
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 12px 24px;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--muted);
          cursor: pointer;
          letter-spacing: 0.06em;
          transition: border-color 0.2s, color 0.2s;
        }
        .back-btn:hover { border-color: var(--accent); color: var(--accent); }
      `}</style>
    </div>
  )
}