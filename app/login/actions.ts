"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AuthState = {
  message: string;
};

type CredentialsResult =
  | { credentials: { email: string; password: string } }
  | { message: string };

function readCredentials(formData: FormData): CredentialsResult {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return { message: "Enter a valid email address." };
  }

  if (typeof password !== "string" || [...password].length < 6) {
    return { message: "Password must be at least 6 characters." };
  }

  return { credentials: { email: email.trim(), password } };
}

export async function logIn(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const result = readCredentials(formData);
  if ("message" in result) {
    return result;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.credentials);

  if (error) {
    console.error("Login error:", error.message);
    return { message: "Wrong email or password." };
  }

  redirect("/");
}

export async function signUp(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const result = readCredentials(formData);
  if ("message" in result) {
    return result;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(result.credentials);

  if (error) {
    console.error("Sign up error:", error.message);
    return { message: error.message };
  }

  if (!data.session) {
    return { message: "Check your email to confirm your account." };
  }

  redirect("/");
}