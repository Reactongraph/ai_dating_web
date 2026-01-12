'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSnackbar } from '@/providers';
import { IoClose, IoCopyOutline, IoShareSocialOutline } from 'react-icons/io5';
import { useGetPublicWalletSettingsQuery } from '@/redux/services/walletApi';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
}

export default function ReferralModal({ isOpen, onClose, referralCode }: ReferralModalProps) {
  const { showSnackbar } = useSnackbar();
  const [isCopying, setIsCopying] = useState(false);

  // Fetch public wallet settings for dynamic referral bonus
  const { data: settingsData } = useGetPublicWalletSettingsQuery();
  const referralBonus = settingsData?.data?.referralBonusCredits || 0.4;

  // Get bot username from environment variables
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'dailyloveai_bot';
  const referralLink = `https://t.me/${botUsername}?startapp=${referralCode}`;

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    const notifySuccess = () => {
      showSnackbar(
        `${type === 'code' ? 'Referral code' : 'Referral link'} copied to clipboard!`,
        'success',
      );
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    };

    // Try modern Clipboard API
    if (navigator.clipboard && typeof window !== 'undefined' && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        notifySuccess();
        return;
      } catch (err) {
        console.error('Clipboard API failed, falling back:', err);
      }
    }

    // Fallback: document.execCommand('copy')
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Ensure textarea is not visible but part of DOM
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        notifySuccess();
      } else {
        throw new Error('Fallback copy failed');
      }
    } catch (err) {
      showSnackbar('Failed to copy to clipboard', 'error');
    }
  };

  const handleShare = async () => {
    const shareText = `Use my referral code ${referralCode} to get started on Daily Love!`;
    const shareUrl = referralLink;

    // Special handling for Telegram Mini App
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.Telegram.WebApp.openTelegramLink(telegramShareUrl);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Daily Love!',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // Share cancelled or failed
      }
    } else {
      copyToClipboard(referralLink, 'link');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Backdrop for closing */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full relative z-10 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <IoClose size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoShareSocialOutline className="text-cyan-400 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Referral Program</h2>
          <p className="text-gray-400 text-sm">
            Invite your friends to Daily Love and earn credits!
          </p>
        </div>

        <div className="bg-black/40 rounded-xl p-4 mb-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Your Reward</p>
              <p className="text-lg text-white font-bold">{referralBonus} Credits</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">For Each Signup</p>
              <p className="text-sm text-cyan-400 font-medium">Telegram Only</p>
            </div>
          </div>
          <div className="h-px bg-gray-800 mb-4" />
          <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Your Referral Code</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-center text-xl font-mono font-bold text-white tracking-widest border border-gray-700">
              {referralCode}
            </div>
            <button
              onClick={() => copyToClipboard(referralCode, 'code')}
              className="px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 flex items-center justify-center"
              title="Copy Code"
            >
              <IoCopyOutline size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Share Referral Link</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-800/50 rounded-lg px-3 py-2 text-sm text-gray-400 truncate border border-gray-800">
              {referralLink}
            </div>
            <button
              onClick={() => copyToClipboard(referralLink, 'link')}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
              title="Copy Link"
            >
              <IoCopyOutline size={18} />
            </button>
          </div>

          <button
            onClick={handleShare}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            <IoShareSocialOutline size={20} />
            Share with Friends
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-6">
          * Credits are added to your account once your friend signs up successfully via Telegram.
        </p>
      </motion.div>
    </div>
  );
}
