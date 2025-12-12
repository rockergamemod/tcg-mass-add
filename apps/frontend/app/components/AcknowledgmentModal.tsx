'use client';

import { useEffect, useState } from 'react';

const ACKNOWLEDGMENT_KEY = 'tcgplayer-mass-add-intro-acknowledged';

export default function AcknowledgmentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged
    const acknowledged = localStorage.getItem(ACKNOWLEDGMENT_KEY);
    if (acknowledged !== 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem(ACKNOWLEDGMENT_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-2xl font-semibold leading-tight tracking-tight">
          Welcome to TCGplayer Mass Add
        </h2>
        <div className="mb-6 space-y-3 text-zinc-600 dark:text-zinc-400">
          <p>
            This tool helps you build card lists for TCGPlayer's Mass Entry
            feature.
          </p>
          <p>
            This is currently a <strong>beta</strong> application. Please report
            any issues you find.
          </p>
          <p>
            Please note that this is a third-party tool and is not affiliated
            with TCGPlayer. Use at your own discretion.
          </p>
        </div>
        <button
          onClick={handleAcknowledge}
          className="w-full rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}
