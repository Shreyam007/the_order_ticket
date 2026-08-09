import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useSSE() {
  const { user } = useAuth();
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!user) return;

    const userId = user.id || user._id;
    const eventSource = new EventSource(`/api/events?userId=${userId}`);

    eventSource.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setLastEvent({ type: 'message', data: parsed });
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    const handleCustomEvent = (eventName) => (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setLastEvent({ type: eventName, data: parsed });
      } catch (err) {
        console.error(`Error parsing SSE ${eventName}:`, err);
      }
    };

    eventSource.addEventListener('order:created', handleCustomEvent('order:created'));
    eventSource.addEventListener('order:statusChanged', handleCustomEvent('order:statusChanged'));
    eventSource.addEventListener('order:riderAssigned', handleCustomEvent('order:riderAssigned'));

    eventSource.onerror = (err) => {
      console.warn('SSE stream error, retrying connection...', err);
    };

    return () => {
      eventSource.close();
    };
  }, [user]);

  return { lastEvent };
}
