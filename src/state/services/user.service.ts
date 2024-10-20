import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const UserApi = createApi({
  reducerPath: 'UserApi',
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
    signIn: builder.mutation({
      query: body => ({
        url: '/authenticate/signin',
        method: 'POST',
        body,
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useSignInMutation } = UserApi;
