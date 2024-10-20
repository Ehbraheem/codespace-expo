import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const OrderApi = createApi({
  reducerPath: 'OrderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).user.user?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    orderCount: builder.mutation({
      query: () => ({
        url: '/order/count',
        method: 'GET',
      }),
    }),
    getAllOrders: builder.mutation({
      query: (params: {
        pageNumber: number;
        pageSize: number;
        businessUnit?: number;
      }) => ({
        url: '/order/getall',
        method: 'GET',
        params,
      }),
    }),
    getOrder: builder.mutation({
      query: (id: string) => ({
        url: `/order/${id}`,
        method: 'GET',
      }),
    }),
    createOrder: builder.mutation({
      query: (body: FormData) => ({
        url: '/order/create',
        method: 'POST',
        body,
      }),
    }),
    editOrder: builder.mutation({
      query: (body: {
        vesselId: number;
        title: string;
        supplierId: number;
        orderStatus: number;
        buProject: string;
        accepted: boolean;
        shippingId: number;
        orderId: number;
      }) => ({
        url: '/order/edit',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useEditOrderMutation,
  useGetAllOrdersMutation,
  useGetOrderMutation,
  useOrderCountMutation,
} = OrderApi;
