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
            password,
            email,
            captcha,
        }: {
            username: string;
            password: string;
            email: string;
            captcha: string;
        },
        thunkAPI,
    ) => {
        try {
            const response = await axiosInstance.post("/accounts/register/", {
                username,
                password,
                email,
                captcha,
            });

            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Signup failed",
            );
        }
    },
);
