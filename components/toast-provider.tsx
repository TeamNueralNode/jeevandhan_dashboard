"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          color: '#374151',
          border: '1px solid #E5E7EB',
        },
        className: 'toast',
        duration: 4000,
      }}
    />
  );
}
