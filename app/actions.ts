"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type NoteFormState = {
  message: string;
  success: boolean;
};

export async function logOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    throw new Error("Unable to log out. Please try again.");
  }

  redirect("/login");
}

export async function addNote(
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.trim().length === 0) {
    return { message: "Please enter a title for your note.", success: false };
  }

  if (typeof body !== "string") {
    return { message: "Please enter the note text.", success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Add note auth error:", userError.message);
    throw new Error("Unable to verify your account. Please try again.");
  }

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("notes")
    .insert({ title: title.trim(), body });

  if (error) {
    console.error("Add note error:", error.message);
    return {
      message: "Your note couldn't be saved. Please try again.",
      success: false,
    };
  }

  revalidatePath("/");
  return { message: "Note saved.", success: true };
}
