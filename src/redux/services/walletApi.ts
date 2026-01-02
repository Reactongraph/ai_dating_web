import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Wallet {
  balance: number;
  currency: string;
  walletId: string;
}

export interface WalletTransaction {
  _id: string;
  transactionId: string;
  userId: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod?: 'stars' | 'upi' | 'card' | 'credit_card' | 'debit_card' | 'net_banking' | 'wallet' | 'other';
  description: string;
  orderId?: string;
  paymentGatewayTransactionId?: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletResponse {
  success: boolean;
  data: {
    balance: number;
    currency: string;
    walletId: string;
  };
}

export interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: WalletTransaction[];
    total: number;
    page: number;
    pages: number;
  };
}

export interface AddMoneyIntentRequest {
  amount: number;
  paymentMethod: 'stars' | 'upi' | 'card' | 'credit_card' | 'debit_card' | 'net_banking';
}

export interface AddMoneyIntentResponse {
  success: boolean;
  data: {
    transactionId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string;
  };
  message: string;
}

export interface CompleteAddMoneyRequest {
  transactionId: string;
  paymentGatewayTransactionId?: string;
  paymentGatewayResponse?: any;
}

export interface CompleteAddMoneyResponse {
  success: boolean;
  data: {
    transaction: {
      transactionId: string;
      amount: number;
      status: string;
      balanceAfter: number;
    };
    wallet: {
      balance: number;
      currency: string;
    };
  };
  message: string;
}

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state or localStorage
      const token =
        (getState() as { auth: { token: string | null } }).auth.token ||
        (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Wallet', 'WalletTransactions'],
  endpoints: builder => ({
    // Get wallet details
    getWallet: builder.query<WalletResponse, void>({
      query: () => '/wallet',
      providesTags: ['Wallet'],
    }),

    // Get wallet transactions
    getWalletTransactions: builder.query<
      TransactionsResponse,
      { page?: number; limit?: number; type?: 'credit' | 'debit' }
    >({
      query: ({ page = 1, limit = 20, type }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (type) {
          params.append('type', type);
        }
        return `/wallet/transactions?${params.toString()}`;
      },
      providesTags: ['WalletTransactions'],
    }),

    // Get transaction by ID
    getTransactionById: builder.query<{ success: boolean; data: WalletTransaction }, string>({
      query: transactionId => `/wallet/transaction/${transactionId}`,
    }),

    // Create add money intent
    createAddMoneyIntent: builder.mutation<AddMoneyIntentResponse, AddMoneyIntentRequest>({
      query: body => ({
        url: '/wallet/add-money/intent',
        method: 'POST',
        body,
      }),
    }),

    // Complete add money transaction
    completeAddMoney: builder.mutation<CompleteAddMoneyResponse, CompleteAddMoneyRequest>({
      query: body => ({
        url: '/wallet/add-money/complete',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet', 'WalletTransactions'],
    }),

    // Add money directly (for testing)
    addMoneyDirect: builder.mutation<
      CompleteAddMoneyResponse,
      { amount: number; paymentMethod?: string; description?: string }
    >({
      query: body => ({
        url: '/wallet/add-money',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet', 'WalletTransactions'],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
  useGetTransactionByIdQuery,
  useCreateAddMoneyIntentMutation,
  useCompleteAddMoneyMutation,
  useAddMoneyDirectMutation,
} = walletApi;
