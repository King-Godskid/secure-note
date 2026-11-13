"use client";

import { useActionState } from "react";
import { useState } from "react";
import { logIn, signUp } from "./actions";

const initialState = { message: "" };

export default function LoginPage() {
  const [loginState, loginAction, isLoggingIn] = useActionState(
    logIn,
    initialState,
  );
  const [signUpState, signUpAction, isSigningUp] = useActionState(
    signUp,
    initialState,
  );
  const [lastAction, setLastAction] = useState<"login" | "signup">("login");
  const isPending = isLoggingIn || isSigningUp;

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <section className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Secure Notes
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Log in or create an account to continue.
        </p>

        <form className="mt-8 space-y-5">

          <div>
            <label
              className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              id="email"
              name="email"
              required
              type="email"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              htmlFor="password"
            >
              Password
            </label>
            <input
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              id="password"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              formAction={loginAction}
              onClick={() => setLastAction("login")}
              type="submit"
            >
              Log in
            </button>
            <button
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              disabled={isPending}
              formAction={signUpAction}
              onClick={() => setLastAction("signup")}
              type="submit"
            >
              Sign up
            </button>
          </div>
        </form>

        <div aria-live="polite" className="mt-4 space-y-2 text-sm">
          {lastAction === "login"
            ? loginState.message && (
                <p className="text-red-700 dark:text-red-400">
                  {loginState.message}
                </p>
              )
            : signUpState.message && (
                <p className="text-red-700 dark:text-red-400">
                  {signUpState.message}
                </p>
              )}
        </div>
      </section>
    </main>
  );
}
