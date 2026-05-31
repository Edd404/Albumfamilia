export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Payload = {
  page_id: string;
  type: "image" | "video" | "text" | "letter" | "timeline" | "audio";
  title?: string;
  description?: string;
  memory_date?: string | null;
  media_url?: string | null;
  thumbnail_url?: string | null;
  position?: number | null;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Payload;

  if (!body.page_id || !body.type) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id, album_id")
    .eq("id", body.page_id)
    .single();

  if (pageError || !page) {
    return NextResponse.json({ error: "Página não encontrada." }, { status: 404 });
  }

  const { data: inserted, error } = await supabase
    .from("memories")
    .insert({
      page_id: page.id,
      type: body.type,
      title: body.title || null,
      description: body.description || null,
      memory_date: body.memory_date || null,
      media_url: body.media_url || null,
      thumbnail_url: body.thumbnail_url || null,
      position: body.position ?? 0,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: album } = await supabase
    .from("albums")
    .select("cover_image")
    .eq("id", page.album_id)
    .single();

  if (album && !album.cover_image) {
    await supabase
      .from("albums")
      .update({
        cover_image: body.thumbnail_url || body.media_url || null,
      })
      .eq("id", page.album_id);
  }

  return NextResponse.json({ memory: inserted });
}
