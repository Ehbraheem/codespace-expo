import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const StorageApi = createApi({
  reducerPath: 'StorageApi',
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
    storageRun: builder.mutation({
      query: (params: {
        pageNumber: number;
        pageSize: number;
        lisId: number;
        businessUnit?: number;
      }) => ({
        url: '/Storage/run',
        method: 'GET',
        params,
      }),
    }),
    storage: builder.mutation({
      query: (body: {
        orderId: number;
        vesselId: number;
        portOfLoading: string;
        portOfDischarge: string;
        cargoDetail: string;
        loadingDate: string;
        arrivalDate: string;
        poNumber: string;
        blNumber: string;
        shippingLine: string;
      }) => ({
        url: '/Storage',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useStorageMutation, useStorageRunMutation } = StorageApi;
