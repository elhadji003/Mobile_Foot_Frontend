import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "./features/auth/authSlice";
import { BASEQUERY_API } from "./endpoints";

const baseQuery = fetchBaseQuery({
  baseUrl: BASEQUERY_API,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    // refresh token
    const refreshResult = await baseQuery(
      {
        url: "users/token/refresh/", // relative à baseUrl
        method: "POST",
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data?.access) {
      api.dispatch(
        setCredentials({
          user: api.getState().auth.user,
          access: refreshResult.data.access,
          refresh: refreshToken,
        })
      );
      // retry requête initiale
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
