import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AlbumBook from "@/components/album-book";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

async function getAlbumData() {
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

  if (!album) {
    return { user, album: null, pages: [], memories: [] };
  }

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("album_id", album.id)
    .order("page_number", { ascending: true });

  const pageIds = (pages ?? []).map((page) => page.id);

  let memories: any[] = [];
  if (pageIds.length > 0) {
    const { data: memoryRows } = await supabase
      .from("memories")
      .select("*")
      .in("page_id", pageIds)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    memories = memoryRows ?? [];
  }

  return { user, album, pages: pages ?? [], memories };
}

export default async function AlbumPage() {
  const { album, pages, memories } = await getAlbumData();

  if (!album) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <EmptyState
          title="Seu álbum ainda está vazio"
          description="Crie o primeiro álbum para começar a guardar memórias, fotos, vídeos e cartas."
          ctaHref="/editor"
          ctaLabel="Criar primeiro álbum"
        />
      </main>
    );
  }

  return <AlbumBook album={album} pages={pages} memories={memories} />;
}
