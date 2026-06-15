// store/api/reservationApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../baseQuery";

export const reservationApi = createApi({
  reducerPath: "reservationApi",
  baseQuery: baseQueryWithReauth,

  // Les tags permettent de re-déclencher automatiquement le GET (list)
  // dès qu'un POST, PUT ou DELETE est effectué.
  tagTypes: ["Reservation", "Creneau"],

  endpoints: (builder) => ({
    // 1. READ ALL (Liste des réservations)
    // GET /api/reservations/
    getReservations: builder.query({
      query: (params) => ({
        url: "/reservations/",
        method: "GET",
        params: params, // Pour passer des filtres optionnels (?page=1, ?search=...)
      }),
      providesTags: ["Reservation"],
    }),

    // 2. READ DETAIL (Une seule réservation par son ID)
    // GET /api/reservations/{id}/
    getReservationDetail: builder.query({
      query: (id) => `/reservations/${id}/`,
      providesTags: (result, error, id) => [{ type: "Reservation", id }],
    }),

    // 3. CREATE (Créer une réservation)
    // POST /api/reservations/
    createReservation: builder.mutation({
      query: (data) => ({
        url: "/reservations/",
        method: "POST",
        body: data,
      }),
      // Invalide la liste globale pour forcer le rafraîchissement de l'écran
      invalidatesTags: [{ type: "Reservation", id: "LIST" }, "Creneau"],
    }),

    // 4. UPDATE (Modifier une réservation - PUT ou PATCH)
    // PUT /api/reservations/{id}/
    updateReservation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/reservations/${id}/`,
        method: "PUT", // Ou "PATCH" selon les attentes de votre API Django
        body: data,
      }),
      // Invalide l'objet spécifique ET la liste globale
      invalidatesTags: (result, error, { id }) => [
        { type: "Reservation", id },
        { type: "Reservation", id: "LIST" },
        "Creneau",
      ],
    }),

    // 5. DELETE (Supprimer une réservation)
    // DELETE /api/reservations/{id}/
    deleteReservation: builder.mutation({
      query: (id) => ({
        url: `/reservations/${id}/`,
        method: "DELETE",
      }),
      // Invalide l'objet supprimé et la liste globale
      invalidatesTags: (result, error, id) => [
        { type: "Reservation", id },
        { type: "Reservation", id: "LIST" },
        "Creneau",
      ],
    }),
  }),
});

// Export des hooks générés automatiquement par RTK Query pour vos composants
export const {
  useGetReservationsQuery,
  useGetReservationDetailQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useDeleteReservationMutation,
} = reservationApi;
