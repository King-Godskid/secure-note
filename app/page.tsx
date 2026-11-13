import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logOut } from "./actions";
import NewNoteForm from "./new-note-form";
import { connection } from "next/server";

async function AccountBar() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
      <p className="min-w-0 break-all text-sm text-zinc-600 dark:text-zinc-300">
        Logged in as{" "}
        <span className="font-semibold text-zinc-900 dark:text-white">
          {user.email ?? "Unknown email"}
        </span>
      </p>
      <form action={logOut} className="shrink-0">
        <button
          className="min-h-11 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          type="submit"
        >
          Log out
        </button>
      </form>
    </div>
  );
}

async function NotesList() {
  await connection();
  const supabase = await createClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, body, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Notes query error:", error.message);
    throw new Error("Unable to load your notes.");
  }

  if (!notes?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900/60">
        <p className="font-medium text-zinc-800 dark:text-zinc-100">
          No notes yet
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Your saved notes will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
          key={note.id}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="break-words text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
              {note.title}
            </h3>
            <time
              className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400"
              dateTime={note.created_at}
            >
              {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(note.created_at))}
            </time>
          </div>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {note.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="flex-1 bg-zinc-50 px-4 py-6 dark:bg-zinc-950 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-col gap-5 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-400">
              Your private workspace
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              Secure Notes
            </h1>
          </div>
          <Suspense
            fallback={
              <div
                aria-label="Loading account"
                className="h-11 w-52 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
              />
            }
          >
            <AccountBar />
          </Suspense>
        </header>

        <section
          aria-labelledby="new-note-heading"
          className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:mt-8 sm:p-7"
        >
          <div className="mb-5">
            <h2
              className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white"
              id="new-note-heading"
            >
              New note
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Keep a clear record of each student&apos;s progress.
            </p>
          </div>
          <NewNoteForm />
        </section>

        <section aria-labelledby="notes-heading" className="mt-9">
          <div className="mb-4 flex items-baseline justify-between">
            <h2
              className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white"
              id="notes-heading"
            >
              Your notes
            </h2>
          </div>
          <Suspense
            fallback={
              <p className="rounded-2xl bg-white px-5 py-8 text-center text-sm text-zinc-500 shadow-sm dark:bg-zinc-900 dark:text-zinc-400">
                Loading your notes...
              </p>
            }
          >
            <NotesList />
          </Suspense>
        </section>
      </div>
    </main>
  );
}