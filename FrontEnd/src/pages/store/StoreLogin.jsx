import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// Định nghĩa Field NGOÀI component để tránh re-mount mỗi lần render
const Field = ({ label, name, type, placeholder, icon: Icon, value, onChange, error, showPass, onTogglePass }) => {
  const isPassword = name === 'password' || name === 'confirmPassword';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : (type || 'text');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={isPassword ? 'off' : undefined}
          className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-${isPassword ? '10' : '4'} py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
        />
        {isPassword && onTogglePass && (
          <button
            type="button"
            onClick={onTogglePass}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const StoreLogin = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const { login, register } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const setField = (name) => (e) => {
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Vui lòng nhập tên đăng nhập';
    if (!form.password) e.password = 'Vui lòng nhập mật khẩu';
    if (mode === 'register') {
      if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên';
      if (!form.email.trim()) e.email = 'Vui lòng nhập email';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
      if (form.password.length < 6) e.password = 'Mật khẩu ít nhất 6 ký tự';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Mật khẩu không khớp';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(form.username, form.password);
        await fetchCart();
        if (user?.role === 'ADMIN') navigate('/admin');
        else navigate(from);
      } else {
        await register({
          username: form.username,
          password: form.password,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
        });
        setMode('login');
        setForm({ username: form.username, password: '', fullName: '', email: '', phone: '', confirmPassword: '' });
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
      }
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
        (mode === 'login' ? 'Tên đăng nhập hoặc mật khẩu không đúng' : 'Đăng ký thất bại. Vui lòng thử lại.')
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Phone size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-red-600 font-bold text-2xl leading-none">CellPhones</div>
              <div className="text-gray-400 text-xs">Điện thoại chính hãng</div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${mode === 'register' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {serverError}
              </div>
            )}

            {mode === 'register' && (
              <Field
                label="Họ và tên"
                name="fullName"
                placeholder="Nguyễn Văn A"
                icon={User}
                value={form.fullName}
                onChange={setField('fullName')}
                error={errors.fullName}
              />
            )}

            <Field
              label="Tên đăng nhập"
              name="username"
              placeholder="username"
              icon={User}
              value={form.username}
              onChange={setField('username')}
              error={errors.username}
            />

            {mode === 'register' && (
              <>
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={setField('email')}
                  error={errors.email}
                />
                <Field
                  label="Số điện thoại"
                  name="phone"
                  placeholder="0901234567"
                  value={form.phone}
                  onChange={setField('phone')}
                  error={errors.phone}
                />
              </>
            )}

            <Field
              label="Mật khẩu"
              name="password"
              placeholder="••••••••"
              icon={Lock}
              value={form.password}
              onChange={setField('password')}
              error={errors.password}
              showPass={showPass}
              onTogglePass={() => setShowPass((v) => !v)}
            />

            {mode === 'register' && (
              <Field
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                placeholder="••••••••"
                icon={Lock}
                value={form.confirmPassword}
                onChange={setField('confirmPassword')}
                error={errors.confirmPassword}
                showPass={showPass}
                onTogglePass={() => setShowPass((v) => !v)}
              />
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <a href="#" className="text-xs text-red-600 hover:underline">Quên mật khẩu?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'} <ArrowRight size={18} /></>
              )}
            </button>

            {mode === 'login' && (
              <div className="text-center text-xs text-gray-400 mt-2">
                Bằng cách đăng nhập, bạn đồng ý với{' '}
                <a href="#" className="text-red-600 hover:underline">Điều khoản sử dụng</a>
              </div>
            )}
          </form>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-red-600 transition-colors">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoreLogin;
