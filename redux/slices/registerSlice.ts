import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "../../utils/axiosInstance";

interface SignupState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

export interface SignupProps {
    username: string;
    real_name: string;
    phone_number: string;
    bank_number: string;
    password: string;
    referralCode?: string | string[] | null;
}

const initialState: SignupState = {
    loading: false,
    error: null,
    success: false,
};

export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (data: SignupProps, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/account/signup", data);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
            return thunkAPI.rejectWithValue("Signup failed");
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
