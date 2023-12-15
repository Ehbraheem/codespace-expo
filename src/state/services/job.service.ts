import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const JobApi = createApi({
  reducerPath: 'JobApi',
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
    getAllJobs: builder.mutation({
      query: (params: {
        pageNumber: number;
        pageSize: number;
        businessUnit?: number;
      }) => ({
        url: '/job/getall',
        method: 'GET',
        params,
      }),
    }),
    getJob: builder.mutation({
      query: (id: string) => ({
        url: `/job/${id}`,
        method: 'GET',
      }),
    }),
    createJob: builder.mutation({
      query: (body: FormData) => ({
        url: '/job/create',
        method: 'POST',
        body,
      }),
    }),
    editJob: builder.mutation({
      query: (body: {
        businessUnit: string;
        blNumber: string;
        noOfContainers: number;
        status: number;
        jobReferenceNumber: number;
        orderId: number;
        agentId: string;
      }) => ({
        url: '/job/edit',
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useCreateJobMutation,
  useEditJobMutation,
  useGetAllJobsMutation,
  useGetJobMutation,
} = JobApi;
