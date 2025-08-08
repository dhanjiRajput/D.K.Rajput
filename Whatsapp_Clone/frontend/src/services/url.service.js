import axios from 'axios';

const apiUrl=`${import.meta.env.VITE_BASE_URL}/api`;

const axiosInstance=axios.create({
    baseURL:apiUrl,
    withCredentials:true // FOr checking token
})

export default axiosInstance;