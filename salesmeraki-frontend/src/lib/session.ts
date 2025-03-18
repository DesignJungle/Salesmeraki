import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function getAccessToken() {
  const session = await getSession();
  return session?.accessToken;
}