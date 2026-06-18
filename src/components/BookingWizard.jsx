import React, { useState } from 'react';

/**
 * BookingWizard – a 3‑step wizard for the booking flow.
 *
 * Step 1: Scan QR code or manually enter a code.
 * Step 2: Enter customer details and select services (mock list).
 * Step 3: Show confirmation with a mock ticket number and estimated wait time.
 *
 * Existing logic from the original Scan.jsx and Form.jsx is retained as
 * comments below for future implementation when back‑end integration is ready.
 */
export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState(''); // QR / manual code
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  // Mock services – in a real app this would come from Supabase
  const mockServices = [
    { id: '1', name: 'قص الشعر', price: 50 },
    { id: '2', name: 'علاج الشعر', price: 150 },
    { id: '3', name: 'تجميل الأظافر', price: 80 },
  ];

  // Mock ticket generation and wait‑time calculation
  const mockTicket = `A${Math.floor(1000 + Math.random() * 9000)}`;
  const mockWait = Math.floor(Math.random() * 30) + 5; // minutes

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // ---------------------------------------------------------------------
  // Original Scan.jsx logic (commented for later integration)
  // ---------------------------------------------------------------------
  /*
   * import { Html5Qrcode } from 'html5-qrcode';
   * const startScan = async () => {
   *   const html5QrCode = new Html5Qrcode('qr-reader');
   *   await html5QrCode.start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 },
   *     decoded => { /* navigate to form with decoded *\/ },
   *     err => { /* ignore errors *\/ }
   *   );
   * };
   */

  // ---------------------------------------------------------------------
  // Original Form.jsx logic (commented for later integration)
  // ---------------------------------------------------------------------
  /*
   * // fetch services from Supabase, submit ticket, etc.
   * // handle validation, error handling, and navigation to confirmation.
   */

  return (
    <div className="page booking-wizard">
      {/* Gold progress bar */}
      <div className="progress-bar" style={{
        width: `${(step / 3) * 100}%`,
        backgroundColor: 'var(--color-primary)',
        height: '8px',
        borderRadius: 'var(--radius)',
        marginBottom: 'var(--spacing-md)'
      }} />

      {step === 1 && (
        <div className="step step-1">
          <h2 className="title">الخطوة 1 – مسح QR أو إدخال يدوي</h2>
          {/* Placeholder for real QR scanner */}
          <button className="qr-button" onClick={() => alert('محاكاة مسح QR')}>مسح QR</button>
          <div className="manual-input" style={{ marginTop: 'var(--spacing-sm)' }}>
            <label>أدخل الكود يدوياً:</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="الكود" />
          </div>
          <div className="nav-buttons" style={{ marginTop: 'var(--spacing-md)' }}>
            <button onClick={next} disabled={!code}>التالي</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step step-2">
          <h2 className="title">الخطوة 2 – بيانات العميل واختيار الخدمات</h2>
          <div className="field">
            <label>الاسم:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم" />
          </div>
          <div className="field">
            <label>رقم الهاتف:</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف" />
          </div>
          <div className="field services-list" style={{ marginTop: 'var(--spacing-sm)' }}>
            <label>اختر الخدمات:</label>
            {mockServices.map(s => (
              <div key={s.id} className="service-item" style={{ marginBottom: 'var(--spacing-xs)' }}>
                <input
                  type="checkbox"
                  id={`svc-${s.id}`}
                  checked={selectedServices.includes(s.id)}
                  onChange={e => {
                    if (e.target.checked) setSelectedServices([...selectedServices, s.id]);
                    else setSelectedServices(selectedServices.filter(id => id !== s.id));
                  }}
                />
                <label htmlFor={`svc-${s.id}`}>{s.name} – {s.price} ر.س</label>
              </div>
            ))}
          </div>
          <div className="nav-buttons" style={{ marginTop: 'var(--spacing-md)' }}>
            <button onClick={back}>السابق</button>
            <button onClick={next} disabled={!name || !phone || selectedServices.length === 0}>التالي</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step step-3">
          <h2 className="title">الخطوة 3 – التأكيد</h2>
          <p>الاسم: <strong>{name}</strong></p>
          <p>رقم الهاتف: <strong>{phone}</strong></p>
          <p>عدد الخدمات: <strong>{selectedServices.length}</strong></p>
          <p>رقم التذكرة: <strong>{mockTicket}</strong></p>
          <p>الوقت المتوقع للانتظار: <strong>{mockWait} دقيقة</strong></p>
          <p>شكراً لتسجيلك! سيصلك إشعار عندما يقترب دورك.</p>
          <div className="nav-buttons" style={{ marginTop: 'var(--spacing-md)' }}>
            <button onClick={() => {
              setName('');
              setPhone('');
              setSelectedServices([]);
              setStep(1);
            }}>حجز آخر</button>
          </div>
        </div>
      )}
    </div>
  );
}
