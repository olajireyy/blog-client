import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { isLoggedIn } from '../auth'

function PostForm() {
    const { id } = useParams()      // present on /edit/:id, absent on /create
    const navigate = useNavigate()
    const isEditing = Boolean(id)   // true if editing, false if creating

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    // Redirect to login if not logged in — can't create or edit without auth
    useEffect(() => {
        if (!isLoggedIn()) navigate('/login')
    }, [])

    // If editing, pre-fill the form with the existing post data
    useEffect(() => {
        if (isEditing) {
            api.get(`/posts/${id}`)
                .then(res => {
                    setTitle(res.data.title)     // pre-fill title field
                    setContent(res.data.content) // pre-fill content field
                })
                .catch(() => navigate('/')) // post not found — go home
        }
    }, [id])

    // Client-side validation before hitting the API
    const validate = () => {
        const errs = {}
        if (!title.trim())        errs.title = 'Title is required.'
        if (!content.trim())      errs.content = 'Content is required.'
        if (title.length > 200)   errs.title = 'Title must be under 200 characters.'
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault() // prevent default browser form submission

        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs) // show errors under the fields
            return
        }

        setSubmitting(true)

        try {
            if (isEditing) {
                // PUT /api/posts/5 — update existing post
                await api.put(`/posts/${id}`, { title, content })
            } else {
                // POST /api/posts — create new post
                // Token is attached automatically by the axios interceptor in api.js
                await api.post('/posts', { title, content })
            }
            navigate('/') // success — go back to list
        } catch (err) {
            // 403 means trying to edit someone else's post
            if (err.response?.status === 403) {
                setErrors({ general: 'You can only edit your own posts.' })
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' })
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="container">
            <div className="form-page">

                {/* Title changes based on create vs edit */}
                <h1>{isEditing ? 'Edit Post' : 'New Post'}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        {/* Controlled input — value always in sync with state */}
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Post title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        {errors.title && <p className="form-error">{errors.title}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content</label>
                        <textarea
                            className="form-input"
                            placeholder="Write something…"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        {errors.content && <p className="form-error">{errors.content}</p>}
                    </div>

                    {/* General error — shown for API failures or 403 */}
                    {errors.general && <p className="form-error">{errors.general}</p>}

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting} // prevent double submit
                        >
                            {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Publish'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate(-1)} // cancel — go back
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostForm
