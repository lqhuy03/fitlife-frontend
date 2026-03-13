import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// --- IMPORT CÁC TRANG (PAGES THẬT) ---
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Dashboard from '../pages/Dashboard';

// --- IMPORT BỘ KHUNG (LAYOUT THẬT) ---
import MainLayout from '../components/layout/MainLayout';

// COMPONENT BẢO VỆ TUYẾN ĐƯỜNG (Private Route)
const PrivateRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC ROUTES (Ai cũng vào được) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* PRIVATE ROUTES (Bắt buộc phải có Token) */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;