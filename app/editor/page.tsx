import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createAlbumAction, createPageAction, logoutAction, updatePageLayoutAction, deleteMemoryAction } from "@/app/actions";
import { EditorShell } from "@/components/editor-shell";

export const dynamic = "force-dynamic";

async function getEditorData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: album } = await supabase
    .from("albums")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let pages: any[] = [];
  let memories: any[] = [];

  if (album) {
    const { data: pageRows } = await supabase
      .from("pages")
      .select("*")
      .eq("album_id", album.id)
      .order("page_number", { ascending: true });
    pages = pageRows ?? [];

    if (pages.length > 0) {
      const { data: memoryRows } = await supabase
        .from("memories")
        .select("*")
        .in("page_id", pages.map((page) => page.id))
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });
      memories = memoryRows ?? [];
    }
  }

  return { album, pages, memories, user };
}

export default async function EditorPage() {
  const data = await getEditorData();

  return (
    <EditorShell
      album={data.album}
      pages={data.pages}
      memories={data.memories}
      actions={{
        createAlbumAction,
        createPageAction,
        updatePageLayoutAction,
        deleteMemoryAction,
        logoutAction,
      }}
    />
  );
}
