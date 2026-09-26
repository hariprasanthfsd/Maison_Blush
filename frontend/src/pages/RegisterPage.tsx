import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { BackButton } from '../components/common/BackButton';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    const success = await register({ name, email, phone, password });
    setIsSubmitting(false);
    if (success) {
      navigate('/account');
    }
  };

  return (
    <div className="py-16 bg-[#FAF5F3] min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-4">
        <BackButton label="Back to Home" to="/" />
      </div>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-6">
        
        <div className="text-center space-y-1">
          <span className="font-script text-2xl text-[#C49A8B]">Create Your Account</span>
          <h1 className="font-serif text-3xl font-bold text-[#2D2325]">Join Maison Blush</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
              <input
                type="text"
                placeholder="Sophia Rose"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Email Address *</label>
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
            <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
              <input
                type="text"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-[#2D2325] mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
              <input
                type="password"
                placeholder="At least 6 characters..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2325] focus:outline-none focus:border-[#8C5353]"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#8C5353] hover:bg-[#6E3C3D] text-white font-bold text-xs uppercase tracking-[0.15em] rounded-xl shadow-boutique transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#6B5B5E] pt-2 border-t border-[#FAF5F3]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#8C5353] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
