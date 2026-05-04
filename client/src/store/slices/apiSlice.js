import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL || ''}/api`.replace('/api/api', '/api'),
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

// Wrapper that auto-logs out user if their token is stale/invalid (401)
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const msg = result.error.data?.message || '';
    // Only force-logout if the user truly doesn't exist (stale token),
    // NOT if they're just hitting a public-protected endpoint
    if (msg.includes('user not found') || msg.includes('token failed')) {
      console.warn('[Auth] Stale token detected. Logging out.');
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Incident', 'User', 'Postmortem', 'IngestLog', 'Monitor'],
  endpoints: (builder) => ({}),
});
