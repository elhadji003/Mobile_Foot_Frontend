// store/api/creneauApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQuery";

export const creneauApi = createApi({
  reducerPath: "creneauApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Creneau"],
  endpoints: (builder) => ({
    // GET /api/creneaux/
    getCreneaux: builder.query({
      query: () => "/creneaux/",
      providesTags: ["Creneau"],
    }),

    // POST /api/creneaux/
    createCreneau: builder.mutation({
      query: (data) => ({
        url: "/creneaux/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Creneau"],
    }),

    // creneau salleId
    getCreneauxBySalle: builder.query({
      query: (salleId) => `/creneaux/?salle=${salleId}`,
      providesTags: ["Creneau"],
    }),
  }),
});

export const {
  useGetCreneauxQuery,
  useCreateCreneauMutation,
  useGetCreneauxBySalleQuery
} = creneauApi;
