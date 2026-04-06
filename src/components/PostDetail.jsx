import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { getUserId } from '../auth'

function PostDetail() {
    const { id } = useParams()     // reads :id from the URL
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    const currentUserId = getUserId() // logged in user's ID from localStorage

    // Re-fetch if the id in the URL changes
    useEffect(() => {
        fetchPost()
    }, [id])

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${id}`) // GET /api/posts/5
            setPost(response.data)
        } catch (err) {
            navigate('/') // post not found — go home
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Delete this post?')) return
        try {
            await api.delete(`/posts/${id}`) // DELETE /api/posts/5
            navigate('/')                    // after delete go back to list
        } catch (err) {
            alert('Failed to delete post.')
        }
    }

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })

    if (loading) return <div className="container"><p className="loading">Loading...</p></div>
    if (!post)   return null

    // Check if the logged in user owns this post
    const isOwner = currentUserId && post.userId === currentUserId

    return (
        <div className="container">
            <div className="post-detail">

                {/* navigate(-1) goes to the previous page — like browser back button */}
                <div className="back-link" onClick={() => navigate(-1)}>
                    ← All posts
                </div>

                <h1>{post.title}</h1>
                <p className="byline">{formatDate(post.createdAt)}</p>
                <p className="body">{post.content}</p>

                {/* Only show Edit and Delete if this post belongs to the logged in user */}
                {isOwner && (
                    <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            className="btn btn-ghost"
                            onClick={() => navigate(`/edit/${post.id}`)}
                        >
                            Edit
                        </button>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default PostDetail