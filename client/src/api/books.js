const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"

export async function fetchBookById(bookId, options = {}) {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
    ...options
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}
