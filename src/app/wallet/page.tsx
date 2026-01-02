'use client';

import { useGetWalletQuery, useGetWalletTransactionsQuery } from '@/redux/services/walletApi';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function WalletPage() {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [page, setPage] = useState(1);

  const { data: walletData, isLoading: walletLoading } = useGetWalletQuery();
  const { data: transactionsData, isLoading: transactionsLoading } = useGetWalletTransactionsQuery({
    page,
    limit: 20,
    type: transactionFilter === 'all' ? undefined : transactionFilter,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: walletData?.data.currency || 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <p className="text-text-secondary mt-1">Manage your balance and transactions</p>
        </div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 mb-6 shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Available Balance</p>
              {walletLoading ? (
                <div className="h-10 w-32 bg-white/20 rounded animate-pulse" />
              ) : (
                <h2 className="text-4xl font-bold text-white">
                  {formatCurrency(walletData?.data.balance || 0)}
                </h2>
              )}
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddMoney(true)}
            className="w-full bg-white text-primary-600 font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Money
          </button>
        </motion.div>

        {/* Transaction Filter */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTransactionFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              transactionFilter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-background-elevated text-text-secondary hover:bg-white-1a'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTransactionFilter('credit')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              transactionFilter === 'credit'
                ? 'bg-primary-500 text-white'
                : 'bg-background-elevated text-text-secondary hover:bg-white-1a'
            }`}
          >
            Added
          </button>
          <button
            onClick={() => setTransactionFilter('debit')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              transactionFilter === 'debit'
                ? 'bg-primary-500 text-white'
                : 'bg-background-elevated text-text-secondary hover:bg-white-1a'
            }`}
          >
            Spent
          </button>
        </div>

        {/* Transactions List */}
        <div className="bg-background-elevated rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
          
          {transactionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-background-primary rounded-lg">
                  <div className="w-10 h-10 bg-white-1a rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-white-1a rounded animate-pulse mb-2" />
                    <div className="h-3 w-24 bg-white-1a rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-white-1a rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : transactionsData?.data.transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-background-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-text-secondary">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactionsData?.data.transactions.map((transaction) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-3 bg-background-primary rounded-lg hover:bg-white-1a transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    {transaction.type === 'credit' ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{transaction.description}</p>
                    <p className="text-sm text-text-secondary">{formatDate(transaction.createdAt)}</p>
                  </div>
                  
                  <div className="text-right">
                    <p
                      className={`font-semibold ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-text-secondary capitalize">{transaction.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {transactionsData && transactionsData.data.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-background-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white-1a transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-background-primary rounded-lg">
                Page {page} of {transactionsData.data.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(transactionsData.data.pages, p + 1))}
                disabled={page === transactionsData.data.pages}
                className="px-4 py-2 bg-background-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white-1a transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <AddMoneyModal onClose={() => setShowAddMoney(false)} />
      )}
    </div>
  );
}

// Add Money Modal Component
function AddMoneyModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const paymentMethods = [
    { id: 'stars', name: 'Telegram Stars', icon: '⭐', available: true },
    { id: 'upi', name: 'UPI', icon: '💳', available: true },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', available: true },
    { id: 'net_banking', name: 'Net Banking', icon: '🏦', available: true },
  ];

  const handleSubmit = () => {
    // TODO: Implement payment processing
    console.log('Adding money:', amount, selectedMethod);
    alert('Payment integration coming soon!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background-elevated rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Money</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white-1a rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Enter Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-text-secondary">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-background-primary border border-white-1a rounded-lg pl-10 pr-4 py-3 text-xl font-semibold focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2 mt-3">
            {[10, 25, 50, 100].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className="flex-1 px-3 py-2 bg-background-primary hover:bg-white-1a rounded-lg text-sm font-medium transition-colors"
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Select Payment Method</label>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
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
          disabled={!amount || !selectedMethod || parseFloat(amount) <= 0}
          className="w-full bg-primary-500 text-white font-semibold py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>
      </motion.div>
    </div>
  );
}
