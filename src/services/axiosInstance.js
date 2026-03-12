import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // URL gốc của Spring Boot
    timeout: 10000, // Call API quá 10s thì báo lỗi
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTOR: Kẻ gác cổng trước khi gửi Request
axiosInstance.interceptors.request.use(
    (config) => {
        // Lấy token từ két sắt LocalStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Nếu có token, nhét vào Header Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;