import axios from 'axios'
const requests = axios.create({
    baseURL: '/api'
        // baseURL: '/api'
})
requests.interceptors.request.use(config => {
    return config;
})
requests.interceptors.response.use(res => {
    return res.data;
})
export default requests