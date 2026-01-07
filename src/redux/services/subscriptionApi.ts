import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SubscriptionPlan {
  _id: string;
  planName: string;
  planId: string;
  active: boolean;
  description: string;
  planSchedule: [
    {
      planId: string;
      planValidity: number;
      planPrice: number;
      discount: number;
      perMonthPlanPrice: number;
      credits: number;
    },
  ];
  planFeatures: [
    {
      perks: string;
      description: string;
    },
  ];
}

export interface SubscriptionPlansResponse {
  statusCode: number;
  message: string;
  subscriptionPlans: SubscriptionPlan[];
}

export interface CreateSubscriptionInvoiceRequest {
  planId: string;
}

export interface CreateSubscriptionInvoiceResponse {
  success: boolean;
  data: {
    transactionId: string;
    invoiceUrl: string;
    amount: number;
    currency: string;
    planDetails: {
      planId: string;
      planName: string;
      planValidity: number;
      planPrice: number;
    };
    starsAmount: number;
    conversionInfo: {
      usdAmount: number;
      starsAmount: number;
      rate: string;
      baseRates: {
        starToInr: number;
        inrToUsd: number;
      };
    };
  };
  message: string;
}

export interface CompleteSubscriptionRequest {
  transactionId: string;
  paymentGatewayTransactionId?: string;
  paymentGatewayResponse?: any;
}

export interface CompleteSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    subscriptionDetails: {
      planId: string;
      planValidity: number;
      planPrice: number;
      startDate: string;
      expiryDate: string;
    };
  };
}

export interface FailSubscriptionRequest {
  transactionId: string;
  reason?: string;
}

export interface FailSubscriptionResponse {
  success: boolean;
  message: string;
}

export interface GetSubscriptionTransactionResponse {
  success: boolean;
  data: {
    transactionId: string;
    status: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
    description: string;
    metadata: any;
    createdAt: string;
    completedAt?: string;
  };
}

export interface PurchaseSubscriptionWithUPIRequest {
  planId: string;
}

export interface PurchaseSubscriptionWithUPIResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    subscriptionDetails: {
      planId: string;
      planValidity: number;
      planPrice: number;
      startDate: string;
      expiryDate: string;
    };
    walletDetails: {
      balance: number;
      credits: number;
      creditsAdded: number;
    };
  };
}

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as { auth: { token: string | null } }).auth.token ||
        (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['SubscriptionPlans', 'Subscription'],
  endpoints: builder => ({
    getSubscriptionPlans: builder.query<SubscriptionPlansResponse, void>({
      query: () => '/subscription/subscriptionPlans',
      providesTags: ['SubscriptionPlans'],
    }),
    createSubscriptionInvoice: builder.mutation<
      CreateSubscriptionInvoiceResponse,
      CreateSubscriptionInvoiceRequest
    >({
      query: body => ({
        url: '/subscription/telegram-stars/create-invoice',
        method: 'POST',
        body,
      }),
    }),
    completeSubscription: builder.mutation<
      CompleteSubscriptionResponse,
      CompleteSubscriptionRequest
    >({
      query: body => ({
        url: '/subscription/complete',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    failSubscription: builder.mutation<FailSubscriptionResponse, FailSubscriptionRequest>({
      query: body => ({
        url: '/subscription/fail',
        method: 'POST',
        body,
      }),
    }),
    getSubscriptionTransaction: builder.query<GetSubscriptionTransactionResponse, string>({
      query: transactionId => `/subscription/transaction/${transactionId}`,
      providesTags: ['Subscription'],
    }),
    purchaseSubscriptionWithUPI: builder.mutation<
      PurchaseSubscriptionWithUPIResponse,
      PurchaseSubscriptionWithUPIRequest
    >({
      query: body => ({
        url: '/subscription/upi/purchase',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionInvoiceMutation,
  useCompleteSubscriptionMutation,
  useFailSubscriptionMutation,
  useGetSubscriptionTransactionQuery,
  usePurchaseSubscriptionWithUPIMutation,
} = subscriptionApi;
