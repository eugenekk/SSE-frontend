'use client';

import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  messages: ToastMessage[];
  removeMessage: (id: string) => void;
}

export function Toast({ messages, removeMessage }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {messages.map((toast) => (
        <ToastItem key={toast.id} toast={toast} remove={() => removeMessage(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, remove }: { toast: ToastMessage; remove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(remove, 4000);
    return () => clearTimeout(timer);
  }, [remove]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[toast.type];

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg min-w-[300px] animate-slide-in`}
      onClick={remove}
    >
      {toast.message}
    </div>
  );
}