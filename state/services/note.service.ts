import { getBaseUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
// Create your service using a base URL and expected endpoints

export const NotesApi = createApi({
  reducerPath: 'NotesApi',
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
    getAllNotes: builder.mutation({
      query: (params: {
        pageNumber: number;
        pageSize: number;
        groupId: number;
        noteType: 1 | 2 | 3 | 4;
        businessUnit?: number;
      }) => ({
        url: '/note/get',
        method: 'GET',
        params,
      }),
    }),
    createNote: builder.mutation({
      query: (body: {
        noteType: 1 | 2 | 3 | 4;
        title: string;
        body: string;
        groupId: number;
      }) => ({
        url: '/note/create',
        method: 'POST',
        body,
      }),
    }),
    updateNote: builder.mutation({
      query: (body: { resolved: boolean; noteId: number }) => ({
        url: '/note/update',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useGetAllNotesMutation,
  useUpdateNoteMutation,
} = NotesApi;
