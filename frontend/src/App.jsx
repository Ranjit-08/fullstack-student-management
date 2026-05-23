import React, { useState } from 'react'
import RegistrationPage from './pages/RegistrationPage.jsx'
import SuccessPage from './pages/SuccessPage.jsx'
import StudentsPage from './pages/StudentsPage.jsx'

export default function App() {
  const [page, setPage] = useState('register')
  const [registeredStudent, setRegisteredStudent] = useState(null)

  const handleSuccess = (student) => {
    setRegisteredStudent(student)
    setPage('success')
  }

  return (
    <>
      {/* Top Nav */}
      <nav className="topnav">
        <div className="nav-logo">
          <span className="nav-logo-mark">EB</span>
          <span className="nav-logo-text">EduBatch</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-btn ${page === 'register' || page === 'success' ? 'active' : ''}`}
            onClick={() => setPage('register')}
          >
            Register
          </button>
          <button
            className={`nav-btn ${page === 'students' ? 'active' : ''}`}
            onClick={() => setPage('students')}
          >
            Students
          </button>
        </div>
      </nav>

      {/* Pages */}
      {(page === 'register') && <RegistrationPage onSuccess={handleSuccess} />}
      {(page === 'success') && (
        <SuccessPage
          student={registeredStudent}
          onRegisterAnother={() => setPage('register')}
          onViewStudents={() => setPage('students')}
        />
      )}
      {(page === 'students') && <StudentsPage />}

      <style>{`
        .topnav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 60px;
          background: rgba(6,7,10,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }

        .nav-logo { display: flex; align-items: center; gap: 10px; }

        .nav-logo-mark {
          width: 32px; height: 32px;
          background: var(--accent);
          color: var(--bg);
          font-family: var(--display);
          font-weight: 900;
          font-size: 0.75rem;
          display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-sm);
          letter-spacing: -0.02em;
        }

        .nav-logo-text {
          font-family: var(--display);
          font-weight: 800;
          font-size: 1rem;
          color: var(--text);
          letter-spacing: -0.01em;
        }

        .nav-links { display: flex; gap: 4px; }

        .nav-btn {
          background: transparent;
          border: none;
          padding: 7px 16px;
          font-family: var(--display);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text2);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: color 0.2s, background 0.2s;
          letter-spacing: -0.01em;
        }
        .nav-btn:hover { color: var(--text); background: var(--surface); }
        .nav-btn.active { color: var(--accent); background: var(--accent-glow); }
      `}</style>
    </>
  )
}