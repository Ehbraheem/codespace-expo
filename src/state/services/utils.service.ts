// import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const UtilsApi = createApi({
  reducerPath: 'UtilsApi',
  baseQuery: fetchBaseQuery({
    // baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).user.user?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        headers.set(
          'x-api-key',
          'PMAK-63f688d013b5476626fb78d6-206430c71b9097163c68d08a0c14ec2dc6',
        );
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    run: builder.mutation({
      query: ({
        url,
        method,
        params,
        body,
        headers,
      }: {
        url: string;
        method: string;
        params?: any;
        body?: any;
        headers?: any;
      }) => ({
        url: `${url}`,
        method,
        body,
        params,
        headers,
      }),
    }),
  }),
});

export const { useRunMutation } = UtilsApi;
