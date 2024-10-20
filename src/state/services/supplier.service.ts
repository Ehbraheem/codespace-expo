import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const SupplierApi = createApi({
  reducerPath: 'SupplierApi',
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
    getAllSuppliers: builder.mutation({
      query: (params: {
        pageNumber: number;
        pageSize: number;
        businessUnit?: number;
      }) => ({
        url: '/supplier/getall',
        method: 'GET',
        params,
      }),
    }),
    createSupplier: builder.mutation({
      query: (body: {
        name: string;
        email: string;
        address: string;
        country: string;
        phone: string;
      }) => ({
        url: '/supplier/create',
        method: 'POST',
        body,
      }),
    }),
    editSupplier: builder.mutation({
      query: (body: {
        email: string;
        name: string;
        country: string;
        phone: string;
        owner: string;
        address: string;
        id: number;
      }) => ({
        url: '/supplier/edit',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useCreateSupplierMutation,
  useEditSupplierMutation,
  useGetAllSuppliersMutation,
} = SupplierApi;
