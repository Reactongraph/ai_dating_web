'use client';

import { useGetWalletQuery, useGetWalletTransactionsQuery } from '@/redux/services/walletApi';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AddMoneyModal from '@/components/modals/AddMoneyModal';

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
          <p className="text-text-secondary mt-1">Manage your credits and transactions</p>
        </div>

        {/* Wallet Credits Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 mb-6 shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-white/80 text-sm mb-1">Available Credits</p>
              {walletLoading ? (
                <div className="h-10 w-32 bg-white/20 rounded animate-pulse" />
              ) : (
                <div>
                  <h2 className="text-4xl font-bold text-white">{walletData?.data.credits || 0}</h2>
                  {/* <p className="text-white/60 text-xs mt-1">
                    Balance: ${walletData?.data.balance?.toFixed(2) || '0.00'}
                  </p> */}
                </div>
              )}
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={() => setShowAddMoney(true)}
            className="w-full bg-white text-primary-600 font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Credits
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
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-background-primary rounded-lg"
                >
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
                <svg
                  className="w-8 h-8 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
              {transactionsData?.data.transactions.map(transaction => (
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
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{transaction.description}</p>
                    <p className="text-sm text-text-secondary">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-semibold ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                      {transaction.credits} credits
                    </p>
                    <p className="text-xs text-text-secondary">
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
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-background-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white-1a transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-background-primary rounded-lg">
                Page {page} of {transactionsData.data.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(transactionsData.data.pages, p + 1))}
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
      <AddMoneyModal isOpen={showAddMoney} onClose={() => setShowAddMoney(false)} />
    </div>
  );
}
