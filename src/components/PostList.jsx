import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { getUserId } from '../auth'

function PostList() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const currentUserId = getUserId() // logged in user's ID from localStorage

    // Fetch posts once when component mounts
    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts') // GET /api/posts
            setPosts(response.data)
        } catch (err) {
            setError('Failed to load posts.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return
        try {
            await api.delete(`/posts/${id}`) // DELETE /api/posts/5
            // Remove from state without refetching — faster UX
            setPosts(posts.filter(p => p.id !== id))
        } catch (err) {
            alert('Failed to delete post.')
        }
    }

    // Format date — same as ToString("MMMM dd, yyyy") in Razor
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })

    // Truncate content for card preview
    const truncate = (text, length = 160) =>
        text.length > length ? text.slice(0, length) + '…' : text

    if (loading) return <div className="container"><p className="loading">Loading...</p></div>
    if (error)   return <div className="container"><p className="loading">{error}</p></div>

    return (
        <div className="container">
            <div className="page-header">
                <div><h1>Writing</h1></div>
                {/* Only show New Post button when logged in */}
                {currentUserId && (
                    <button className="btn btn-primary" onClick={() => navigate('/create')}>
                        + New Post
                    </button>
                )}
            </div>

            {posts.length === 0 ? (
                <div className="empty-state">
                    <h2>Nothing here yet.</h2>
                    {currentUserId && (
                        <button className="btn btn-ghost" onClick={() => navigate('/create')}>
                            Write the first post
                        </button>
                    )}
                </div>
            ) : (
                posts.map(post => (
                    <div key={post.id} className="post-card">
                        <div>
                            <h2
                                className="post-card-title"
                                onClick={() => navigate(`/posts/${post.id}`)}
                            >
                                {post.title}
                            </h2>
                            <p className="post-card-excerpt">{truncate(post.content)}</p>
                            <span className="post-card-meta">{formatDate(post.createdAt)}</span>
                        </div>

                        {/* Only show Edit and Delete if this post belongs to the logged in user */}
                        {currentUserId && post.userId === currentUserId && (
                            <div className="post-card-actions">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => navigate(`/edit/${post.id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}

export default PostList