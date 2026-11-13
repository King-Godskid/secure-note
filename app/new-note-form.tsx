"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNote, type NoteFormState } from "./actions";

const initialState: NoteFormState = { message: "", success: false };

export default function NewNoteForm() {
  const [state, formAction, isPending] = useActionState(addNote, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="space-y-4"
      ref={formRef}
    >
      <div>
        <label
          className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="title"
        >
          Title
        </label>
        <input
          autoComplete="off"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500"
          id="title"
          maxLength={200}
          name="title"
          placeholder="e.g. Tolu, maths"
          type="text"
        />
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="body"
        >
          Note
        </label>
        <textarea
          className="min-h-36 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500"
          id="body"
          name="body"
          placeholder="Write a few details..."
          rows={5}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving..." : "Save note"}
        </button>
        <p
          aria-live="polite"
          className={`text-sm ${state.success ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}
          role={state.success ? "status" : "alert"}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
