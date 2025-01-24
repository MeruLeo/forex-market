import axiosInstance from "@/utils/axiosInstance";

export async function fetch_news({ user }: { user: any }) {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/ws/trade_list/${user.id}`;

        const response = await axiosInstance.post(
            url,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return response.data;
    } catch (error) {
        return [{}];
    }
}
