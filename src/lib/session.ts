import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getCurrentSession = async () => auth.api.getSession({ headers: await headers() });
