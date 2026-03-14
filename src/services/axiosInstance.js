import axios from 'axios';
import useAuthStore from '../store/authStore';

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

// 2. RESPONSE INTERCEPTOR (CÁI MỚI THÊM VÀO): Xử lý khi Token hết hạn
axiosInstance.interceptors.response.use(
    (response) => {
        return response; // Nếu API gọi thành công thì cho qua
    },
    (error) => {
        // NẾU BACKEND TRẢ VỀ LỖI 401 (Chưa đăng nhập) HOẶC 403 (Hết hạn Token / Sai quyền)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Token hết hạn hoặc không hợp lệ. Đang đăng xuất...');

            // Gọi hàm logout trong Zustand để xóa state và xóa localStorage
            useAuthStore.getState().logout();

            // Đá văng ra màn hình Login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;