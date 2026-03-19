import React, { useState, useEffect } from 'react';
import axiosClient from "../../api/axiosClient.js"; // Đảm bảo đường dẫn này đúng với thư mục của em
import { Plus, Edit, EyeOff, Eye, Search, ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';

export default function AdminGymPackage() {
    // State quản lý dữ liệu
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);

    // State phân trang & tìm kiếm
    const [page, setPage] = useState(1);
    const [size] = useState(5); // Hiển thị 5 dòng 1 trang cho đẹp
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');

    // State quản lý Modal (Form Thêm/Sửa)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        durationMonths: '',
        description: ''
    });

    // 1. GỌI API LẤY DANH SÁCH (READ)
    const fetchPackages = async () => {
        setLoading(true);
        try {
            // Đã dùng axiosClient nên không cần tự nhét Token hay Base URL nữa
            const response = await axiosClient.get(`/admin/packages?page=${page}&size=${size}&keyword=${keyword}`);

            // Do axiosClient interceptor đã bóc vỏ 1 lớp, response ở đây chính là ApiResponse
            const pageData = response.data; // Lấy ra cục PageResponse

            setPackages(pageData.data); // data.data chính là mảng List<GymPackageResponse>
            setTotalPages(pageData.totalPages);
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
            // Lỗi 401/403 đã được axiosClient tự động log ra console
        } finally {
            setLoading(false);
        }
    };

    // Theo dõi thay đổi của page hoặc keyword để gọi lại API
    useEffect(() => {
        fetchPackages();
    }, [page, keyword]);

    // Xử lý khi bấm nút Tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset về trang 1 khi search
        setKeyword(searchInput);
    };

    // 2. MỞ MODAL THÊM / SỬA
    const openModal = (pkg = null) => {
        if (pkg) {
            // Chế độ Sửa (Edit)
            setEditingId(pkg.id);
            setFormData({
                name: pkg.name,
                price: pkg.price,
                durationMonths: pkg.durationMonths,
                description: pkg.description || ''
            });
        } else {
            // Chế độ Thêm mới (Create)
            setEditingId(null);
            setFormData({ name: '', price: '', durationMonths: '', description: '' });
        }
        setIsModalOpen(true);
    };

    // 3. XỬ LÝ SUBMIT FORM (CREATE / UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Gọi API Update
                await axiosClient.put(`/admin/packages/${editingId}`, formData);
                alert("Cập nhật gói tập thành công!");
            } else {
                // Gọi API Create
                await axiosClient.post('/admin/packages', formData);
                alert("Thêm gói tập mới thành công!");
            }
            setIsModalOpen(false);
            fetchPackages(); // Load lại data
        } catch (error) {
            console.error("Lỗi lưu dữ liệu:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi lưu!");
        }
    };

    // 4. XỬ LÝ ẨN/HIỆN GÓI TẬP (SOFT DELETE)
    const handleToggleStatus = async (id, currentStatus) => {
        const actionText = currentStatus === 'ACTIVE' ? 'ẨN' : 'HIỆN';
        if (window.confirm(`Bạn có chắc muốn ${actionText} gói tập này?`)) {
            try {
                await axiosClient.patch(`/admin/packages/${id}/toggle-status`);
                fetchPackages(); // Load lại data ngay lập tức
            } catch (error) {
                console.error("Lỗi cập nhật trạng thái:", error);
                alert("Không thể cập nhật trạng thái!");
            }
        }
    };

    // Format tiền VNĐ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Dumbbell className="text-blue-600" /> Quản Lý Gói Tập (Gym Packages)
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Quản lý giá bán và thời hạn các gói tập tại phòng Gym</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Plus size={20} /> Thêm Gói Mới
                    </button>
                </div>

                {/* Thanh công cụ: Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên gói..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                        <button type="submit" className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition-colors font-medium">
                            Tìm kiếm
                        </button>
                    </form>
                </div>

                {/* Bảng Dữ Liệu */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Tên gói tập</th>
                                <th className="p-4 font-semibold">Giá (VNĐ)</th>
                                <th className="p-4 font-semibold">Thời hạn</th>
                                <th className="p-4 font-semibold text-center">Trạng thái</th>
                                <th className="p-4 font-semibold text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">Đang tải dữ liệu...</td></tr>
                            ) : packages.length === 0 ? (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">Không tìm thấy gói tập nào.</td></tr>
                            ) : (
                                packages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600">#{pkg.id}</td>
                                        <td className="p-4 font-medium text-gray-800">{pkg.name}</td>
                                        <td className="p-4 text-blue-600 font-semibold">{formatCurrency(pkg.price)}</td>
                                        <td className="p-4 text-gray-600">{pkg.durationMonths} Tháng</td>
                                        <td className="p-4 text-center">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    pkg.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {pkg.status === 'ACTIVE' ? 'ĐANG BÁN' : 'ĐÃ ẨN'}
                                                </span>
                                        </td>
                                        <td className="p-4 text-center flex justify-center gap-2">
                                            <button
                                                onClick={() => openModal(pkg)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Sửa"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(pkg.id, pkg.status)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    pkg.status === 'ACTIVE'
                                                        ? 'text-red-500 hover:bg-red-50'
                                                        : 'text-green-600 hover:bg-green-50'
                                                }`}
                                                title={pkg.status === 'ACTIVE' ? 'Ẩn gói tập' : 'Mở bán lại'}
                                            >
                                                {pkg.status === 'ACTIVE' ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang (Pagination) */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Trang <span className="font-semibold text-gray-800">{page}</span> / {totalPages > 0 ? totalPages : 1}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL THÊM / SỬA GÓI TẬP */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Cập Nhật Gói Tập' : 'Thêm Gói Tập Mới'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên gói tập <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="VD: Gói VIP 1 Tháng..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            required min="0"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            placeholder="VD: 500000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn (Tháng) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            required min="1"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.durationMonths}
                                            onChange={(e) => setFormData({...formData, durationMonths: e.target.value})}
                                            placeholder="VD: 1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                    <textarea
                                        rows="3"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Miễn phí nước uống, tủ đồ, khăn tắm..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                                >
                                    {editingId ? 'Lưu Thay Đổi' : 'Tạo Gói Tập'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}