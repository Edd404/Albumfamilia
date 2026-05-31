"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight, Sparkles, Camera, BookOpenText } from "lucide-react";

const floaters = Array.from({ length: 14 }, (_, index) => index);

export default function HomeHero() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 overflow-hidden">
        {floaters.map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/60 blur-[1px]"
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-5xl"
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="soft-panel texture relative overflow-hidden p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(228,192,154,0.18),transparent_35%)]" />
            <div className="relative space-y-6">
              <span className="page-label">Álbum privado da família</span>
              <div className="space-y-4">
                <h1 className="max-w-xl text-5xl leading-[0.95] font-semibold tracking-tight text-cream-900 md:text-7xl" style={{ fontFamily: "var(--font-playfair)" }}>
                  Nossa História,
                  <br />
                  em páginas que viram memória
                </h1>
                <p className="max-w-2xl text-base leading-8 text-cream-800 md:text-lg">
                  Um álbum digital com clima de livro artesanal: fotos, vídeos, cartas e pequenos momentos organizados como lembranças vivas.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/login" className="glass-btn-dark">
                  Abrir álbum <ArrowRight size={18} />
                </Link>
                <a href="#como-funciona" className="glass-btn">
                  Ver a experiência <Sparkles size={18} />
                </a>
              </div>

              <div className="grid gap-3 pt-4 sm:grid-cols-3">
                {[
                  { icon: Camera, label: "Fotos e vídeos" },
                  { icon: BookOpenText, label: "Cartas e relatos" },
                  { icon: Heart, label: "Memória afetiva" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.5rem] border border-white/60 bg-white/55 p-4">
                    <item.icon className="mb-3 text-cream-700" size={20} />
                    <p className="text-sm font-medium text-cream-900">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="paper-panel texture relative overflow-hidden p-5 md:p-6">
            <div className="rounded-[1.8rem] border border-cream-200/70 bg-[#fffaf4] p-5 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cream-500">Prévia</p>
                  <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
                    Um álbum que parece real
                  </h2>
                </div>
                <span className="rounded-full bg-cream-100 px-3 py-1 text-xs text-cream-700">polaroid</span>
              </div>

              <div className="space-y-4">
                <motion.div
                  animate={{ rotate: [-1.5, 1.5, -1.5] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="polaroid max-w-[92%] rotate-[-2deg]"
                >
                  <div className="aspect-[4/5] rounded-[1rem] bg-gradient-to-br from-[#d9c1a4] via-[#ecd9be] to-[#f7efe4]" />
                  <div className="px-1 pt-4 pb-2">
                    <p className="text-sm font-medium">Primeira lembrança</p>
                    <p className="text-xs text-cream-500">uma tarde comum que virou tesouro</p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="polaroid rotate-[2deg]">
                    <div className="aspect-[4/5] rounded-[1rem] bg-[linear-gradient(180deg,#fff4e2,#e8c9a7)]" />
                  </div>
                  <div className="polaroid rotate-[-1deg] translate-y-4">
                    <div className="aspect-[4/5] rounded-[1rem] bg-[linear-gradient(180deg,#f6e5d5,#d8baa0)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="como-funciona" className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Login privado",
              text: "Entrada protegida por Supabase Auth e middleware.",
            },
            {
              title: "Páginas do álbum",
              text: "Layouts variados com virada de página realista.",
            },
            {
              title: "Upload emocional",
              text: "Fotos, vídeos e textos organizados por data e página.",
            },
          ].map((card) => (
            <div key={card.title} className="soft-panel p-6">
              <h3 className="mb-2 text-xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>{card.title}</h3>
              <p className="text-sm leading-7 text-cream-700">{card.text}</p>
            </div>
          ))}
        </section>
      </motion.section>
    </main>
  );
}
