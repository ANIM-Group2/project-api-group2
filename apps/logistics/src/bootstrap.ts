// Runs before any module initializes — saves token from URL to localStorage
const params = new URLSearchParams(window.location.search)
const token  = params.get('token')
const role   = params.get('role')
if (token && role) {
  localStorage.setItem('aeronexis_token', token)
  localStorage.setItem('aeronexis_role',  role)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    localStorage.setItem('aeronexis_user', JSON.stringify({
      userId:    payload.userId,
      firstName: payload.firstName,
      lastName:  payload.lastName,
      email:     payload.email ?? '',
      role:      payload.role,
    }))
  } catch { /* ignore */ }
  window.history.replaceState({}, '', '/dashboard')
}