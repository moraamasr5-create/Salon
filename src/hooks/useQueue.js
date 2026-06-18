import { useState } from 'react';

/**
 * useQueue - manages an in‑memory queue of tickets.
 * Each ticket: { id, name, phone, services, waitTime, status }
 */
export default function useQueue(initialTickets = []) {
  const [queue, setQueue] = useState(initialTickets);

  const addTicket = (ticket) => {
    const newTicket = { ...ticket, id: Date.now(), status: 'waiting' };
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
