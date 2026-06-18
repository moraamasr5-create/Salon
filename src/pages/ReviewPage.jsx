import React, { useState } from 'react';

// Mock data for completed services and staff
const mockReview = {
  services: [
    { id: 1, name: 'قص شعر', price: 50, duration: 30 },
    { id: 2, name: 'تشذيب لحية', price: 40, duration: 20 },
    { id: 3, name: 'علاج بشرة', price: 120, duration: 45 },
  ],
  staff: { name: 'أحمد علي', avatar: null }, // avatar placeholder
};

// Simple star component – gold when filled, grey otherwise
function Star({ filled }) {
  return (
    <span
      className="star"
      style={{
        color: filled ? 'var(--color-primary)' : '#555',
        fontSize: '1.5rem',
        transition: 'color 0.3s',
      }}
    >
      ★
    </span>
  );
}

export default function ReviewPage() {
  const [serviceRatings, setServiceRatings] = useState(
    mockReview.services.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {})
  );
  const [overallRating, setOverallRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleServiceRate = (id, rating) => {
    setServiceRatings((prev) => ({ ...prev, [id]: rating }));
  };

  const calculateOverall = () => {
    const values = Object.values(serviceRatings).filter((v) => v > 0);
    if (values.length === 0) return overallRating;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.round(avg);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Review submitted:', { serviceRatings, overall: calculateOverall(), comment });
    // Simulate async request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="page review-page">
        <h2>تم إرسالك!</h2>
        <p>شكراً لتقييمك. سيتم مراجعة ملاحظاتك قريباً.</p>
        <button onClick={() => {
          setSubmitted(false);
          setServiceRatings(mockReview.services.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {}));
          setComment('');
        }} style={{ marginTop: 16, padding: '8px 16px' }}>
          تقييم آخر
        </button>
      </div>
    );
  }

  return (
    <div className="page review-page">
      <h2>تقييم الخدمات المكتملة</h2>

      {/* Services list with per‑service rating */}
      <ul className="services-list" style={{ listStyle: 'none', padding: 0 }}>
        {mockReview.services.map((s) => (
          <li
            key={s.id}
            className="service-item"
            style={{
              borderBottom: '1px solid #444',
              padding: '12px 0',
            }}
          >
            <div className="service-info" style={{ marginBottom: 8 }}>
              <strong>{s.name}</strong> – {s.price} ر.س • {s.duration} دقيقة
            </div>
            <div className="rating-stars" style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((val) => (
                <span
                  key={val}
                  onClick={() => handleServiceRate(s.id, val)}
                  style={{ cursor: 'pointer' }}
                >
                  <Star filled={serviceRatings[s.id] >= val} />
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {/* Overall rating - animated stars */}
      <div className="overall-rating" style={{ marginTop: 24, textAlign: 'center' }}>
        <h3>التقييم العام</h3>
        <div className="overall-stars" style={{ display: 'inline-flex', gap: '6px' }}>
          {[1, 2, 3, 4, 5].map((val) => (
            <Star
              key={val}
              filled={calculateOverall() >= val}
            />
          ))}
        </div>
      </div>

      {/* Staff info */}
      <div className="staff-info" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          className="avatar"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1rem',
          }}
        >
          {mockReview.staff.name.charAt(0)}
        </div>
        <div className="staff-name">{mockReview.staff.name}</div>
      </div>

      {/* Comment textarea */}
      <div style={{ marginTop: 24, maxWidth: 500 }}>
        <div style={{ marginBottom: 12 }}>
          <label>تعليق (اختياري)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: 6,
              borderRadius: '4px',
              border: '1px solid #444',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
            }}
          />
        </div>
        <button type="button" onClick={submit} disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'جارٍ الإرسال…' : 'إرسال التقييم'}
        </button>
      </div>
    </div>
  );
}

/*
  // Future integration – post to API with mocked payload
  // const payload = { services: serviceRatings, overall: calculateOverall(), comment, staffId: mockReview.staff.id };
*/
