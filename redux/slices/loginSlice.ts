import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "../../utils/axiosInstance";

interface LoginState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: LoginState = {
    loading: false,
    error: null,
    success: false,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (
        { username, password }: { username: string; password: string },
        thunkAPI,
    ) => {
        try {
            const response = await axiosInstance.post("/token/", {
                username,
                password,
            });

            const { access, refresh } = response.data;

            Cookies.set("access", access, {
                expires: 7,
                secure: true,
            });
            Cookies.set("refresh", refresh, {
                expires: 30,
                secure: true,
            });

            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Login failed",
            );
        }
    },
);

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetState } = loginSlice.actions;
export default loginSlice.reducer;
