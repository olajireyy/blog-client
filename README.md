# Blog Client

A React frontend for the Blog API. Built with Vite, React Router, and Axios. Features JWT authentication, per-user post ownership, and a dark editorial design.

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- JWT (stored in localStorage)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Blog API](https://github.com/olajireyy/blog-api) running locally

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/olajireyy/blog-client.git
   cd blog-client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set the API base URL in `src/api.js`
   ```javascript
   const api = axios.create({
       baseURL: 'http://localhost:7174/api',
   })
   ```

4. Start the dev server
   ```bash
   npm run dev
   ```

App runs on `http://localhost:5173` by default.

## Features

- Browse all blog posts without logging in
- Register and login with email and password
- Create posts when logged in
- Edit and delete only your own posts
- JWT token persisted across page refreshes
- Ownership enforced on both the frontend and the API

## Pages

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | PostList | Public | All posts |
| `/posts/:id` | PostDetail | Public | Single post |
| `/create` | PostForm | Auth | Create a post |
| `/edit/:id` | PostForm | Owner | Edit a post |
| `/login` | AuthForm | Public | Login |
| `/register` | AuthForm | Public | Register |

## Project Structure

```
blog-client/
├── src/
│   ├── components/
│   │   ├── AuthForm.jsx      # Shared login and register form
│   │   ├── Navbar.jsx        # Navigation with auth state
│   │   ├── PostDetail.jsx    # Single post view
│   │   ├── PostForm.jsx      # Create and edit form
│   │   └── PostList.jsx      # All posts with ownership checks
│   ├── api.js                # Axios instance with JWT interceptor
│   ├── auth.js               # localStorage helpers for auth state
│   ├── App.jsx               # Routes
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Auth Flow

```
Register / Login
      │
      ▼
API returns { token, email, userId }
      │
      ▼
Stored in localStorage
      │
      ▼
Axios interceptor attaches token to every request
      │
      ▼
API validates token on protected routes
```

## Ownership Flow

```
Post created → userId saved to DB
User views post → React compares post.userId with stored userId
Match → Edit and Delete buttons shown
No match → Buttons hidden
Direct API call → API checks ownership → 403 if not owner
```

## Related

- [blog-api](https://github.com/olajireyy/blog-api) — ASP.NET Core API that powers this frontend
