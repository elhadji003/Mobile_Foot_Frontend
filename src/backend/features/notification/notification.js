// store/api/notificationApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQuery";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    // GET /api/notifications/
    getNotifications: builder.query({
      query: () => "/notifications/",
      providesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
} = notificationApi;
