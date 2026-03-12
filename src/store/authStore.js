import { create } from 'zustand';

const useAuthStore = create((set) => ({
    // Trạng thái ban đầu: Lấy từ LocalStorage xem trước đó có đăng nhập chưa
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    // Hàm xử lý khi Đăng nhập thành công
    login: (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        set({ user: userData, token, isAuthenticated: true });
    },

    // Hàm xử lý khi Đăng xuất
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;