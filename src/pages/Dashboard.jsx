import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { Users, TrendingUp, Activity, Calendar, HeartPulse, Info } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const role = user?.role?.replace('ROLE_', '') || 'MEMBER';
    const navigate = useNavigate();

    const [memberData, setMemberData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (role === 'MEMBER') {
            const fetchMemberDashboard = async () => {
                try {
                    const response = await axiosInstance.get('/members/dashboard');
                    setMemberData(response.data.data);
                } catch (error) {
                    console.error("Lỗi lấy dữ liệu Dashboard:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchMemberDashboard();
        } else {
            setIsLoading(false);
        }
    }, [role]);

    const adminStats = [
        { title: 'Tổng Hội Viên', value: '1,245', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
        { title: 'Doanh Thu Tháng', value: '124.5M', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {role === 'ADMIN' ? 'Trang Quản Trị Viên' : 'Trang Tổng Quan'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Chào mừng <span className="font-semibold text-primary">{memberData?.memberName || user?.username}</span> quay trở lại!
                    </p>
                </div>
            </div>

            {role === 'ADMIN' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {adminStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
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

            {role === 'MEMBER' && memberData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Thẻ Chỉ số BMI */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                <HeartPulse className="w-5 h-5 text-danger mr-2" />
                                Chỉ Số Cơ Thể (BMI)
                            </h2>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-gray-500 text-sm mb-1">Chiều cao</p>
                                <p className="text-2xl font-bold text-gray-900">{memberData.currentHeight || 0} <span className="text-sm font-normal text-gray-500">cm</span></p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-gray-500 text-sm mb-1">Cân nặng</p>
                                <p className="text-2xl font-bold text-gray-900">{memberData.currentWeight || 0} <span className="text-sm font-normal text-gray-500">kg</span></p>
                            </div>
                            <div className={`p-4 rounded-xl border ${
                                memberData.bmiCategory === 'Bình thường' ? 'bg-success/10 border-success/20 text-success' :
                                    (memberData.bmiCategory === 'Thiếu cân' || memberData.bmiCategory === 'Thừa cân') ? 'bg-amber-100 border-amber-200 text-amber-600' :
                                        (!memberData.bmiCategory || memberData.bmiCategory === 'Chưa có dữ liệu') ? 'bg-gray-100 border-gray-200 text-gray-500' :
                                            'bg-danger/10 border-danger/20 text-danger'
                            }`}>
                                <p className="text-sm mb-1 opacity-80">BMI ({memberData.bmiCategory || 'Trống'})</p>
                                <p className="text-2xl font-bold">{memberData.bmi || 0}</p>
                            </div>
                        </div>

                        {(!memberData.currentHeight || !memberData.currentWeight) && (
                            <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 text-blue-600 text-sm rounded-xl flex items-start">
                                <Info className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                                <p>Hãy cập nhật số đo Chiều cao, Cân nặng. Hệ thống sẽ tự động tính toán chỉ số BMI và đề xuất lộ trình tập luyện cho bạn!</p>
                            </div>
                        )}
                    </div>

                    {/* Thẻ Gói Tập Đang Dùng */}
                    <div className="bg-dark-card rounded-2xl shadow-lg border border-dark-border p-6 text-white flex flex-col relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 opacity-10">
                            <Activity className="w-40 h-40 text-primary" />
                        </div>

                        <h2 className="text-lg font-bold text-gray-300 flex items-center mb-6 z-10">
                            <Calendar className="w-5 h-5 mr-2 text-primary-light" />
                            Gói Tập Hiện Tại
                        </h2>

                        <div className="z-10 flex-1 flex flex-col justify-center">
                            {memberData.currentPackageName ? (
                                <>
                                    <h3 className="text-2xl font-extrabold text-primary-light mb-2">{memberData.currentPackageName}</h3>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-5xl font-black">{memberData.daysRemaining || 0}</span>
                                        <span className="text-gray-400 font-medium">ngày</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <p className="text-gray-400 mb-6">Bạn chưa đăng ký gói tập nào.</p>
                                    <button
                                        onClick={() => navigate('/packages')}
                                        className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
                                    >
                                        ĐĂNG KÝ NGAY
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Dashboard;