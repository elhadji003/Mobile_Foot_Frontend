import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";
import { userApi } from "../features/user/userApi";
import { salleApi } from "../features/salle/salleApi";
import { creneauApi } from "../features/creneau/creneauApi";
import { reservationApi } from "../features/reservation/reservationApi";
import { notificationApi } from "../features/notification/notification";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // seuls auth sont persistés
};

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [salleApi.reducerPath]: salleApi.reducer,
  [creneauApi.reducerPath]: creneauApi.reducer,
  [reservationApi.reducerPath]: creneauApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      userApi.middleware,
      salleApi.middleware,
      creneauApi.middleware,
      reservationApi.middleware,
      notificationApi.middleware,
    ),
});

export const persistor = persistStore(store);
