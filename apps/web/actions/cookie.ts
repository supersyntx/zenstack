"use server";

import { cookies, headers } from "next/headers";

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || null;
};

export const getHeaders = async () => {
  return await headers();
};
