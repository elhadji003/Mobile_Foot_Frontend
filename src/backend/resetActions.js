import { logout } from "./features/auth/authSlice";
import { authApi } from "./features/auth/authApi";
import { persistor } from "./app/store";

export const resetApp = () => async (dispatch) => {
  dispatch(logout()); // vide le slice auth
  dispatch(authApi.util.resetApiState()); // vide les caches RTK
  await persistor.purge(); // vide redux-persist
};
