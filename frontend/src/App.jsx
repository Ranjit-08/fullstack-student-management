import React, { useState } from 'react'
import RegistrationPage from './pages/RegistrationPage.jsx'
import SuccessPage from './pages/SuccessPage.jsx'

export default function App() {
  const [page, setPage] = useState('register')
  const [registeredStudent, setRegisteredStudent] = useState(null)

  const handleSuccess = (student) => {
    setRegisteredStudent(student)
    setPage('success')
  }

  const handleRegisterAnother = () => {
    setRegisteredStudent(null)
    setPage('register')
  }

  return (
    <>
      {page === 'register' && (
        <RegistrationPage onSuccess={handleSuccess} />
      )}
      {page === 'success' && (
        <SuccessPage student={registeredStudent} onRegisterAnother={handleRegisterAnother} />
      )}
    </>
  )
}