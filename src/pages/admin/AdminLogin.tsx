import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/ui/Button';

const AdminLogin: React.FC = () => {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5ECD5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#578E7E] rounded-sm flex items-center justify-center">
              <span className="text-[#FFFAEC] font-bold text-sm">PS</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-[#3D3D3D] text-lg">APR Services</div>
              <div className="text-xs text-[#578E7E] tracking-widest uppercase">Enterprise</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#3D3D3D]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Admin Portal
          </h1>
          <p className="text-sm text-[#7a7a7a] mt-1">Secure access for authorized personnel only</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-sm border border-[#e0d8c8] shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#3D3D3D] mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@APR Services.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e0d8c8] rounded-sm focus:border-[#578E7E] focus:ring-2 focus:ring-[#578E7E]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#3D3D3D] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-[#e0d8c8] rounded-sm focus:border-[#578E7E] focus:ring-2 focus:ring-[#578E7E]/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#578E7E] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-600">
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In to Admin Panel
            </Button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-[#7a7a7a] hover:text-[#578E7E] transition-colors">
            ← Back to main website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
