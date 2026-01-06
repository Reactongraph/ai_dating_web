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
  tagTypes: ['SubscriptionPlans'],
  endpoints: builder => ({
    getSubscriptionPlans: builder.query<SubscriptionPlansResponse, void>({
      query: () => '/subscription/subscriptionPlans',
      providesTags: ['SubscriptionPlans'],
    }),
  }),
});

export const { useGetSubscriptionPlansQuery } = subscriptionApi;
