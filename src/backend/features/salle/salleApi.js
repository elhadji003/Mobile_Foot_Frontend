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
      // ✅ Fournit le tag liste + un tag par salle
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: "Salle", id })),
              { type: "Salle", id: "LIST" },
            ]
          : [{ type: "Salle", id: "LIST" }],
    }),

    // GET /api/salles/:id/
    getSalleById: builder.query({
      query: (id) => `/salles/${id}/`,
      // ✅ Fournit uniquement le tag de cette salle
      providesTags: (result, error, id) => [{ type: "Salle", id }],
    }),

    // POST /api/salles/
    createSalle: builder.mutation({
      query: (data) => ({
        url: "/salles/",
        method: "POST",
        body: data,
      }),
      // ✅ Invalide la liste → re-fetch automatique de getSalles
      invalidatesTags: [{ type: "Salle", id: "LIST" }],
    }),

    // PATCH /api/salles/:id/
    updateSalle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/salles/${id}/`,
        method: "PATCH",
        body: data,
      }),
      // ✅ Invalide la salle modifiée + la liste
      invalidatesTags: (result, error, { id }) => [
        { type: "Salle", id },
        { type: "Salle", id: "LIST" },
      ],
    }),

    // DELETE /api/salles/:id/
    deleteSalle: builder.mutation({
      query: (id) => ({
        url: `/salles/${id}/`,
        method: "DELETE",
      }),
      // ✅ Invalide la salle supprimée + la liste
      invalidatesTags: (result, error, id) => [
        { type: "Salle", id },
        { type: "Salle", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSallesQuery,
  useGetSalleByIdQuery,
  useCreateSalleMutation,
  useUpdateSalleMutation,
  useDeleteSalleMutation,
} = salleApi;
