import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { saveToken } from '../auth'

function AuthForm({ mode }) {
    // mode is 'login' or 'register' — passed in from the route in App.jsx
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault() // prevent default browser form submission
        setError('')
        setSubmitting(true)

        try {
            // Calls either POST /api/auth/login or POST /api/auth/register
            const response = await api.post(`/auth/${mode}`, { email, password })

            // Save token, email, and userId to localStorage
            // userId is used later to check which posts the user can edit/delete
            saveToken(
                response.data.token,
                response.data.email,
                response.data.userId
            )

            navigate('/') // logged in — go to posts list
        } catch (err) {
            // Show the error message returned by the API if available
            setError(err.response?.data?.message || 'Something went wrong.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="container">
            <div className="form-page">
                <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        {/* Controlled input — value always in sync with state */}
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Show API error if present */}
                    {error && <p className="form-error">{error}</p>}

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting} // prevent double submit
                        >
                            {submitting
                                ? 'Please wait…'
                                : mode === 'login' ? 'Login' : 'Register'}
                        </button>
                        {/* Switch between login and register */}
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate(mode === 'login' ? '/register' : '/login')}
                        >
                            {mode === 'login' ? 'Create an account' : 'Already have an account?'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AuthForm