import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import Cookies from "js-cookie";

export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, thunkAPI) => {
        try {
            const refreshToken = Cookies.get("refresh");
            if (!refreshToken) throw new Error("No refresh token found");

            const response = await axiosInstance.post("/token/refresh", {
                refresh: refreshToken,
            });

            const { access } = response.data;

            Cookies.set("access", access, {
                expires: 15 / 1440,
                secure: true,
            });
            return access;
        } catch (error: any) {
            console.error("Error refreshing token:", error);
            Cookies.remove("access");
            Cookies.remove("refresh");
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to refresh token",
            );
        }
    },
);

const refreshTokenSlice = createSlice({
    name: "auth",
    initialState: {
        accessToken: null as string | null,
        loading: false,
        error: null as string | null,
    },
    reducers: {
        clearTokens(state) {
            state.accessToken = null;
            Cookies.remove("access");
            Cookies.remove("refresh");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                refreshToken.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.loading = false;
                    state.accessToken = action.payload;
                },
            )
            .addCase(
                refreshToken.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error =
                        action.payload ||
                        "An error occurred during token refresh.";
                },
            );
    },
});

export const { clearTokens } = refreshTokenSlice.actions;

export default refreshTokenSlice.reducer;
