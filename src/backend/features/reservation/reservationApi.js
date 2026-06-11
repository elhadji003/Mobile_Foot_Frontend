// store/api/reservationApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQuery";

export const reservationApi = createApi({
  reducerPath: "reservationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Reservation", "Creneau"],
  endpoints: (builder) => ({
    // GET /api/reservations/
    getReservations: builder.query({
      query: () => "/reservations/",
      providesTags: ["Reservation"],
    }),

    // POST /api/reservations/
    createReservation: builder.mutation({
      query: (data) => ({
        url: "/reservations/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reservation", "Creneau"],
    }),
  }),
});

export const {
  useGetReservationsQuery,
  useCreateReservationMutation,
} = reservationApi;
