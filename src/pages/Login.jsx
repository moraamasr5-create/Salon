import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('login placeholder', { email, password });
    localStorage.setItem('salon_authed', '1');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-neutral-700/50 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-white mb-2">مرحباً بك</h1>
          <p className="text-neutral-400">سجل دخولك للمتابعة</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900/80 border border-neutral-700 rounded-xl py-3 pl-4 pr-10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900/80 border border-neutral-700 rounded-xl py-3 pl-4 pr-10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-amber-900/20 active:scale-[0.98] mt-4"
          >
            تسجيل الدخول
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/onboarding" className="text-sm text-neutral-400 hover:text-amber-500 transition-colors">
            ليس لديك حساب؟ سجل الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
