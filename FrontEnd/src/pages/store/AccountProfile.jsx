import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Lock, LogOut, Edit2, Save, X } from 'lucide-react';
import StoreLayout from '../../components/store/StoreLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// Định nghĩa ngoài component để tránh re-mount khi re-render
const ProfileField = ({ label, fieldKey, value, editing, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    {editing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    ) : (
      <p className="text-sm font-medium text-gray-800 px-3 py-2 bg-gray-50 rounded-xl">
        {value || <span className="text-gray-400 italic">Chưa cập nhật</span>}
      </p>
    )}
  </div>
);

const AccountProfile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) { navigate('/store-login'); return null; }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      setEditing(false);
    } catch {
      alert('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Mật khẩu mới không khớp'); return; }
    if (pwForm.newPassword.length < 6) { setPwError('Mật khẩu ít nhất 6 ký tự'); return; }
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwSuccess('Đổi mật khẩu thành công!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err?.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-center mb-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User size={28} className="text-red-600" />
                </div>
                <p className="font-semibold text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
              <nav className="space-y-1">
                {[
                  { icon: <User size={16} />, label: 'Thông tin tài khoản', path: '/account/profile', active: true },
                  { icon: <Package size={16} />, label: 'Đơn hàng của tôi', path: '/account/orders' },
                  { icon: <Lock size={16} />, label: 'Đổi mật khẩu', path: '#pw' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${item.active ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                >
                  <LogOut size={16} /> Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Main */}
          <div className="md:col-span-3 space-y-5">
            {/* Profile */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Thông tin tài khoản</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-sm text-red-600 hover:underline">
                    <Edit2 size={14} /> Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                      <X size={14} /> Hủy
                    </button>
                    <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
                      <Save size={14} /> {saving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Read-only fields */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tên đăng nhập</label>
                  <p className="text-sm font-medium text-gray-800 px-3 py-2 bg-gray-50 rounded-xl">{user?.username}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Vai trò</label>
                  <p className="text-sm font-medium text-gray-800 px-3 py-2 bg-gray-50 rounded-xl">{user?.role}</p>
                </div>
                {/* Editable fields */}
                <ProfileField label="Họ và tên" fieldKey="fullName" value={form.fullName} editing={editing} onChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
                <ProfileField label="Email" fieldKey="email" value={form.email} editing={editing} onChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
                <ProfileField label="Số điện thoại" fieldKey="phone" value={form.phone} editing={editing} onChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))} />
              </div>
            </div>

            {/* Change password */}
            <div id="pw" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Lock size={18} className="text-red-600" /> Đổi mật khẩu
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
                {pwError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl">{pwError}</div>}
                {pwSuccess && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-xl">{pwSuccess}</div>}
                {[
                  { label: 'Mật khẩu hiện tại', key: 'currentPassword' },
                  { label: 'Mật khẩu mới', key: 'newPassword' },
                  { label: 'Xác nhận mật khẩu mới', key: 'confirmPassword' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      type="password"
                      value={pwForm[f.key]}
                      onChange={(e) => setPwForm({ ...pwForm, [f.key]: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                ))}
                <button type="submit" className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
                  Cập nhật mật khẩu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default AccountProfile;
