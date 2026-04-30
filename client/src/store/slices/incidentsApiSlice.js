import { apiSlice } from './apiSlice';

export const incidentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIncidents: builder.query({
      query: (params) => ({ url: '/incidents', params }),
      providesTags: ['Incident'],
    }),
    getIncident: builder.query({
      query: (id) => `/incidents/${id}`,
      providesTags: (result, error, id) => [{ type: 'Incident', id }],
    }),
    createIncident: builder.mutation({
      query: (data) => ({ url: '/incidents', method: 'POST', body: data }),
      invalidatesTags: ['Incident'],
    }),
    addUpdate: builder.mutation({
      query: ({ id, data }) => ({ url: `/incidents/${id}/updates`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Incident', id }],
    }),
    resolveIncident: builder.mutation({
      query: (id) => ({ url: `/incidents/${id}/resolve`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Incident', id }],
    }),
    generateSummary: builder.mutation({
      query: (id) => ({ url: `/incidents/${id}/summary`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Incident', id }],
    }),
    generatePostmortem: builder.mutation({
      query: (id) => ({ url: `/incidents/${id}/postmortem`, method: 'POST' }),
      invalidatesTags: ['Postmortem'],
    }),
    getPostmortem: builder.query({
      query: (id) => `/incidents/${id}/postmortem`,
      providesTags: ['Postmortem'],
    }),
  }),
});

export const {
  useGetIncidentsQuery,
  useGetIncidentQuery,
  useCreateIncidentMutation,
  useAddUpdateMutation,
  useResolveIncidentMutation,
  useGenerateSummaryMutation,
  useGeneratePostmortemMutation,
  useGetPostmortemQuery,
} = incidentsApiSlice;
