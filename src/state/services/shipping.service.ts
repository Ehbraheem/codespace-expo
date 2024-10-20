import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const ShippingApi = createApi({
  reducerPath: 'ShippingApi',
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
    getAllShipping: builder.mutation({
      query: (params: {
        pageNumber: number;
        pageSize: number;
        businessUnit?: number;
      }) => ({
        url: '/shipping/getall',
        method: 'GET',
        params,
      }),
    }),
    getAllShippingDoc: builder.mutation({
      query: (params: { pageNumber: number; pageSize: number }) => ({
        url: '/shipping/doc/getall',
        method: 'GET',
        params: {
          ...params,
          businessUnit: 0,
        },
      }),
    }),
    createShipping: builder.mutation({
      query: (body: {
        origin: string;
        portOfLoading: string;
        poNumber: string;
        destination: string;
        description: string;
        edd: string;
        orderType: string;
        incoterm: string;
        orderSize: string;
        docId?: string;
        orderSizeUnit: string;
      }) => ({
        url: '/shipping/create',
        method: 'POST',
        body,
      }),
    }),
    createShippingDoc: builder.mutation({
      query: (body: { path: string; docName: string }) => ({
        url: '/shipping/doc/create',
        method: 'POST',
        body,
      }),
    }),
    getShipping: builder.mutation({
      query: (id: number) => ({
        url: `/shipping/${id}`,
        method: 'GET',
      }),
    }),
    getShippingDoc: builder.mutation({
      query: (id: number) => ({
        url: `/shipping/doc/${id}`,
        method: 'GET',
      }),
    }),
    editShipping: builder.mutation({
      query: (body: {
        id: number;
        origin: string;
        portOfLoading: string;
        poNumber: string;
        destination: string;
        description: string;
        edd: string;
        orderType: string;
        orderSizeUnit: string;
        incoterm: string;
        orderSize: string;
        docId?: string;
      }) => ({
        url: '/shipping/edit',
        method: 'PUT',
        body,
      }),
    }),
    editShippingDoc: builder.mutation({
      query: (body: {
        docType: string;
        document: string;
        purchaseOrder: string;
        path: string;
        shippingId: number;
        docName: string;
        shippingDocId: number;
      }) => ({
        url: '/shipping/doc/edit',
        method: 'PUT',
        body,
      }),
    }),
    shippingCount: builder.mutation({
      query: () => ({
        url: '/shipping/count',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateShippingDocMutation,
  useCreateShippingMutation,
  useEditShippingMutation,
  useGetAllShippingDocMutation,
  useGetAllShippingMutation,
  useGetShippingDocMutation,
  useGetShippingMutation,
  useShippingCountMutation,
} = ShippingApi;
