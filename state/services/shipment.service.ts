import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const ShipmentApi = createApi({
  reducerPath: 'ShipmentApi',
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
    getAllShipments: builder.mutation({
      query: (params: {
        pageNumber: number;
        pageSize: number;
        listId?: number;
        businessUnit?: number;
      }) => ({
        url: '/shipment/getall',
        method: 'GET',
        params,
      }),
    }),
    getShipment: builder.mutation({
      query: (params: { orderId: number; shipmentId: number }) => ({
        url: '/shipment/get',
        method: 'GET',
        params,
      }),
    }),
    createShipment: builder.mutation({
      query: (body: {
        orderId: number;
        vesselId: number;
        portOfLoading: string;
        portOfDischarge: string;
        cargoDetail: string;
        loadingDate?: string;
        arrivalDate?: string;
        poNumber: string;
        blNumber: string;
        shippingLine: string;
      }) => ({
        url: '/shipment/create',
        method: 'POST',
        body,
      }),
    }),
    editShipment: builder.mutation({
      query: (body: { orderId: number; blNumber: string }) => ({
        url: '/shipment/edit',
        method: 'PUT',
        body,
      }),
    }),
    shipmentCount: builder.mutation({
      query: () => ({
        url: '/shipment/count',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateShipmentMutation,
  useEditShipmentMutation,
  useGetAllShipmentsMutation,
  useGetShipmentMutation,
  useShipmentCountMutation,
} = ShipmentApi;
