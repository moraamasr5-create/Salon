import { useState } from 'react';
import { useTenant } from '../context/TenantContext';

// Initial mock services data
const initialServices = [
  { id: 1, name: 'قص شعر', price: 50, duration_minutes: 30, category: 'شعر', tips: 'استخدام مشط' },
  { id: 2, name: 'تشذيب لحية', price: 40, duration_minutes: 20, category: 'لحية', tips: '' },
  { id: 3, name: 'علاج بشرة', price: 120, duration_minutes: 45, category: 'بشرة', tips: 'تطبيق كريم' },
];

export default function useServices(initial = initialServices) {
  const { tenantId } = useTenant();
  const [services, setServices] = useState(() => initial.map(s => ({ ...s, tenant_id: tenantId })));

  const addService = (service) => {
    const newService = { ...service, id: Date.now(), tenant_id: tenantId };
    setServices((prev) => [...prev, newService]);
    console.log('Add service (API placeholder)', newService);
  };

  const updateService = (id, updates) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    console.log('Update service (API placeholder)', id, updates);
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    console.log('Delete service (API placeholder)', id);
  };

  return { services, addService, updateService, deleteService };
}
