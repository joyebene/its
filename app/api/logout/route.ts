import { success } from "@/utils/api-response";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();

    cookieStore.delete("refreshToken");

    return success(null, "Logged out successfully");
}