import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { Save, Bell, Palette, Settings, Phone, MessageCircle } from 'lucide-react';

export default function DashboardSettings() {
  const { tenantName, tenantId, plan, tenantConfig, setTenant } = useTenant();
  
  const [name, setName] = useState(tenantName || '');
  const [phone, setPhone] = useState(tenantConfig?.ownerPhone || '');
  const [color, setColor] = useState(tenantConfig?.primaryColor || '#c9a84c');
  const [chatId, setChatId] = useState(tenantConfig?.telegramChatId || '');
  const [telegramEnabled, setTelegramEnabled] = useState(tenantConfig?.telegramEnabled || false);
  
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setName(tenantName || '');
    setPhone(tenantConfig?.ownerPhone || '');
    setColor(tenantConfig?.primaryColor || '#c9a84c');
    setChatId(tenantConfig?.telegramChatId || '');
    setTelegramEnabled(tenantConfig?.telegramEnabled || false);
  }, [tenantName, tenantConfig]);

  const handleSave = () => {
    setTenant({
      tenantId,
      tenantName: name,
      plan,
      tenantConfig: {
        ...tenantConfig,
        ownerPhone: phone,
        primaryColor: color,
        telegramChatId: chatId,
        telegramEnabled
      }
    });
    
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const getPlanBadgeName = () => {
    if (plan === 'pro') return 'احترافي';
    if (plan === 'basic') return 'أساسي';
    return 'نسخة مجانية';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white" dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif mb-2">إعدادات الصالون</h2>
          <p className="text-neutral-400">إدارة معلومات وبيانات صالونك</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-amber-900/20"
        >
          <Save size={20} />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>تم حفظ الإعدادات بنجاح</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-serif mb-4 flex items-center gap-2 text-amber-500">
              <Settings size={20} />
              <span>بيانات الحساب</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="block text-sm text-neutral-400 mb-1">اسم الصالون الحالي</span>
                <span className="text-lg font-medium">{tenantName}</span>
              </div>
              
              <div>
                <span className="block text-sm text-neutral-400 mb-1">المعرف (Slug)</span>
                <span className="text-neutral-300 font-mono bg-neutral-900 px-2 py-1 rounded text-sm">
                  {tenantConfig?.slug || tenantId}
                </span>
              </div>
              
              <div>
                <span className="block text-sm text-neutral-400 mb-1">الباقة الحالية</span>
                <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-sm font-medium">
                  {getPlanBadgeName()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form (No <form> tags) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-serif mb-6 border-b border-neutral-700/50 pb-4">المعلومات الأساسية</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">اسم الصالون</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">رقم هاتف المالك</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2.5 pl-4 pr-10 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">اللون الرئيسي للصالون</label>
                <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-700 rounded-xl p-2 px-4">
                  <Palette size={20} className="text-neutral-500" />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer bg-transparent border-none p-0"
                  />
                  <span className="font-mono text-sm text-neutral-400">{color}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-serif mb-6 border-b border-neutral-700/50 pb-4 flex items-center gap-2">
              <MessageCircle size={20} className="text-blue-400" />
              <span>إشعارات تيليجرام</span>
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <div>
                  <h4 className="font-medium text-white mb-1">تفعيل إشعارات الحجز</h4>
                  <p className="text-sm text-neutral-400">استلام رسائل فورية عند وجود حجز جديد</p>
                </div>
                
                <button 
                  onClick={() => setTelegramEnabled(!telegramEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${telegramEnabled ? 'bg-amber-500' : 'bg-neutral-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${telegramEnabled ? 'left-1' : 'right-1'}`}></div>
                </button>
              </div>

              <div className={`transition-all ${telegramEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">معرف المحادثة (Chat ID)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                    <Bell size={18} />
                  </div>
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    dir="ltr"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2.5 pl-4 pr-10 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-left"
                    placeholder="e.g. 123456789"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">تواصل مع بوت @SalonBot للحصول على المعرف الخاص بك.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
