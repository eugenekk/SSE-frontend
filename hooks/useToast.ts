'use client';

import { useState, useCallback } from 'react';
import { ToastMessage } from '@/components/Toast';

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, type, message }]);
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  return {
    messages,
    showToast,
    removeMessage
  };
}