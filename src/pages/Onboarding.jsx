import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';

const plans = [
  { id: 'free', name: 'نسخة', price: '499 ج/شهر', features: ['إدارة أساسية', 'تقارير مبسطة'] },
  { id: 'basic', name: 'أساسي', price: '999 ج/شهر', features: ['إدارة الطابور', 'تقارير متقدمة', 'إدارة الموظفين'] },
  { id: 'pro', name: 'احترافي', price: '1399 ج/شهر', features: ['جميع الميزات', 'دعم فني 24/7', 'تخصيص كامل'] },
];

export default function Onboarding() {
  const { setTenant } = useTenant();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [plan, setPlan] = useState('free');

  const handleSubmit = () => {
    if (!name || !slug || !ownerPhone) return;
    
    const tenantId = `tenant-${Date.now()}`;
    setTenant({
      tenantId,
      tenantName: name,
      tenantConfig: { slug, ownerPhone },
      plan,
    });
    navigate('/dashboard');
  };

  return (
    <div className="page onboarding" style={{ padding: 'var(--spacing-lg)', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>إعداد الصالون الخاص بك</h2>
      
      <div className="onboarding-form" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>اسم الصالون</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={{ padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #444', background: '#111', color: '#fff', outline: 'none' }} 
            placeholder="مثال: صالون الأناقة"
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>رابط الصالون (Slug)</label>
          <input 
            value={slug} 
            onChange={e => setSlug(e.target.value)} 
            style={{ padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #444', background: '#111', color: '#fff', outline: 'none' }} 
            placeholder="مثال: elegance-salon"
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>رقم هاتف المالك</label>
          <input 
            value={ownerPhone} 
            onChange={e => setOwnerPhone(e.target.value)} 
            style={{ padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #444', background: '#111', color: '#fff', outline: 'none' }} 
            placeholder="01xxxxxxxxx"
          />
        </div>

        <h3 style={{ marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>اختر الباقة</h3>
        <div className="plan-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          {plans.map(p => {
            const isSelected = plan === p.id;
            return (
              <div 
                key={p.id}
                onClick={() => setPlan(p.id)}
                style={{
                  flex: '1 1 200px',
                  border: isSelected ? '2px solid var(--color-primary)' : '2px solid #222',
                  background: isSelected ? 'rgba(201, 168, 76, 0.1)' : '#111',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--spacing-md)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ color: '#fff', margin: '0 0 var(--spacing-sm) 0' }}>{p.name}</h3>
                <p style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 var(--spacing-md) 0' }}>{p.price}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  {p.features.map(f => (
                    <li key={f} style={{ marginBottom: '8px' }}>✓ {f}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <button 
          type="button" 
          onClick={handleSubmit} 
          style={{
            marginTop: 'var(--spacing-lg)',
            background: 'var(--color-primary)',
            color: 'var(--color-bg)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '16px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          إنشاء الصالون
        </button>
      </div>
    </div>
  );
}
