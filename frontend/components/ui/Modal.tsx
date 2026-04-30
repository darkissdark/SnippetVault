'use client';

import { ReactNode, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
};

export function Modal({ title, children, onClose, footer }: ModalProps) {
  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.documentElement.removeAttribute('style');
    };
  }, [handleEsc]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto p-4">{children}</div>

        {footer ? (
          <div className="border-t border-slate-200 px-4 py-3">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
