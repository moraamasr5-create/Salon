import { useState } from 'react';
import { useTenant } from '../context/TenantContext';

/**
 * useQueue - manages an in‑memory queue of tickets.
 * Each ticket: { id, name, phone, services, waitTime, status }
 */
export default function useQueue(initialTickets = []) {
  const { tenantId } = useTenant();
  const [queue, setQueue] = useState(() => initialTickets.map(t => ({ ...t, tenant_id: tenantId })));

  const addTicket = (ticket) => {
    const newTicket = { ...ticket, id: Date.now(), status: 'waiting', tenant_id: tenantId };
    setQueue((prev) => [...prev, newTicket]);
    console.log('Add ticket (API placeholder)', newTicket);
  };

  const updateTicket = (id, updates) => {
    setQueue((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    console.log('Update ticket (API placeholder)', id, updates);
  };

  const removeTicket = (id) => {
    setQueue((prev) => prev.filter((t) => t.id !== id));
    console.log('Remove ticket (API placeholder)', id);
  };

  return { queue, addTicket, updateTicket, removeTicket };
}
