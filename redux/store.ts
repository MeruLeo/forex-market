import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import loginReducer from "./slices/loginSlice";
import registerReducer from "./slices/registerSlice";
import refreshTokenReducer from "./slices/refreshTokenSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        login: loginReducer,
        register: registerReducer,
        refreshToken: refreshTokenReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
