"use client";

import type { Album, Memory, Page, LayoutType } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlbumOpen, ArrowLeft, Plus, Save, Trash2, LogOut, Camera, WandSparkles } from "lucide-react";
import UploadModal from "@/components/upload-modal";

const layoutOptions: { value: LayoutType; title: string; subtitle: string }[] = [
  { value: "full", title: "Full Memory", subtitle: "Uma foto grande e emocional" },
  { value: "grid", title: "Grid 4 Fotos", subtitle: "Quatro registros leves" },
  { value: "video", title: "Página Vídeo", subtitle: "Vídeo quase em tela cheia" },
  { value: "letter", title: "Carta", subtitle: "Texto manuscrito" },
  { value: "timeline", title: "Timeline", subtitle: "Linha do tempo" },
  { value: "special", title: "Especial", subtitle: "Colagem livre" },
];

export function EditorShell({
  album,
  pages,
  memories,
  actions,
}: {
  album: Album | null;
  pages: Page[];
  memories: Memory[];
  actions: {
    createAlbumAction: (formData: FormData) => Promise<{ ok: boolean; message?: string }>;
    createPageAction: (formData: FormData) => Promise<{ ok: boolean; message?: string }>;
    updatePageLayoutAction: (formData: FormData) => Promise<{ ok: boolean; message?: string }>;
    deleteMemoryAction: (formData: FormData) => Promise<{ ok: boolean; message?: string }>;
    logoutAction: () => Promise<void>;
  };
}) {
  const [uploadPageId, setUploadPageId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<string>;
      setUploadPageId(custom.detail);
    };
    window.addEventListener("open-upload-modal", handler as EventListener);
    return () => window.removeEventListener("open-upload-modal", handler as EventListener);
  }, []);

  const memoriesByPage = new Map<string, Memory[]>();
  memories.forEach((memory) => {
    const list = memoriesByPage.get(memory.page_id) || [];
    list.push(memory);
    memoriesByPage.set(memory.page_id, list);
  });

  if (!album) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="soft-panel texture max-w-xl p-8 text-center">
          <span className="page-label mx-auto">Editor</span>
          <h1 className="mt-4 text-4xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
            Criar o primeiro álbum
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-cream-700">
            O projeto já está preparado. Basta criar o álbum inicial para começar a adicionar páginas e memórias.
          </p>

          <form action={actions.createAlbumAction} className="mt-7 space-y-4 text-left">
            <input type="hidden" name="title" value="Nossa História" />
            <input type="hidden" name="cover_image" value="" />
            <button type="submit" className="glass-btn-dark w-full justify-center">
              <AlbumOpen size={16} />
              Criar álbum
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4 text-sm">
            <Link href="/album" className="glass-btn">
              <ArrowLeft size={16} />
              Voltar
            </Link>
            <form action={actions.logoutAction}>
              <button className="glass-btn" type="submit">
                <LogOut size={16} /> Sair
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      {uploadPageId ? (
        <UploadModal
          pages={pages}
          defaultPageId={uploadPageId}
          onClose={() => setUploadPageId(undefined)}
          onSaved={() => setUploadPageId(undefined)}
        />
      ) : null}
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="soft-panel texture flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="page-label">Editor do álbum</span>
            <h1 className="mt-3 text-3xl font-semibold text-cream-900" style={{ fontFamily: "var(--font-playfair)" }}>
              {album.title}
            </h1>
            <p className="mt-2 text-sm text-cream-700">Layout simples, visual emocional e controle por página.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/album" className="glass-btn">
              <ArrowLeft size={16} />
              Voltar ao álbum
            </Link>
            <form action={actions.logoutAction}>
              <button className="glass-btn" type="submit">
                <LogOut size={16} /> Sair
              </button>
            </form>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {pages.map((page) => {
              const pageMemories = memoriesByPage.get(page.id) || [];
              return (
                <article key={page.id} className="soft-panel texture p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="page-label">Página {page.page_number}</span>
                        <span className="rounded-full bg-cream-100 px-3 py-1 text-xs text-cream-700">{page.layout_type}</span>
                      </div>
                      <p className="mt-3 text-lg font-semibold text-cream-900" style={{ fontFamily: "var(--font-playfair)" }}>
                        {layoutOptions.find((item) => item.value === page.layout_type)?.title || "Página"}
                      </p>
                      <p className="mt-1 text-sm text-cream-700">
                        {layoutOptions.find((item) => item.value === page.layout_type)?.subtitle || "Layout"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const event = new CustomEvent("open-upload-modal", { detail: page.id });
                        window.dispatchEvent(event);
                      }}
                      className="glass-btn"
                    >
                      <Camera size={16} />
                      Adicionar
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
                    <form action={actions.updatePageLayoutAction} className="rounded-[1.5rem] border border-cream-200/70 bg-white/70 p-4">
                      <input type="hidden" name="page_id" value={page.id} />
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-cream-800">Alterar layout</span>
                        <div className="flex flex-col gap-3 md:flex-row">
                          <select name="layout_type" defaultValue={page.layout_type} className="subtle-select md:max-w-[260px]">
                            {layoutOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.title}
                              </option>
                            ))}
                          </select>
                          <button type="submit" className="glass-btn-dark">
                            <Save size={16} />
                            Salvar layout
                          </button>
                        </div>
                      </label>
                      <p className="mt-3 text-xs text-cream-500">
                        Só é possível mudar o layout quando a página estiver vazia.
                      </p>
                    </form>

                    <form action={actions.createPageAction} className="rounded-[1.5rem] border border-dashed border-cream-300 bg-white/55 p-4">
                      <input type="hidden" name="album_id" value={album.id} />
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-cream-800">Nova página</span>
                        <select name="layout_type" defaultValue="full" className="subtle-select">
                          {layoutOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button type="submit" className="glass-btn-dark mt-4 w-full justify-center">
                        <Plus size={16} />
                        Adicionar página
                      </button>
                    </form>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {pageMemories.length > 0 ? (
                      pageMemories.map((memory) => (
                        <div key={memory.id} className="flex flex-col gap-4 rounded-[1.4rem] border border-white/70 bg-white/60 p-4 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0">
                            <p className="font-medium text-cream-900">{memory.title || "Sem título"}</p>
                            <p className="text-sm text-cream-700">{memory.description || "Sem descrição"}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-cream-100 px-3 py-1 text-xs text-cream-700">{memory.type}</span>
                            <form action={actions.deleteMemoryAction}>
                              <input type="hidden" name="memory_id" value={memory.id} />
                              <button className="glass-btn" type="submit">
                                <Trash2 size={16} />
                              </button>
                            </form>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.4rem] border border-dashed border-cream-300 bg-white/45 p-5 text-sm text-cream-600">
                        Essa página está vazia. Adicione fotos, vídeos ou cartas com o botão “Adicionar”.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4">
            <div className="soft-panel texture p-5">
              <h2 className="text-xl font-semibold text-cream-900" style={{ fontFamily: "var(--font-playfair)" }}>
                Inspiração visual
              </h2>
              <p className="mt-2 text-sm leading-7 text-cream-700">
                O álbum foi desenhado para parecer uma peça física: papel quente, bordas suaves, sombras leves e páginas vivas.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["polaroid", "scrapbook", "papel", "nostalgia", "cinema"].map((tag) => (
                  <span key={tag} className="rounded-full border border-cream-200 bg-white/70 px-3 py-1 text-xs text-cream-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="soft-panel texture p-5">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-cream-900" style={{ fontFamily: "var(--font-playfair)" }}>
                <WandSparkles size={18} /> Fluxo rápido
              </h2>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-cream-700">
                <li>1. selecione a página</li>
                <li>2. faça upload da mídia</li>
                <li>3. salve a memória</li>
                <li>4. altere o layout apenas se a página estiver vazia</li>
              </ol>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
