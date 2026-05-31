"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Album, Memory, Page } from "@/lib/types";
import { AlbumPageView } from "@/components/page-views";
import { ChevronLeft, ChevronRight, Music2, Settings2 } from "lucide-react";
import Link from "next/link";

const FlipBook = dynamic(() => import("react-pageflip"), { ssr: false }) as any;

function useBookSize() {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 360,
    height: 560,
  });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const mobile = width < 780;
      setSize({
        width: mobile ? Math.min(390, Math.max(320, width - 32)) : 560,
        height: mobile ? 560 : 760,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

export default function AlbumBook({
  album,
  pages,
  memories,
}: {
  album: Album;
  pages: Page[];
  memories: Memory[];
}) {
  const size = useBookSize();
  const [soundOn, setSoundOn] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const flipRef = useRef<any>(null);

  const pageMap = useMemo(() => {
    const map = new Map<string, Memory[]>();
    memories.forEach((memory) => {
      const list = map.get(memory.page_id) || [];
      list.push(memory);
      map.set(memory.page_id, list);
    });
    return map;
  }, [memories]);

  const playSoftChime = () => {
    if (!soundOn || typeof window === "undefined") return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 523.25;
    osc.type = "sine";
    gain.gain.value = 0.015;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.6);
    osc.stop(ctx.currentTime + 0.7);
  };

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cream-500">Álbum privado</p>
          <h1 className="text-3xl font-semibold text-cream-900 md:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
            {album.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundOn((value) => !value)}
            className={`glass-btn ${soundOn ? "border-cream-300 bg-cream-100" : ""}`}
          >
            <Music2 size={16} />
            {soundOn ? "Som ligado" : "Som opcional"}
          </button>
          <Link href="/editor" className="glass-btn">
            <Settings2 size={16} />
            Editar
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <button
          type="button"
          onClick={() => {
            flipRef.current?.pageFlip()?.flipPrev();
            playSoftChime();
          }}
          className="mx-auto hidden h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/70 shadow-soft lg:flex"
          aria-label="Página anterior"
        >
          <ChevronLeft />
        </button>

        <div className="mx-auto w-full">
          <div className="rounded-[2.4rem] border border-white/70 bg-white/35 p-3 shadow-paper backdrop-blur-sm md:p-4">
            <div className="book-spine rounded-[2rem] p-2 md:p-3">
              <div className="overflow-hidden rounded-[1.8rem]">
                <FlipBook
                  width={size.width}
                  height={size.height}
                  size="fixed"
                  minWidth={320}
                  maxWidth={920}
                  minHeight={480}
                  maxHeight={960}
                  showCover={true}
                  mobileScrollSupport={true}
                  className="mx-auto"
                  onFlip={(e: any) => {
                    setCurrentPage(e.data);
                    playSoftChime();
                  }}
                  ref={flipRef}
                >
                  {pages.map((page) => (
                    <div key={page.id} className="bg-transparent">
                      <AlbumPageView page={page} memories={pageMap.get(page.id) || []} />
                    </div>
                  ))}
                </FlipBook>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            flipRef.current?.pageFlip()?.flipNext();
            playSoftChime();
          }}
          className="mx-auto hidden h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/70 shadow-soft lg:flex"
          aria-label="Próxima página"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between gap-4 text-sm text-cream-600">
        <p>Página {Math.min(currentPage + 1, pages.length)} de {pages.length}</p>
        <p>{pages.length === 0 ? "Sem páginas ainda" : "Toque, arraste ou clique nas laterais para virar."}</p>
      </div>

      <div className="fixed bottom-4 right-4 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs text-cream-700 shadow-soft md:hidden">
        Arraste para virar
      </div>
    </main>
  );
}
