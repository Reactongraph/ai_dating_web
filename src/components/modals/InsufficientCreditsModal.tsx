'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InsufficientCreditsModal({
  isOpen,
  onClose,
}: InsufficientCreditsModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubscribe = () => {
    // Get current path to return to after subscription
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/subscriptions?returnTo=${encodeURIComponent(currentPath)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background-elevated rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-white-1a"
      >
        <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.599-2.101C14.402 14.895 14 14.105 14 13.2c0-1.105-.895-2-2-2m-2.1 2.9c.162.723.633 1.343 1.258 1.636M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-3 text-white">Insufficient Credits</h2>
        <p className="text-text-secondary mb-8">
          You don&apos;t have enough credits to send this message. Subscribe to a plan to continue
          your conversation.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleSubscribe}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98]"
          >
            Subscribe Now
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white/5 hover:bg-white/10 text-text-secondary font-medium py-3 rounded-xl transition-all"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
}
