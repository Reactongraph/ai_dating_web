'use client';

import {
  useCreateSubscriptionInvoiceMutation,
  useCompleteSubscriptionMutation,
  useFailSubscriptionMutation,
  usePurchaseSubscriptionWithUPIMutation,
} from '@/redux/services/subscriptionApi';
import { useVerifySessionMutation } from '@/redux/services/googleAuthApi';
import { useCustomSnackbar } from '@/providers/SnackbarProvider';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';

interface SubscriptionPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  planPrice: number;
  planValidity: number;
  onSuccess?: () => void;
}

export default function SubscriptionPurchaseModal({
  isOpen,
  onClose,
  planId,
  planName,
  planPrice,
  planValidity,
  onSuccess,
}: SubscriptionPurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stars' | 'upi'>('stars');

  const dispatch = useDispatch();
  const { showSnackbar } = useCustomSnackbar();

  const [createSubscriptionInvoice] = useCreateSubscriptionInvoiceMutation();
  const [completeSubscription] = useCompleteSubscriptionMutation();
  const [failSubscription] = useFailSubscriptionMutation();
  const [purchaseWithUPI] = usePurchaseSubscriptionWithUPIMutation();
  const [verifySession] = useVerifySessionMutation();

  // Helper function to refresh user session data
  const refreshUserSession = async () => {
    try {
      const sessionToken =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;

      if (sessionToken && userDataStr) {
        const userData = JSON.parse(userDataStr);
        const response = await verifySession({
          sessionToken,
          email: userData.email || '',
          userId: userData._id || userData.id || '',
        }).unwrap();

        // Update Redux store with fresh user data
        if (response.user) {
          dispatch(setCredentials(response));
        }
      }
    } catch (error) {
      console.error('Error refreshing user session:', error);
      // Don't show error to user, just log it
    }
  };

  const handleUPIPurchase = async () => {
    setIsProcessing(true);

    try {
      const response = await purchaseWithUPI({
        planId,
      }).unwrap();

      // Refresh user session to get updated premium status
      await refreshUserSession();

      showSnackbar('Subscription activated successfully! 🎉', 'success');
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      console.error('UPI purchase error:', error);
      showSnackbar(
        error?.data?.message || 'Failed to process subscription. Please try again.',
        'error',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStarsPurchase = async () => {
    setIsProcessing(true);

    try {
      // Create subscription invoice
      const response = await createSubscriptionInvoice({
        planId,
      }).unwrap();

      const invoiceUrl = response.data.invoiceUrl;
      const transactionId = response.data.transactionId;
      const starsAmount = response.data.starsAmount || 0;

      // Open invoice in Telegram
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        try {
          window.Telegram.WebApp.openInvoice(invoiceUrl, status => {
            if (status === 'paid') {
              // Complete subscription purchase
              completeSubscription({ transactionId })
                .unwrap()
                .then(async () => {
                  // Refresh user session to get updated premium status
                  await refreshUserSession();

                  showSnackbar('Subscription activated successfully! 🎉', 'success');
                  if (onSuccess) {
                    onSuccess();
                  } else {
                    onClose();
                  }
                })
                .catch(error => {
                  console.error('Error completing subscription:', error);
                  showSnackbar('Subscription activation failed. Please contact support.', 'error');
                })
                .finally(() => setIsProcessing(false));
            } else if (status === 'cancelled') {
              failSubscription({ transactionId, reason: 'Payment cancelled by user' });
              showSnackbar('Subscription purchase was cancelled.', 'info');
              setIsProcessing(false);
            } else {
              failSubscription({ transactionId, reason: `Payment ${status}` });
              showSnackbar(`Payment ${status}. Please try again.`, 'error');
              setIsProcessing(false);
            }
          });
        } catch (error) {
          // Fallback: open in Telegram external browser
          window.Telegram.WebApp.openTelegramLink(invoiceUrl);
          showSnackbar('Invoice opened in Telegram.', 'info');
          setIsProcessing(false);
          onClose();
        }
      } else {
        // Non-Telegram environment: open in new tab
        window.open(invoiceUrl, '_blank');
        showSnackbar('Please complete payment in the opened window.', 'info');
        onClose();
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Subscription purchase error:', error);
      showSnackbar(
        error?.data?.message || 'Failed to process subscription. Please try again.',
        'error',
      );
      setIsProcessing(false);
    }
  };

  const handlePurchase = async () => {
    if (paymentMethod === 'upi') {
      await handleUPIPurchase();
    } else {
      await handleStarsPurchase();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pb-24">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background-elevated rounded-2xl p-6 max-w-md w-full relative z-[10000] mb-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Subscribe to {planName}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white-1a rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-text-secondary mb-3">Choose Payment Method:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('stars')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'stars'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-white-1a bg-background-primary hover:bg-white-1a'
              }`}
            >
              <div className="text-center">
                <span className="text-2xl mb-2 block">⭐</span>
                <span className="text-sm font-semibold">Telegram Stars</span>
              </div>
            </button>
            {/* <button
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'upi'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-white-1a bg-background-primary hover:bg-white-1a'
              }`}
            >
              <div className="text-center">
                <span className="text-2xl mb-2 block">💳</span>
                <span className="text-sm font-semibold">UPI</span>
              </div>
            </button> */}
          </div>
        </div>

        {/* Plan Details */}
        <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-secondary">Plan Duration:</span>
            <span className="font-semibold text-primary-500">
              {planValidity} {planValidity === 1 ? 'Month' : 'Months'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Total Price:</span>
            <span className="font-bold text-2xl text-white">
              {paymentMethod === 'upi' ? `₹${Math.ceil(planPrice * 89)}` : `$${planPrice}`}
            </span>
          </div>
          {paymentMethod === 'stars' && (
            <div className="mt-3 pt-3 border-t border-white-1a">
              <p className="text-sm text-text-secondary">
                ⭐ You will pay:{' '}
                <span className="font-semibold text-primary-500">
                  {Math.ceil(planPrice * 44.5)} Stars
                </span>
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Rate: 1 USD = 44.5 Stars (1 Star = 2 INR, 89 INR = 1 USD)
              </p>
            </div>
          )}
          {paymentMethod === 'upi' && (
            <div className="mt-3 pt-3 border-t border-white-1a">
              <p className="text-sm text-text-secondary">
                💳 You will pay:{' '}
                <span className="font-semibold text-primary-500">₹{Math.ceil(planPrice * 89)}</span>
              </p>
              <p className="text-xs text-text-secondary mt-1">Rate: 1 USD = ₹89 (approx.)</p>
            </div>
          )}
        </div>

        {/* Features Preview */}
        <div className="mb-6 space-y-2">
          <p className="text-sm font-medium text-text-secondary mb-3">What you'll get:</p>
          <div className="space-y-2">
            {[
              'Unlimited chat messages',
              'AI-generated images',
              'Premium AI companions',
              'Priority support',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-text-secondary">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full bg-primary-500 text-white font-semibold py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span>{paymentMethod === 'upi' ? '💳' : '⭐'}</span>
              {paymentMethod === 'upi' ? 'Subscribe with UPI' : 'Subscribe with Telegram Stars'}
            </>
          )}
        </button>

        {/* Security Info */}
        <p className="text-xs text-text-secondary text-center mt-4">
          🔒 Secure payment via {paymentMethod === 'upi' ? 'UPI' : 'Telegram Stars'}. Cancel
          anytime.
        </p>
      </motion.div>
    </div>
  );
}
