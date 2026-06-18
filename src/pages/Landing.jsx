import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bell, LayoutDashboard, CheckCircle2, ArrowLeft } from 'lucide-react';

const plans = [
  { id: 'free', name: 'نسخة مجانية', price: '499 ج/شهر', features: ['إدارة أساسية', 'تقارير مبسطة'] },
  { id: 'basic', name: 'أساسي', price: '999 ج/شهر', features: ['إدارة الطابور', 'تقارير متقدمة', 'إدارة الموظفين'], isPopular: true },
  { id: 'pro', name: 'احترافي', price: '1399 ج/شهر', features: ['جميع الميزات', 'دعم فني 24/7', 'تخصيص كامل'] },
];

export default function Landing() {
  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30" dir="rtl">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            صالونك
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-neutral-300 hover:text-white transition-colors font-medium px-4">
              دخول
            </Link>
            <Link to="/onboarding" className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-2.5 rounded-full transition-all">
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            المنصة الأولى لإدارة الصالونات
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
            صالونك أونلاين <br />
            <span className="text-neutral-500">في دقائق</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            نظام متكامل لإدارة الحجوزات، الموظفين، والمبيعات لصالونات الحلاقة والتجميل. ابدأ الآن واجعل إدارة صالونك أسهل من أي وقت مضى.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/onboarding" className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 text-lg">
              <span>ابدأ مجاناً</span>
              <ArrowLeft size={20} />
            </Link>
            <button onClick={scrollToFeatures} className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-8 py-4 rounded-xl transition-all text-lg">
              شاهد المميزات
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-neutral-900/50 border-y border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">كل ما تحتاجه لإدارة صالونك</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">مميزات صممت خصيصاً لتوفير وقتك وزيادة أرباحك</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors group">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">حجز أونلاين</h3>
              <p className="text-neutral-400 leading-relaxed">
                رابط خاص بصالونك يمكن للعملاء من خلاله حجز مواعيدهم بسهولة في أي وقت ومن أي مكان.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-blue-500/50 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Bell size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">إشعارات فورية</h3>
              <p className="text-neutral-400 leading-relaxed">
                استقبل إشعارات على تيليجرام والواتساب فوراً عند وجود حجز جديد أو تعديل في المواعيد.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-colors group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">لوحة تحكم</h3>
              <p className="text-neutral-400 leading-relaxed">
                راقب أداء صالونك، إدارة الموظفين، وتتبع المبيعات من خلال لوحة تحكم بسيطة وشاملة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">باقات تناسب جميع الاحتياجات</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">اختر الباقة المناسبة لحجم صالونك</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {plans.map((p) => (
              <div 
                key={p.id} 
                className={`relative bg-neutral-900 border rounded-3xl p-8 flex flex-col h-full ${
                  p.isPopular ? 'border-amber-500 shadow-2xl shadow-amber-900/20 md:-translate-y-4' : 'border-neutral-800'
                }`}
              >
                {p.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-neutral-950 font-bold text-sm px-4 py-1 rounded-full">
                    الأكثر طلباً
                  </div>
                )}
                
                <h3 className="text-2xl font-serif font-bold mb-2">{p.name}</h3>
                <div className="flex items-end gap-1 mb-8">
                  <span className={`text-4xl font-bold ${p.isPopular ? 'text-amber-500' : 'text-white'}`}>{p.price.split(' ')[0]}</span>
                  <span className="text-neutral-500 text-lg mb-1">{p.price.split(' ')[1]}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                      <CheckCircle2 size={20} className={p.isPopular ? 'text-amber-500' : 'text-neutral-500'} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/onboarding" 
                  className={`w-full py-4 rounded-xl font-medium text-center transition-all ${
                    p.isPopular 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-900/20' 
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  }`}
                >
                  اختر الباقة
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-12 text-center text-neutral-500">
        <p>© {new Date().getFullYear()} صالونك. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
