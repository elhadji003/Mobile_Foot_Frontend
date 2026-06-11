import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    getUserProfile: builder.query({
        query: () => ({
        url: "users/profile/",
        method: "GET",
      }),
        providesTags: ["UserProfile"],
    }),
    getProfileUserById: builder.query({
      query: (id) => ({
        url: `users/profile/${id}/`,
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: "users/update/profile/",
        method: "PUT",
        body: profileData,
      }),
        invalidatesTags: ["UserProfile"],
    }),
    deleteUserAccount: builder.mutation({
      query: (password) => ({
        url: "users/delete/account/",
        method: "DELETE",
        body: { password },
      }),
    }),
  }),
});

export const { 
  useGetUserProfileQuery, 
  useGetProfileUserByIdQuery, 
  useUpdateUserProfileMutation, 
  useDeleteUserAccountMutation 
} = userApi;
