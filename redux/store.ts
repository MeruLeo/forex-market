import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import loginReducer from "./slices/loginSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        login: loginReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
