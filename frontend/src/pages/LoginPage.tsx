import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { BackButton } from '../components/common/BackButton';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      navigate('/account');
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setIsSubmitting(true);
    const success = await login(demoEmail, demoPass);
    setIsSubmitting(false);
    if (success) {
      if (demoEmail.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    }
  };

  return (
    <div className="py-16 bg-[#FAF5F3] min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-4">
        <BackButton label="Back to Home" to="/" />
      </div>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
        
        <div className="text-center space-y-1">
          <span className="font-script text-2xl text-[#C49A8B]">Welcome Back</span>
          <h1 className="font-serif text-3xl font-bold text-[#2D2325]">Sign In to Maison Blush</h1>
        </div>

        {/* Demo Login Quick Buttons */}
        <div className="p-4 bg-[#FAF5F3] rounded-2xl border border-[#E8C4C0] space-y-2">
          <p className="text-[11px] font-bold uppercase text-[#8C5353] text-center tracking-wider">Quick Demo Login Shortcuts</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer@maisonblush.com', 'password123')}
              className="py-2 px-3 bg-white hover:bg-[#8C5353] text-[#2D2325] hover:text-white rounded-xl text-xs font-semibold border border-[#E8C4C0] transition-colors flex items-center justify-center gap-1"
            >
              <User className="w-3.5 h-3.5" /> Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@maisonblush.com', 'admin123')}
              className="py-2 px-3 bg-[#2D2325] hover:bg-[#8C5353] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#8C5353] hover:bg-[#6E3C3D] text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl shadow-boutique transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#6B5B5E] pt-2 border-t border-[#FAF5F3]">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-[#8C5353] hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
