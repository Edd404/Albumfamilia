"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ALLOWED_LAYOUTS = new Set([
  "full",
  "grid",
  "video",
  "letter",
  "timeline",
  "special",
]);

export type ActionState = {
  ok: boolean;
  message?: string;
};

export async function loginAction(_: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Preencha e-mail e senha." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  redirect("/album");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createAlbumAction(formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Você precisa entrar para criar um álbum." };
  }

  const title = String(formData.get("title") ?? "Nossa História").trim() || "Nossa História";
  const cover_image = String(formData.get("cover_image") ?? "").trim() || null;

  const { data: album, error } = await supabase
    .from("albums")
    .insert({
      user_id: user.id,
      title,
      cover_image,
    })
    .select("*")
    .single();

  if (error) {
    return { ok: false, message: error.message };
  }

  await supabase.from("pages").insert({
    album_id: album.id,
    page_number: 1,
    layout_type: "full",
  });

  revalidatePath("/album");
  revalidatePath("/editor");
  return { ok: true, message: "Álbum criado com sucesso." };
}

export async function createPageAction(formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const albumId = String(formData.get("album_id") ?? "").trim();
  const layoutType = String(formData.get("layout_type") ?? "full").trim();

  if (!albumId) {
    return { ok: false, message: "Álbum não encontrado." };
  }

  const { data: pages } = await supabase
    .from("pages")
    .select("page_number")
    .eq("album_id", albumId)
    .order("page_number", { ascending: false })
    .limit(1);

  const nextNumber = (pages?.[0]?.page_number ?? 0) + 1;

  const { error } = await supabase.from("pages").insert({
    album_id: albumId,
    page_number: nextNumber,
    layout_type: ALLOWED_LAYOUTS.has(layoutType) ? layoutType : "full",
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/album");
  revalidatePath("/editor");
  return { ok: true, message: "Nova página adicionada." };
}

export async function updatePageLayoutAction(formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const pageId = String(formData.get("page_id") ?? "").trim();
  const layoutType = String(formData.get("layout_type") ?? "").trim();

  if (!pageId || !ALLOWED_LAYOUTS.has(layoutType)) {
    return { ok: false, message: "Layout inválido." };
  }

  const { count } = await supabase
    .from("memories")
    .select("id", { count: "exact", head: true })
    .eq("page_id", pageId);

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      message: "Remova os itens desta página antes de alterar o layout.",
    };
  }

  const { error } = await supabase
    .from("pages")
    .update({ layout_type: layoutType })
    .eq("id", pageId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/album");
  revalidatePath("/editor");
  return { ok: true, message: "Layout atualizado." };
}

export async function deleteMemoryAction(formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const memoryId = String(formData.get("memory_id") ?? "").trim();

  if (!memoryId) {
    return { ok: false, message: "Memória inválida." };
  }

  const { error } = await supabase.from("memories").delete().eq("id", memoryId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/album");
  revalidatePath("/editor");
  return { ok: true, message: "Memória removida." };
}
