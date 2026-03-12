import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, Dumbbell } from 'lucide-react';
import { create } from 'zustand';
import axios from 'axios';

// --- MOCK CÁC DEPENDENCY ĐỂ PREVIEW UI HOẠT ĐỘNG ---
// 1. Mock Zustand Store
const useAuthStore = create((set) => ({
    user: null,
    login: (userData, token) => set({ user: userData }),
}));

// 2. Mock Axios Instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});
// ----------------------------------------------------

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dùng Window.location.href thay cho useNavigate để tránh lỗi khi không nằm trong Router ở chế độ Preview
    const handleNavigate = () => {
        // Trong code thật, đoạn này sẽ là: navigate('/');
        console.log("Navigating to dashboard...");
        alert("Đăng nhập thành công! (Mô phỏng chuyển hướng)");
    };

    const loginFn = useAuthStore((state) => state.login);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Gọi API xuống Spring Boot (Cổng 8080)
            const response = await axiosInstance.post('/auth/login', {
                username,
                password
            });

            const { token, role, username: resUsername } = response.data.data;

            // Cất Token vào két sắt Zustand
            loginFn({ username: resUsername, role }, token);

            // Chuyển hướng vào trang chủ
            handleNavigate();

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Sai tên đăng nhập hoặc mật khẩu!');
            } else {
                setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            {/* Thẻ Form đăng nhập */}
            <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">

                {/* Logo & Tiêu đề */}
                <div className="text-center mb-8">
                    <div className="mx-auto bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                        <Dumbbell className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white">FitLife Gym</h2>
                    <p className="text-gray-400 mt-2">Đăng nhập để bắt đầu tập luyện</p>
                </div>

                {/* Thông báo lỗi (nếu có) */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Input Tài khoản */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tên đăng nhập</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Nhập username của bạn"
                            />
                        </div>
                    </div>

                    {/* Input Mật khẩu */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-300">Mật khẩu</label>
                            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Quên mật khẩu?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Nút Đăng nhập */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <LogIn className="w-5 h-5 mr-2" />
                        )}
                        {isLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                    </button>
                </form>

                {/* Đăng ký */}
                <p className="mt-8 text-center text-sm text-gray-400">
                    Chưa có tài khoản?{' '}
                    <a href="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Đăng ký ngay
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;