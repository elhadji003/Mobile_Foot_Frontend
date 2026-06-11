// store/api/salleApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQuery";

export const salleApi = createApi({
  reducerPath: "salleApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Salle"],
  endpoints: (builder) => ({
    // GET /api/salles/
    getSalles: builder.query({
      query: () => "/salles/",
      providesTags: ["Salle"],
    }),

    getSalleById: builder.query({
      query: (id) => `/salles/${id}`,
      providesTags: ["Salle"],
    }),

    // POST /api/salles/
    createSalle: builder.mutation({
      query: (data) => ({
        url: "/salles/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Salle"],
    }),
  }),
});

export const {
  useGetSallesQuery,
  useGetSalleByIdQuery,
  useCreateSalleMutation,
} = salleApi;
