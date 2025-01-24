import axiosInstance from "@/utils/axiosInstance";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const url = "https://bitpay.ir/payment-test/gateway-result-second";

    try {
        const formData = new FormData(await req.formData()); // Parse the incoming FormData request body

        const response = await axiosInstance.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
            const data = response.data;

            if (data.data === -1) {
                return NextResponse.json(
                    { error: "Invalid API provided" },
                    { status: 400 },
                );
            }

            return NextResponse.json(data, { status: response.status });
        } else {
            const errorData = response.data;
            return NextResponse.json(
                { error: errorData.message },
                { status: response.status },
            );
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to process payment" },
            { status: 500 },
        );
    }
}
