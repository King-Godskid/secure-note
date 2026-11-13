import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function Welcome() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return <p>Signed in as {data.user.email}</p>;
}

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Secure Notes</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Welcome />
      </Suspense>
    </main>
  );
}