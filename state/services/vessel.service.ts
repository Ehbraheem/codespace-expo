import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const VesselApi = createApi({
  reducerPath: 'VesselApi',
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
    getAllVessels: builder.mutation({
      query: (params: {
        pageNumber: number;
        pageSize: number;
        userType: number;
        businessUnit?: number;
      }) => ({
        url: '/vessel/getall',
        method: 'GET',
        params,
      }),
    }),
    createVessel: builder.mutation({
      query: (body: {
        name: string;
        type: string;
        size: string;
        owner: string;
        orderSize: number;
        cargoDetail: string;
        billOfLaden: string;
        portOfLoading: string;
        orderType: string;
        poNumber: number;
        incoterm: string;
      }) => ({
        url: '/vessel/create',
        method: 'POST',
        body,
      }),
    }),
    updateVessel: builder.mutation({
      query: (body: {
        id: number;
        name: string;
        type: string;
        size: string;
        owner: string;
      }) => ({
        url: '/vessel/update',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateVesselMutation,
  useGetAllVesselsMutation,
  useUpdateVesselMutation,
} = VesselApi;
