import React, { useEffect, useState } from 'react'
import { getStudents, deleteStudent } from '../services/api.js'

const BATCH_COLORS = {
  '07:30': { bg: 'rgba(200,241,53,0.08)', border: 'rgba(200,241,53,0.25)', text: '#c8f135' },
  '09:00': { bg: 'rgba(79,142,255,0.08)', border: 'rgba(79,142,255,0.25)', text: '#4f8eff' },
  '10:30': { bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.25)', text: '#f5a623' },
}

const BATCH_LABELS = {
  '07:30': 'Morning',
  '09:00': 'Mid-Morning',
  '10:30': 'Late Morning',
}

export default function StudentsPage() {
  const [students, setStudents]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [filter, setFilter]         = useState('all')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId]   = useState(null)
  const [search, setSearch]         = useState('')

  const fetchStudents = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getStudents()
      setStudents(data.data || [])
    } catch {
      setError('Failed to load students. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteStudent(id)
      setStudents(s => s.filter(x => x.id !== id))
      setConfirmId(null)
    } catch {
      alert('Delete failed. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = students.filter(s => {
    const matchBatch  = filter === 'all' || s.batch === filter
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
    return matchBatch && matchSearch
  })

  const counts = {
    all:     students.length,
    '07:30': students.filter(s => s.batch === '07:30').length,
    '09:00': students.filter(s => s.batch === '09:00').length,
    '10:30': students.filter(s => s.batch === '10:30').length,
  }

  return (
    <div className="sp-page">
      {/* Header */}
      <div className="sp-header">
        <div className="sp-header-left">
          <h1 className="sp-title">Students</h1>
          <span className="sp-count">{students.length} enrolled</span>
        </div>
        <button className="refresh-btn" onClick={fetchStudents} disabled={loading}>
          <svg className={loading ? 'spinning' : ''} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.65 2.35A8 8 0 1 0 15 8h-2a6 6 0 1 1-1.07-3.43L9 7h6V1l-1.35 1.35z" fill="currentColor"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="sp-stats">
        {[
          { label: 'Total', value: counts.all, color: 'var(--text)' },
          { label: '07:30 AM', value: counts['07:30'], color: '#c8f135' },
          { label: '09:00 AM', value: counts['09:00'], color: '#4f8eff' },
          { label: '10:30 AM', value: counts['10:30'], color: '#f5a623' },
        ].map(stat => (
          <div className="stat-card" key={stat.label}>
            <span className="stat-num" style={{ color: stat.color }}>{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="sp-controls">
        <div className="filter-tabs">
          {['all', '07:30', '09:00', '10:30'].map(b => (
            <button
              key={b}
              className={`filter-tab ${filter === b ? 'active' : ''}`}
              onClick={() => setFilter(b)}
            >
              {b === 'all' ? 'All Batches' : `${b} AM`}
              <span className="tab-count">{counts[b] ?? counts.all}</span>
            </button>
          ))}
        </div>
        <div className="search-wrap">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="var(--text3)" strokeWidth="1.3"/><path d="M10.5 10.5L13.5 13.5" stroke="var(--text3)" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <input
            className="search-input"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>×</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="sp-table-wrap">
        {loading ? (
          <div className="sp-empty">
            <div className="loader" />
            <p>Loading students...</p>
          </div>
        ) : error ? (
          <div className="sp-empty error">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="var(--red)" strokeWidth="1.5"/><path d="M16 10v7M16 20v2" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchStudents}>Try Again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="sp-empty">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="18" rx="2" stroke="var(--text3)" strokeWidth="1.5"/><path d="M10 14h12M10 19h8" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <p>{search ? 'No students match your search.' : 'No students in this batch yet.'}</p>
          </div>
        ) : (
          <table className="sp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Batch</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const bc = BATCH_COLORS[s.batch] || {}
                const date = new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                return (
                  <tr key={s.id} className="sp-row" style={{ animationDelay: `${i * 0.04}s` }}>
                    <td className="td-id">#{String(s.id).padStart(3, '0')}</td>
                    <td className="td-name">
                      <div className="student-avatar">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{s.name}</span>
                    </td>
                    <td className="td-email">{s.email}</td>
                    <td className="td-phone">{s.phone}</td>
                    <td>
                      <span className="batch-tag" style={{ background: bc.bg, border: `1px solid ${bc.border}`, color: bc.text }}>
                        {s.batch} · {BATCH_LABELS[s.batch]}
                      </span>
                    </td>
                    <td className="td-date">{date}</td>
                    <td>
                      {confirmId === s.id ? (
                        <div className="confirm-wrap">
                          <span className="confirm-text">Sure?</span>
                          <button
                            className="confirm-yes"
                            onClick={() => handleDelete(s.id)}
                            disabled={deletingId === s.id}
                          >
                            {deletingId === s.id ? '...' : 'Yes'}
                          </button>
                          <button className="confirm-no" onClick={() => setConfirmId(null)}>No</button>
                        </div>
                      ) : (
                        <button className="delete-btn" onClick={() => setConfirmId(s.id)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M6 6.5v3M8 6.5v3M3 3.5l.7 7.5a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9L11 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .sp-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeIn 0.35s ease;
        }

        /* Header */
        .sp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sp-header-left { display: flex; align-items: baseline; gap: 12px; }
        .sp-title {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: var(--text);
        }
        .sp-count {
          font-size: 0.8rem;
          color: var(--text3);
          font-family: var(--mono);
          font-weight: 400;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: var(--radius);
          padding: 9px 16px;
          font-family: var(--display);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text2);
          cursor: pointer;
          transition: all 0.2s;
        }
        .refresh-btn:hover { border-color: var(--text2); color: var(--text); }
        .refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinning { animation: spin 0.8s linear infinite; }

        /* Stats */
        .sp-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 600px) { .sp-stats { grid-template-columns: repeat(2, 1fr); } }
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-num {
          font-family: var(--display);
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .stat-label { font-size: 0.72rem; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

        /* Controls */
        .sp-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filter-tabs { display: flex; gap: 4px; }
        .filter-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
          padding: 7px 14px;
          font-family: var(--display);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text3);
          cursor: pointer;
          transition: all 0.15s;
        }
        .filter-tab:hover { color: var(--text2); background: var(--surface); }
        .filter-tab.active {
          color: var(--accent);
          background: var(--accent-glow);
          border-color: rgba(200,241,53,0.2);
        }
        .tab-count {
          background: var(--surface2);
          color: var(--text3);
          border-radius: 100px;
          padding: 1px 7px;
          font-size: 0.68rem;
          font-family: var(--mono);
        }
        .filter-tab.active .tab-count { background: rgba(200,241,53,0.15); color: var(--accent); }

        .search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 8px 14px;
          min-width: 240px;
          transition: border-color 0.2s;
        }
        .search-wrap:focus-within { border-color: var(--border2); }
        .search-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--display);
          font-size: 0.85rem;
          color: var(--text);
          width: 100%;
        }
        .search-input::placeholder { color: var(--text3); }
        .search-clear {
          background: none;
          border: none;
          color: var(--text3);
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
        }
        .search-clear:hover { color: var(--text); }

        /* Table */
        .sp-table-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          overflow-x: auto;
        }

        .sp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          color: var(--text3);
          font-size: 0.88rem;
        }
        .sp-empty.error { color: var(--red); }

        .loader {
          width: 28px; height: 28px;
          border: 2px solid var(--border2);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .retry-btn {
          background: var(--surface2);
          border: 1px solid var(--border2);
          border-radius: var(--radius-sm);
          padding: 7px 16px;
          font-family: var(--display);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text2);
          cursor: pointer;
          margin-top: 4px;
        }

        .sp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .sp-table thead tr {
          border-bottom: 1px solid var(--border);
        }
        .sp-table th {
          padding: 13px 16px;
          text-align: left;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .sp-row {
          border-bottom: 1px solid var(--border);
          animation: slideIn 0.3s ease both;
          transition: background 0.15s;
        }
        .sp-row:last-child { border-bottom: none; }
        .sp-row:hover { background: var(--surface2); }

        .sp-table td {
          padding: 14px 16px;
          color: var(--text2);
          vertical-align: middle;
          white-space: nowrap;
        }

        .td-id { font-family: var(--mono); font-size: 0.75rem; color: var(--text3); }

        .td-name {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text);
          font-weight: 700;
        }
        .student-avatar {
          width: 30px; height: 30px;
          background: var(--accent-glow);
          border: 1px solid rgba(200,241,53,0.2);
          color: var(--accent);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .td-email { color: var(--text2); font-size: 0.82rem; }
        .td-phone { font-family: var(--mono); font-size: 0.8rem; color: var(--text2); }
        .td-date { font-size: 0.78rem; color: var(--text3); font-family: var(--mono); }

        .batch-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .delete-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid var(--border2);
          border-radius: var(--radius-sm);
          padding: 6px 12px;
          font-family: var(--display);
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text3);
          cursor: pointer;
          transition: all 0.15s;
        }
        .delete-btn:hover {
          border-color: var(--red);
          color: var(--red);
          background: var(--red-dim);
        }

        .confirm-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .confirm-text { font-size: 0.76rem; color: var(--red); font-weight: 600; }
        .confirm-yes, .confirm-no {
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          font-family: var(--display);
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
        }
        .confirm-yes { background: var(--red); color: white; }
        .confirm-yes:disabled { opacity: 0.6; cursor: not-allowed; }
        .confirm-no { background: var(--surface2); color: var(--text2); border: 1px solid var(--border2); }
      `}</style>
    </div>
  )
}