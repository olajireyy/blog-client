import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import PostForm from './components/PostForm'
import AuthForm from './components/AuthForm'

function App() {
    return (
        <div>
            {/* Navbar renders on every page */}
            <Navbar />

            {/* Routes renders whichever component matches the current URL */}
            <Routes>
                <Route path="/"          element={<PostList />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/create"    element={<PostForm />} />
                <Route path="/edit/:id"  element={<PostForm />} />
                <Route path="/login"     element={<AuthForm mode="login" />} />
                <Route path="/register"  element={<AuthForm mode="register" />} />
            </Routes>
        </div>
    )
}

export default App