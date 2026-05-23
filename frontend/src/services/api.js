import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export const registerStudent = async (studentData) => {
  const response = await api.post('/students/register', studentData)
  return response.data
}

export const getStudents = async () => {
  const response = await api.get('/students')
  return response.data
}

export default api