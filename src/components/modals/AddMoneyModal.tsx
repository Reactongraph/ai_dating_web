'use client';

import {
  useCreateTelegramStarsInvoiceMutation,
  useCompleteAddMoneyMutation,
  useFailTransactionMutation,
  useCreateAddMoneyIntentMutation,
} from '@/redux/services/walletApi';
import { useCustomSnackbar } from '@/providers/SnackbarProvider';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: string;
}

export default function AddMoneyModal({ isOpen, onClose, initialAmount }: AddMoneyModalProps) {
  const [amount, setAmount] = useState(initialAmount || '');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { showSnackbar } = useCustomSnackbar();

  const [createTelegramStarsInvoice] = useCreateTelegramStarsInvoiceMutation();
  const [completeAddMoney] = useCompleteAddMoneyMutation();
  const [failTransaction] = useFailTransactionMutation();
  const [createAddMoneyIntent] = useCreateAddMoneyIntentMutation();

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount]);

  const paymentMethods = [
    { id: 'stars', name: 'Telegram Stars', icon: '⭐', available: true },
    { id: 'upi', name: 'UPI', icon: '💳', available: true },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', available: true },
    { id: 'net_banking', name: 'Net Banking', icon: '🏦', available: true },
  ];

  const handleSubmit = async () => {
    if (!amount || !selectedMethod || parseFloat(amount) <= 0) return;

    if (parseFloat(amount) < 5) {
      showSnackbar('Minimum amount is $5', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      if (selectedMethod === 'stars') {
        const amountInUSD = parseFloat(amount);
        const response = await createTelegramStarsInvoice({
          amount: amountInUSD,
        }).unwrap();

        const invoiceUrl = response.data.invoiceUrl;
        const transactionId = response.data.transactionId;
        const starsAmount = response.data.starsAmount || 0;

        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          try {
            window.Telegram.WebApp.openInvoice(invoiceUrl, status => {
              if (status === 'paid') {
                completeAddMoney({ transactionId })
                  .unwrap()
                  .then(() => {
                    showSnackbar('Payment successful! Your wallet has been updated.', 'success');
                    onClose();
                  })
                  .catch(error => {
                    console.error('Error completing payment:', error);
                    showSnackbar('Payment verification failed. Please contact support.', 'error');
                  })
                  .finally(() => setIsProcessing(false));
              } else if (status === 'cancelled') {
                failTransaction({ transactionId, reason: 'Payment cancelled by user' });
                showSnackbar('Payment was cancelled.', 'info');
                setIsProcessing(false);
              } else {
                failTransaction({ transactionId, reason: `Payment ${status}` });
                showSnackbar(`Payment ${status}. Please try again.`, 'error');
                setIsProcessing(false);
              }
            });
          } catch (error) {
            window.Telegram.WebApp.openTelegramLink(invoiceUrl);
            showSnackbar('Invoice opened in Telegram.', 'info');
            setIsProcessing(false);
            onClose();
          }
        } else {
          window.open(invoiceUrl, '_blank');
          showSnackbar('Please complete payment in the opened window.', 'info');
          onClose();
          setIsProcessing(false);
        }
      } else if (selectedMethod === 'upi') {
        const amountInUSD = parseFloat(amount);
        const intentResponse = await createAddMoneyIntent({
          amount: amountInUSD,
          paymentMethod: 'upi',
        }).unwrap();

        const transactionId = intentResponse.data.transactionId;

        await completeAddMoney({
          transactionId,
          paymentGatewayTransactionId: `SIMULATED_UPI_${Date.now()}`,
          paymentGatewayResponse: { method: 'upi', status: 'success', simulated: true },
        }).unwrap();

        showSnackbar('Money added successfully via UPI!', 'success');
        onClose();
        setIsProcessing(false);
      } else {
        showSnackbar(`${paymentMethods.find(m => m.id === selectedMethod)?.name} integration coming soon!`, 'info');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      showSnackbar(error?.data?.message || 'Failed to process payment. Please try again.', 'error');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pb-24">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background-elevated rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto relative z-[10000] mb-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Money</h2>
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

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Enter Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-text-secondary">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-background-primary border border-white-1a rounded-lg pl-10 pr-4 py-3 text-xl font-semibold focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2 mt-3">
            {[10, 25, 50, 100].map(preset => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className="flex-1 px-3 py-2 bg-background-primary hover:bg-white-1a rounded-lg text-sm font-medium transition-colors"
              >
                ${preset}
              </button>
            ))}
          </div>
          {selectedMethod === 'stars' && amount && parseFloat(amount) > 0 && (
            <div className="mt-3 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
              <p className="text-sm text-text-secondary">
                ⭐ You will pay:{' '}
                <span className="font-semibold text-primary-500">
                  {Math.ceil(parseFloat(amount) * 44.5)} Stars
                </span>
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Rate: 1 USD = 44.5 Stars (1 Star = 2 INR, 89 INR = 1 USD)
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Select Payment Method</label>
          <div className="space-y-2">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                disabled={!method.available}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white-1a bg-background-primary hover:bg-white-1a'
                } ${!method.available && 'opacity-50 cursor-not-allowed'}`}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="font-medium flex-1 text-left">{method.name}</span>
                {selectedMethod === method.id && (
                  <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!amount || !selectedMethod || parseFloat(amount) <= 0 || isProcessing}
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
            'Continue to Payment'
          )}
        </button>
      </motion.div>
    </div>
  );
}

