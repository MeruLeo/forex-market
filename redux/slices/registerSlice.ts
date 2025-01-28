import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "../../utils/axiosInstance";

interface SignupState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: SignupState = {
    loading: false,
    error: null,
    success: false,
};

export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (
        {
            username,
            real_name,
            phone_number,
            bank_number,
            password,
            password2,
            referralCode,
        }: {
            username: string;
            real_name: string;
            phone_number: string;
            bank_number: string;
            password: string;
            password2: string;
            referralCode?: string;
        },
        thunkAPI,
    ) => {
        try {
            const response = await axiosInstance.post("/account/signup", {
                username,
                real_name,
                phone_number,
                bank_number,
                password,
                password2,
                referralCode,
            });

            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Signup failed",
            );
        }
    },
);

const signupSlice = createSlice({
    name: "signup",
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
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetState } = signupSlice.actions;
export default signupSlice.reducer;
