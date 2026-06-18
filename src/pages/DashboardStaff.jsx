import React, { useState } from 'react';

// Mock staff data
const initialStaff = [
  { id: 1, name: 'محمد', role: 'حلاق', active: true },
  { id: 2, name: 'خالد', role: 'مساعد', active: true }
];

function StaffCard({ staff, onEdit, onDelete, onToggle }) {
  return (
    <div className="staff-card" style={{
      background: '#111',
      borderRadius: 'var(--radius)',
      padding: 'var(--spacing-md)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-md)',
    }}>
      <div
        className="avatar"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-bg)',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          flexShrink: 0
        }}
      >
        {staff.name.charAt(0)}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{staff.name}</strong>
          <label style={{ color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={staff.active}
              onChange={() => onToggle(staff.id)}
            />
            فعال
          </label>
        </div>
        <div style={{ color: 'var(--color-muted)', marginTop: '4px' }}>الدور: {staff.role}</div>
        
        <div style={{ marginTop: '12px' }}>
          <button onClick={() => onEdit(staff)} style={{ marginRight: '8px', background: 'var(--color-primary)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer', fontWeight: '600' }}>تعديل</button>
          <button onClick={() => onDelete(staff.id)} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer', fontWeight: '600' }}>حذف</button>
        </div>
      </div>
    </div>
  );
}

function StaffModal({ open, onClose, onSave, initialData }) {
  const [data, setData] = useState(initialData || { name: '', role: 'حلاق', active: true });

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!data.name.trim()) return;
    onSave(data);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={modalBackdropStyle}>
      <div className="modal" style={modalStyle}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>{initialData ? 'تعديل بيانات الموظف' : 'إضافة موظف'}</h3>
        <div>
          <div style={fieldStyle}>
            <label>الاسم</label>
            <input required value={data.name} onChange={e => handleChange('name', e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label>الدور</label>
            <select value={data.role} onChange={e => handleChange('role', e.target.value)} style={inputStyle}>
              <option value="حلاق">حلاق</option>
              <option value="مساعد">مساعد</option>
              <option value="كاشير">كاشير</option>
            </select>
          </div>
          <div style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <label style={{ margin: 0, cursor: 'pointer' }}>
              <input type="checkbox" checked={data.active} onChange={e => handleChange('active', e.target.checked)} style={{ marginLeft: '8px' }} />
              نشط
            </label>
          </div>
          <div style={{ marginTop: '24px', textAlign: 'left' }}>
            <button type="button" onClick={handleSubmit} style={saveBtnStyle}>{initialData ? 'حفظ' : 'إضافة'}</button>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>إلغاء</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={modalBackdropStyle}>
      <div className="modal" style={modalStyle}>
        <h3 style={{ marginBottom: '16px', color: '#f44336' }}>تأكيد الحذف</h3>
        <p>هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع.</p>
        <div style={{ marginTop: '24px', textAlign: 'left' }}>
          <button type="button" onClick={onConfirm} style={deleteBtnStyle}>حذف</button>
          <button type="button" onClick={onClose} style={cancelBtnStyle}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// Modal styles (slide-up animation)
const modalBackdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  animation: 'fadeIn 0.3s',
  zIndex: 1000
};
const modalStyle = {
  background: '#222', borderRadius: 'var(--radius) var(--radius) 0 0',
  width: '100%', maxWidth: '400px', padding: 'var(--spacing-lg)',
  animation: 'slideUp 0.4s', color: 'var(--color-text)',
};
const fieldStyle = { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' };
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #444', background: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' };
const saveBtnStyle = { background: 'var(--color-primary)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius)', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { background: '#555', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '8px 16px', cursor: 'pointer', marginRight: '8px' };
const deleteBtnStyle = { background: '#f44336', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' };

export default function DashboardStaff() {
  const [staff, setStaff] = useState(initialStaff);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleToggle = id => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleSave = newStaff => {
    if (editData) {
      setStaff(prev => prev.map(s => s.id === editData.id ? { ...newStaff, id: editData.id } : s));
    } else {
      const newId = staff.length ? Math.max(...staff.map(s => s.id)) + 1 : 1;
      setStaff(prev => [...prev, { ...newStaff, id: newId }]);
    }
    setEditData(null);
  };

  const handleDelete = id => {
    setStaff(prev => prev.filter(s => s.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="page dashboard-staff" style={{ padding: 'var(--spacing-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h2 style={{ margin: 0 }}>فريق العمل</h2>
        <button 
          onClick={() => { setEditData(null); setModalOpen(true); }} 
          style={{ background: 'var(--color-primary)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius)', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          إضافة موظف
        </button>
      </div>
      
      <div className="staff-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {staff.map(s => (
          <StaffCard
            key={s.id}
            staff={s}
            onToggle={handleToggle}
            onEdit={data => { setEditData(data); setModalOpen(true); }}
            onDelete={id => setDeleteId(id)}
          />
        ))}
        {staff.length === 0 && (
          <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: 'var(--spacing-lg) 0' }}>لا يوجد موظفين مضافين.</p>
        )}
      </div>

      <StaffModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSave} 
        initialData={editData} 
        key={modalOpen ? 'open' : 'closed'}
      />
      <DeleteConfirm 
        open={deleteId !== null} 
        onClose={() => setDeleteId(null)} 
        onConfirm={() => handleDelete(deleteId)} 
      />
    </div>
  );
}
