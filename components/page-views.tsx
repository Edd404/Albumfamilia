import type { ElementType } from "react";
import type { Memory, Page } from "@/lib/types";
import PolaroidCard from "@/components/polaroid-card";
import { CalendarDays, Film, Quote, Rows3, Sparkles, Bookmark } from "lucide-react";
import Image from "next/image";

function formatDate(value: string | null) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
  } catch {
    return value;
  }
}

function PageHeader({ page, label, icon: Icon }: { page: Page; label: string; icon: ElementType }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="space-y-2">
        <span className="page-label">
          <Icon size={14} />
          {label}
        </span>
        <p className="text-xs uppercase tracking-[0.25em] text-cream-500">Página {page.page_number}</p>
      </div>
      <span className="text-[10px] uppercase tracking-[0.3em] text-cream-400">memorável</span>
    </div>
  );
}

export function AlbumPageView({
  page,
  memories,
}: {
  page: Page;
  memories: Memory[];
}) {
  const ordered = [...memories].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const first = ordered[0];
  const cover = first?.thumbnail_url || first?.media_url;

  switch (page.layout_type) {
    case "full":
      return (
        <section className="page-shell texture p-6 md:p-8">
          <PageHeader page={page} label="Full Memory" icon={Sparkles} />
          <div className="grid h-[calc(100%-4.5rem)] gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#d8b38e] via-[#edd3b8] to-[#faf0e1] shadow-soft">
              {cover ? (
                <Image src={cover} alt={first?.title || "Memória"} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_40%),linear-gradient(180deg,#e0c19f,#b88d62)]">
                  <span className="text-4xl font-semibold text-white/90" style={{ fontFamily: "var(--font-playfair)" }}>
                    Nossa história
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            </div>
            <div className="flex flex-col justify-between rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-soft">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.28em] text-cream-500">Momento especial</p>
                <h2 className="text-4xl font-semibold leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  {first?.title || "Um momento guardado com amor"}
                </h2>
                <p className="text-sm leading-7 text-cream-700">
                  {first?.description || "Abra o álbum para registrar detalhes, sentimentos e pequenas cenas que merecem ser lembradas."}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm text-cream-600">
                <CalendarDays size={16} />
                {formatDate(first?.memory_date)}
              </div>
            </div>
          </div>
        </section>
      );

    case "grid":
      return (
        <section className="page-shell texture p-6 md:p-8">
          <PageHeader page={page} label="Grid 4 Fotos" icon={Rows3} />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => {
              const memory = ordered[index];
              return memory ? (
                <PolaroidCard key={memory.id} memory={memory} forceRotate={[-3, 2, -1, 3][index]} />
              ) : (
                <div
                  key={`empty-${index}`}
                  className="polaroid flex items-center justify-center border-dashed text-center text-sm text-cream-500"
                  style={{ transform: `rotate(${[-3, 2, -1, 3][index]}deg)` }}
                >
                  Espaço para memória
                </div>
              );
            })}
          </div>
        </section>
      );

    case "video":
      return (
        <section className="page-shell texture p-6 md:p-8">
          <PageHeader page={page} label="Página Vídeo" icon={Film} />
          <div className="grid h-[calc(100%-4.5rem)] gap-5 md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden rounded-[2rem] bg-black/90 shadow-soft">
              {first?.media_url ? (
                <video
                  controls
                  playsInline
                  poster={first.thumbnail_url || undefined}
                  className="h-full w-full object-cover"
                  src={first.media_url}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_36%),linear-gradient(180deg,#3b2c20,#14110f)]">
                  <p className="text-center text-sm uppercase tracking-[0.28em] text-white/70">insira um vídeo aqui</p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6">
                <h2 className="text-3xl font-semibold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  {first?.title || "Vídeo com lembrança"}
                </h2>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-cream-500">Legenda</p>
              <p className="mt-4 text-sm leading-8 text-cream-700">
                {first?.description || "Um vídeo que carrega voz, movimento e atmosfera. Perfeito para aniversários, viagens e cenas em família."}
              </p>
              <div className="mt-6 rounded-[1.5rem] border border-cream-200/80 bg-white/70 p-4 text-xs text-cream-500">
                {formatDate(first?.memory_date)}
              </div>
            </div>
          </div>
        </section>
      );

    case "letter":
      return (
        <section className="page-shell texture p-6 md:p-8">
          <PageHeader page={page} label="Carta" icon={Quote} />
          <div className="h-[calc(100%-4.5rem)] rounded-[2rem] border border-[#dbc7ab]/70 bg-[#fffaf4] p-6 shadow-soft md:p-10">
            <div className="mx-auto max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cream-500">papel manuscrito</p>
              <h2 className="text-4xl font-semibold leading-tight text-cream-900" style={{ fontFamily: "var(--font-playfair)" }}>
                {first?.title || "Uma carta para guardar"}
              </h2>
              <div className="mt-6 space-y-4 text-[1.02rem] leading-9 text-cream-800" style={{ fontFamily: "var(--font-caveat)" }}>
                {(first?.description || "Escreva uma carta, um pensamento ou uma memória especial.").split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 text-sm text-cream-500">{formatDate(first?.memory_date)}</div>
            </div>
          </div>
        </section>
      );

    case "timeline":
      return (
        <section className="page-shell texture p-6 md:p-8">
          <PageHeader page={page} label="Linha do tempo" icon={Bookmark} />
          <div className="space-y-5">
            {ordered.length ? ordered.map((memory, index) => (
              <div key={memory.id} className="grid gap-4 rounded-[1.6rem] border border-white/70 bg-white/60 p-4 shadow-soft md:grid-cols-[120px_1fr]">
                <div className="flex items-start gap-2 text-sm font-medium text-cream-600">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cream-500" />
                  <div>
                    <p className="text-cream-900">{formatDate(memory.memory_date)}</p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-cream-400">#{index + 1}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cream-900">{memory.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-cream-700">{memory.description}</p>
                </div>
              </div>
            )) : (
              <div className="rounded-[2rem] border border-dashed border-cream-300 bg-white/50 p-8 text-center text-sm text-cream-600">
                Adicione memórias para construir esta linha do tempo.
              </div>
            )}
          </div>
        </section>
      );

    case "special":
      return (
        <section className="page-shell texture p-6 md:p-8">
          <PageHeader page={page} label="Página Especial" icon={Sparkles} />
          <div className="grid h-[calc(100%-4.5rem)] gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-[#fffaf4] via-[#f2e0c9] to-[#e2c0a0] p-5 shadow-soft">
              <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.8),transparent_22%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.5),transparent_20%),radial-gradient(circle_at_50%_75%,rgba(255,255,255,0.35),transparent_18%)]" />
              <div className="relative h-full">
                <p className="mb-4 text-xs uppercase tracking-[0.28em] text-cream-600">colagem livre</p>
                <div className="grid grid-cols-2 gap-4">
                  {ordered.slice(0, 4).map((memory, index) => (
                    <div
                      key={memory.id}
                      className="polaroid"
                      style={{ transform: `rotate(${[-6, 3, -2, 5][index]}deg)` }}
                    >
                      <div className="relative aspect-[4/5] rounded-[1rem] bg-white">
                        {memory.media_url ? (
                          <Image src={memory.thumbnail_url || memory.media_url} alt={memory.title || "Memória"} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,#faf4ea,#ecd2b8)] text-center text-xs uppercase tracking-[0.26em] text-cream-600">
                            {memory.title || "frase"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-cream-500">frase especial</p>
              <h2 className="mt-3 text-3xl font-semibold text-cream-900" style={{ fontFamily: "var(--font-playfair)" }}>
                Uma página para coisas que não cabem em um só formato
              </h2>
              <p className="mt-4 text-sm leading-7 text-cream-700">
                Aqui entram colagens, pequenas notas, recortes, lembranças e qualquer composição livre que dê personalidade ao álbum.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["sticker", "foto", "frase", "cartão", "recorte"].map((chip) => (
                  <span key={chip} className="rounded-full border border-cream-200 bg-white/70 px-3 py-1 text-xs text-cream-600">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      );

    default:
      return (
        <section className="page-shell p-6">
          <PageHeader page={page} label="Página" icon={Sparkles} />
          <div className="rounded-[2rem] bg-white/70 p-6 text-sm text-cream-700">Layout ainda não configurado.</div>
        </section>
      );
  }
}
