import { Link, useNavigate } from 'react-router-dom'
import { isLoggedIn, getEmail, clearToken } from '../auth'

function Navbar() {
    const navigate = useNavigate()
    const loggedIn = isLoggedIn() // check localStorage for token

    const handleLogout = () => {
        clearToken()              // remove token, email, userId from localStorage
        navigate('/')             // go home
        window.location.reload()  // reload to reset all component state
    }

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-inner">

                    {/* Brand — always visible */}
                    <Link to="/" className="navbar-brand">
                        The<span>.</span>Blog
                    </Link>

                    <ul className="navbar-links">
                        <li><Link to="/">Writing</Link></li>

                        {loggedIn ? (
                            <>
                                {/* Only show New Post when logged in */}
                                <li><Link to="/create">New Post</Link></li>

                                {/* Show logged in user's email */}
                                <li style={{
                                    color: 'var(--accent)',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em'
                                }}>
                                    {getEmail()}
                                </li>

                                <li>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)',
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* Show Login and Register when logged out */}
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar