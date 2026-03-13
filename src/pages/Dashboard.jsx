import React from 'react';
import useAuthStore from '../store/authStore';
import { Users, CreditCard, TrendingUp, Activity } from 'lucide-react';

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const role = user?.role?.replace('ROLE_', '') || 'MEMBER';

    // Mock Data (Sau này sẽ gọi API đắp vào đây)
    const stats = [
        { title: 'Tổng Hội Viên', value: '1,245', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
        { title: 'Doanh Thu Tháng', value: '124.5M', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
        { title: 'Gói Tập Đang Hoạt Động', value: '856', icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-100' },
        { title: 'Lượt Check-in Hôm Nay', value: '342', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-6">
            {/* Lời chào */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Trang Tổng Quan</h1>
                    <p className="text-gray-500 mt-1">Chào mừng <span className="font-semibold text-primary">{user?.username}</span> quay trở lại hệ thống!</p>
                </div>
            </div>

            {/* Hiển thị Thống Kê (Chỉ Admin mới thấy các số liệu tài chính) */}
            {role === 'ADMIN' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                                <div className={`p-4 rounded-full ${stat.bg}`}>
                                    <Icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Chỗ trống cho Biểu đồ hoặc Lịch tập */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{role === 'ADMIN' ? 'Biểu Đồ Doanh Thu' : 'Lịch Tập Gần Đây'}</h2>
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <p className="text-gray-400 italic">Khu vực này sẽ hiển thị dữ liệu từ API ở các bài tiếp theo...</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Hoạt Động Gần Đây</h2>
                    <div className="space-y-4">
                        {/* Mock timeline */}
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                            <div>
                                <p className="text-sm text-gray-800">Đăng nhập thành công</p>
                                <p className="text-xs text-gray-500">Vừa xong</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard