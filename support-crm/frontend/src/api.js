const API_URL = import.meta.env.VITE_API_URL

export async function getTickets() {
  const res = await fetch(`${API_URL}/tickets`)
  return res.json()
}
