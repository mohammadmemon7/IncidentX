import { apiSlice } from './apiSlice';

export const monitorsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMonitors: builder.query({
      query: () => '/monitors',
      providesTags: ['Monitor'],
    }),
    getMonitor: builder.query({
      query: (id) => `/monitors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Monitor', id }],
    }),
    createMonitor: builder.mutation({
      query: (data) => ({ url: '/monitors', method: 'POST', body: data }),
      invalidatesTags: ['Monitor'],
    }),
    updateMonitor: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/monitors/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Monitor', id }, 'Monitor'],
    }),
    deleteMonitor: builder.mutation({
      query: (id) => ({ url: `/monitors/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Monitor'],
    }),
    triggerCheck: builder.mutation({
      query: (id) => ({ url: `/monitors/${id}/check`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Monitor', id }],
    }),
  }),
});

export const {
  useGetMonitorsQuery,
  useGetMonitorQuery,
  useCreateMonitorMutation,
  useUpdateMonitorMutation,
  useDeleteMonitorMutation,
  useTriggerCheckMutation,
} = monitorsApiSlice;
