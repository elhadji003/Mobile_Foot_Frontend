import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "users/register/",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "users/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation({
      query: ({ refresh }) => ({
        url: "users/token/refresh/",
        method: "POST",
        body: { refresh },
      }),
    }),
    logout: builder.mutation({
      query: (refresh) => ({
        url: "users/logout/",
        method: "POST",
        body: {refresh}
      }),
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: "users/change-password/user/",
        method: "PUT",
        body: passwords,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "users/password/request-reset/",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: `users/password/reset-confirm/${uid}/${token}/`,
        method: "POST",
        body: { new_password, re_new_password },
      }),
    }),
    
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
