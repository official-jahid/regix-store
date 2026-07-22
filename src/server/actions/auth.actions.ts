"use server";

import { auth } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/schemas/auth.schema";
import type { ActionResult } from "@/lib/types";
import { headers } from "next/headers";
import { z } from "zod";

export async function login(input: z.infer<typeof loginSchema>): Promise<
  ActionResult<{
    user: { id: string; email: string; name: string; role: string };
  }>
> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { email, password } = parsed.data;
    const h = await headers();
    const data = await auth.api.signInEmail({
      headers: h,
      body: { email, password },
    });

    if (!data?.user) {
      return { success: false, error: "Invalid email or password" };
    }

    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: (data.user as any).role || "buyer",
        },
      },
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Login failed" };
  }
}

export async function register(
  input: z.infer<typeof registerSchema>,
): Promise<
  ActionResult<{ user: { id: string; email: string; name: string } }>
> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { name, email, password } = parsed.data;
    const h = await headers();
    const data = await auth.api.signUpEmail({
      headers: h,
      body: { name, email, password },
    });

    if (!data?.user) {
      return { success: false, error: "Registration failed" };
    }

    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        },
      },
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Registration failed" };
  }
}

export async function logout(): Promise<ActionResult> {
  try {
    const h = await headers();
    await auth.api.signOut({ headers: h });
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error?.message || "Logout failed" };
  }
}

export async function getSession() {
  try {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    return session;
  } catch {
    return null;
  }
}
