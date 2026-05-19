const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export async function getTickets(status = '', search = '') {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (search) params.append('search', search)
  const res = await fetch(`${API_URL}/tickets?${params}`)
  if (!res.ok) throw new Error('Failed to fetch tickets')
  return res.json()
}

export async function getTicket(ticketId) {
  const res = await fetch(`${API_URL}/tickets/${ticketId}`)
  if (!res.ok) throw new Error('Ticket not found')
  return res.json()
}

export async function createTicket(data) {
  const res = await fetch(`${API_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to create ticket')
  }
  return res.json()
}

export async function updateTicket(ticketId, data) {
  const res = await fetch(`${API_URL}/tickets/${ticketId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to update ticket')
  }
  return res.json()
}
