import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const UsersApi = createApi({
  reducerPath: 'UsersApi',
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
    usersCount: builder.mutation({
      query: () => ({
        url: '/user/count',
        method: 'GET',
      }),
    }),
    getAllUsers: builder.mutation({
      query: (params: {
        pageNumber: number;
        pageSize: number;
        userType?: number;
        businessUnit?: number;
      }) => ({
        url: '/user/getall',
        method: 'GET',
        params,
      }),
    }),
    getUser: builder.mutation({
      query: (id: number) => ({
        url: `/user/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetAllUsersMutation,
  useGetUserMutation,
  useUsersCountMutation,
} = UsersApi;
