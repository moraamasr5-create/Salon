import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { Save, Bell, Palette, Settings, Phone, MessageCircle } from 'lucide-react';

export default function DashboardSettings() {
  const { tenantName, tenantId, plan, tenantConfig, setTenant } = useTenant();
  
  const [name, setName] = useState(tenantName || '');
  const [phone, setPhone] = useState(tenantConfig?.ownerPhone || '');
  const [color, setColor] = useState(tenantConfig?.primaryColor || 'var(--color-primary)');
  const [chatId, setChatId] = useState(tenantConfig?.telegramChatId || '');
  const [telegramEnabled, setTelegramEnabled] = useState(tenantConfig?.telegramEnabled || false);
  
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setName(tenantName || '');
    setPhone(tenantConfig?.ownerPhone || '');
    setColor(tenantConfig?.primaryColor || 'var(--color-primary)');
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
    <div dir="rtl" style={{ padding: 'var(--spacing-lg)', maxWidth: '900px', margin: '0 auto', color: 'var(--color-text)' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--spacing-xs)' }}>إعدادات الصالون</h2>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>إدارة معلومات وبيانات صالونك</p>
        </div>
        <button
          onClick={handleSave}
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-bg)',
            padding: '10px 20px',
            borderRadius: 'var(--radius)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Save size={20} />
          <span>حفظ التغييرات</span>
        </button>
      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid rgba(74, 222, 128, 0.5)',
          color: '#4ade80',
          padding: '12px 16px',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000
        }}>
          <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></div>
          <span>تم حفظ الإعدادات بنجاح</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
        
        {/* Info Card */}
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 'var(--radius)', padding: 'var(--spacing-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
              <Settings size={20} />
              <span>بيانات الحساب</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '4px' }}>اسم الصالون الحالي</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{tenantName}</span>
              </div>
              
              <div>
                <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '4px' }}>المعرف (Slug)</span>
                <span style={{ color: '#ddd', background: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                  {tenantConfig?.slug || tenantId}
                </span>
              </div>
              
              <div>
                <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '4px' }}>الباقة الحالية</span>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(201, 168, 76, 0.1)', color: 'var(--color-primary)', border: '1px solid rgba(201, 168, 76, 0.2)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '500' }}>
                  {getPlanBadgeName()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 'var(--radius)', padding: 'var(--spacing-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid #333', paddingBottom: 'var(--spacing-md)' }}>المعلومات الأساسية</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>اسم الصالون</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: 'var(--radius)', padding: '10px 16px', color: 'var(--color-text)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>رقم هاتف المالك</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', paddingRight: '12px', pointerEvents: 'none', color: '#666' }}>
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: 'var(--radius)', padding: '10px 16px 10px 40px', color: 'var(--color-text)', outline: 'none', textAlign: 'left', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>اللون الرئيسي للصالون</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', background: '#000', border: '1px solid #333', borderRadius: 'var(--radius)', padding: '8px 16px' }}>
                  <Palette size={20} color="#666" />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ height: '32px', width: '56px', cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
                  />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#888' }}>{color}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 'var(--radius)', padding: 'var(--spacing-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid #333', paddingBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={20} color="#60a5fa" />
              <span>إشعارات تيليجرام</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#000', border: '1px solid #333', borderRadius: 'var(--radius)', padding: 'var(--spacing-md)' }}>
                <div>
                  <h4 style={{ fontWeight: '500', color: '#fff', margin: '0 0 4px 0' }}>تفعيل إشعارات الحجز</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', margin: 0 }}>استلام رسائل فورية عند وجود حجز جديد</p>
                </div>
                
                <button 
                  onClick={() => setTelegramEnabled(!telegramEnabled)}
                  style={{
                    width: '48px', height: '24px', borderRadius: '12px', position: 'relative', transition: 'background 0.3s',
                    background: telegramEnabled ? 'var(--color-primary)' : '#444', border: 'none', cursor: 'pointer'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'all 0.3s',
                    left: telegramEnabled ? '4px' : '28px'
                  }}></div>
                </button>
              </div>

              <div style={{ opacity: telegramEnabled ? 1 : 0.5, pointerEvents: telegramEnabled ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#ccc', marginBottom: '6px' }}>معرف المحادثة (Chat ID)</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', paddingRight: '12px', pointerEvents: 'none', color: '#666' }}>
                    <Bell size={18} />
                  </div>
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    dir="ltr"
                    style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: 'var(--radius)', padding: '10px 16px 10px 40px', color: 'var(--color-text)', outline: 'none', textAlign: 'left', boxSizing: 'border-box' }}
                    placeholder="e.g. 123456789"
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px', marginBottom: 0 }}>تواصل مع بوت @SalonBot للحصول على المعرف الخاص بك.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
