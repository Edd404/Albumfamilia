"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/actions";
import Link from "next/link";
import { LockKeyhole, ArrowRight, Sparkles } from "lucide-react";

const initialState: ActionState = { ok: false };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,24,14,0.55),transparent_40%),linear-gradient(180deg,rgba(25,17,12,0.92),rgba(71,47,30,0.8))]" />
      <section className="relative w-full max-w-md overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#f8efe3]/95 p-8 shadow-paper backdrop-blur-xl">
        <div className="mb-8 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cream-700">
            <Sparkles size={14} /> Acesso privado
          </span>
          <h1 className="text-4xl font-semibold text-cream-900" style={{ fontFamily: "var(--font-playfair)" }}>
            Entrar no álbum
          </h1>
          <p className="text-sm leading-7 text-cream-700">
            Login central, discreto e seguro para abrir as memórias da família.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-cream-800">E-mail</span>
            <input name="email" type="email" placeholder="voce@exemplo.com" className="subtle-input" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-cream-800">Senha</span>
            <input name="password" type="password" placeholder="••••••••" className="subtle-input" />
          </label>

          {state.message ? (
            <p className={`rounded-2xl px-4 py-3 text-sm ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="glass-btn-dark w-full justify-center"
          >
            <LockKeyhole size={18} />
            {pending ? "Entrando..." : "Abrir álbum"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-cream-500">
          <Link href="/" className="hover:text-cream-800">Voltar</Link>
          <span>Supabase Auth</span>
        </div>
      </section>
    </main>
  );
}
