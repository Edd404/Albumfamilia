import { createClient } from "@/lib/supabase/server";
import HomeHero from "@/components/home-hero";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/album");
  }

  return <HomeHero />;
}
