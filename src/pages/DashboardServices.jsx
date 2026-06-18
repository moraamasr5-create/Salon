import React, { useState } from 'react';

// Mock services data
const initialServices = [
  { id: 1, name: 'قص شعر', price: 50, duration: 30, active: true },
  { id: 2, name: 'تشذيب لحية', price: 40, duration: 20, active: false },
  { id: 3, name: 'علاج بشرة', price: 120, duration: 45, active: true },
];

function ServiceCard({ service, onEdit, onDelete, onToggle }) {
  return (
    <div className="service-card" style={{
      background: '#111',
      borderRadius: 'var(--radius)',
      padding: 'var(--spacing-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{service.name}</strong>
        <label style={{ color: '#fff' }}>
          <input
            type="checkbox"
            checked={service.active}
            onChange={() => onToggle(service.id)}
          />
          فعال
        </label>
      </div>
      <div>السعر: {service.price} ر.س</div>
      <div>المدة: {service.duration} دقيقة</div>
      <div style={{ marginTop: '4px' }}>
        <button onClick={() => onEdit(service)} style={{ marginRight: '8px', background: 'var(--color-primary)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer' }}>تعديل</button>
        <button onClick={() => onDelete(service.id)} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer' }}>حذف</button>
      </div>
    </div>
  );
}

function ServiceModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState(initialData || { name: '', price: '', duration: '', active: true });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" style={modalBackdropStyle}>
      <div className="modal" style={modalStyle}>
        <h3>{initialData ? 'تعديل الخدمة' : 'إضافة خدمة'}</h3>
        <div onClick={handleSubmit}>
          <div style={fieldStyle}>
            <label>الاسم</label>
            <input required value={form.name} onChange={e => handleChange('name', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label>السعر (ر.س)</label>
            <input type="number" required value={form.price} onChange={e => handleChange('price', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label>المدة (دقيقة)</label>
            <input type="number" required value={form.duration} onChange={e => handleChange('duration', e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label>نشط</label>
            <input type="checkbox" checked={form.active} onChange={e => handleChange('active', e.target.checked)} />
          </div>
          <div style={{ marginTop: '12px', textAlign: 'right' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>إلغاء</button>
            <button type="submit" style={saveBtnStyle}>{initialData ? 'حفظ' : 'إضافة'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={modalBackdropStyle}>
      <div className="modal" style={modalStyle}>
        <h3>تأكيد الحذف</h3>
        <p>هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع.</p>
        <div style={{ marginTop: '12px', textAlign: 'right' }}>
          <button onClick={onClose} style={cancelBtnStyle}>إلغاء</button>
          <button onClick={onConfirm} style={deleteBtnStyle}>حذف</button>
        </div>
      </div>
    </div>
  );
}

// Modal styles (slide‑up animation)
const modalBackdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  animation: 'fadeIn 0.3s',
};
const modalStyle = {
  background: '#222', borderRadius: 'var(--radius) var(--radius) 0 0',
  width: '100%', maxWidth: '400px', padding: 'var(--spacing-md)',
  animation: 'slideUp 0.4s', color: 'var(--color-text)',
};
const fieldStyle = { marginBottom: '8px', display: 'flex', flexDirection: 'column' };
const saveBtnStyle = { background: 'var(--color-primary)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', marginLeft: '8px', cursor: 'pointer' };
const cancelBtnStyle = { background: '#555', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer' };
const deleteBtnStyle = { background: '#f44336', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer' };

export default function DashboardServices() {
  const [services, setServices] = useState(initialServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleToggle = id => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleSave = service => {
    if (editData) {
      setServices(prev => prev.map(s => s.id === editData.id ? { ...service, id: editData.id } : s));
    } else {
      const newId = services.length ? Math.max(...services.map(s => s.id)) + 1 : 1;
      setServices(prev => [...prev, { ...service, id: newId }]);
    }
    setEditData(null);
  };

  const handleDelete = id => {
    setServices(prev => prev.filter(s => s.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="page dashboard-services" style={{ padding: 'var(--spacing-md)' }}>
      <h2>الخدمات</h2>
      <button onClick={() => { setEditData(null); setModalOpen(true); }} style={{ marginBottom: 'var(--spacing-sm)', background: 'var(--color-primary)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer' }}>إضافة خدمة</button>
      <div className="service-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {services.map(s => (
          <ServiceCard
            key={s.id}
            service={s}
            onToggle={handleToggle}
            onEdit={svc => { setEditData(svc); setModalOpen(true); }}
            onDelete={id => setDeleteId(id)}
          />
        ))}
      </div>

      <ServiceModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initialData={editData} />
      <DeleteConfirm open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)} />
    </div>
  );
}

/* Future API integration can replace the local state updates with server calls */
