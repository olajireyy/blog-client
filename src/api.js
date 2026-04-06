import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({
    baseURL: 'https://localhost:7173/api',
})

// Interceptor — runs before every request
// Automatically attaches the JWT token to the Authorization header
// Same as adding headers={'Authorization': f'Bearer {token}'} in every Django request
api.interceptors.request.use(config => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api