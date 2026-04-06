// Save token, email, and userId to localStorage after login or register
// localStorage persists across page refreshes — unlike React state
export const saveToken = (token, email, userId) => {
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)
    localStorage.setItem('userId', userId) // used to check post ownership in React
}

// Remove all auth data on logout
export const clearToken = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('userId')
}

// Read the token — attached to every API request by the axios interceptor
export const getToken = () => localStorage.getItem('token')

// Check if user is logged in — used in Navbar and to show/hide buttons
export const isLoggedIn = () => Boolean(getToken())

// Get logged in user's email — shown in the Navbar
export const getEmail = () => localStorage.getItem('email')

// Get logged in user's ID — compared against post.userId to show/hide Edit and Delete
export const getUserId = () => {
    const id = localStorage.getItem('userId')
    return id ? parseInt(id) : null // parse to int so === comparison works correctly
}