"use client";

import { useMemo, useState, type ElementType } from "react";
import type { MemoryType, Page } from "@/lib/types";
import { X, Upload, ImageUp, MessageSquareText, MicVocal, Film, LoaderCircle } from "lucide-react";

const memoryTypes: { value: MemoryType; label: string; icon: ElementType }[] = [
  { value: "image", label: "Foto", icon: ImageUp },
  { value: "video", label: "Vídeo", icon: Film },
  { value: "text", label: "Texto", icon: MessageSquareText },
  { value: "letter", label: "Carta", icon: MessageSquareText },
  { value: "audio", label: "Áudio", icon: MicVocal },
  { value: "timeline", label: "Timeline", icon: MessageSquareText },
];

async function getUploadSignature() {
  const response = await fetch("/api/cloudinary/sign", { method: "POST" });
  if (!response.ok) {
    throw new Error("Não foi possível preparar o upload.");
  }
  return response.json() as Promise<{
    cloudName: string;
    apiKey: string;
    timestamp: number;
    folder: string;
    signature: string;
  }>;
}

export default function UploadModal({
  pages,
  defaultPageId,
  onClose,
  onSaved,
}: {
  pages: Page[];
  defaultPageId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [pageId, setPageId] = useState(defaultPageId || pages[0]?.id || "");
  const [type, setType] = useState<MemoryType>("image");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [position, setPosition] = useState("0");
  const [file, setFile] = useState<File | null>(null);

  const selectedType = useMemo(
    () => memoryTypes.find((item) => item.value === type),
    [type]
  );

  const close = () => {
    setOpen(false);
    onClose();
  };

  const save = async () => {
    try {
      setLoading(true);
      setMessage(null);

      let media_url: string | null = null;
      let thumbnail_url: string | null = null;

      if (type === "image" || type === "video" || type === "audio") {
        if (!file) {
          throw new Error("Selecione um arquivo para continuar.");
        }

        const signature = await getUploadSignature();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signature.apiKey);
        formData.append("timestamp", String(signature.timestamp));
        formData.append("signature", signature.signature);
        formData.append("folder", signature.folder);

        const upload = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });

        if (!upload.ok) {
          throw new Error("Falha ao enviar a mídia para o Cloudinary.");
        }

        const result = await upload.json();
        media_url = result.secure_url;
        thumbnail_url =
          type === "video"
            ? `https://res.cloudinary.com/${signature.cloudName}/video/upload/so_0/${result.public_id}.jpg`
            : result.secure_url;
      }

      const response = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id: pageId,
          type,
          title,
          description,
          memory_date: memoryDate || null,
          media_url,
          thumbnail_url,
          position: Number(position || 0),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Não foi possível salvar.");
      }

      setMessage("Memória salva com sucesso.");
      onSaved();
      setTimeout(close, 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-3 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-[#fff9f1]/98 shadow-paper">
        <div className="flex items-center justify-between border-b border-cream-200/70 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cream-500">Adicionar memória</p>
            <h2 className="text-2xl font-semibold text-cream-900" style={{ fontFamily: "var(--font-playfair)" }}>
              Upload suave
            </h2>
          </div>
          <button type="button" onClick={close} className="rounded-full p-2 text-cream-500 hover:bg-white">
            <X />
          </button>
        </div>

        <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-cream-800">Página</span>
            <select className="subtle-select" value={pageId} onChange={(e) => setPageId(e.target.value)}>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  Página {page.page_number} · {page.layout_type}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-cream-800">Tipo</span>
            <select className="subtle-select" value={type} onChange={(e) => setType(e.target.value as MemoryType)}>
              {memoryTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-cream-800">Título</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="subtle-input" placeholder="Ex.: Primeiro passeio" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-cream-800">Data</span>
            <input value={memoryDate} onChange={(e) => setMemoryDate(e.target.value)} type="date" className="subtle-input" />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-cream-800">Descrição</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="subtle-textarea"
              placeholder="Escreva aqui a emoção, o contexto ou a lembrança."
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-cream-800">Ordem</span>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              type="number"
              className="subtle-input"
              min={0}
            />
          </label>

          <div className="rounded-[1.5rem] border border-dashed border-cream-300 bg-white/55 p-4">
            <p className="mb-2 text-sm font-medium text-cream-800">Upload</p>
            {selectedType?.value === "text" || selectedType?.value === "letter" || selectedType?.value === "timeline" ? (
              <p className="text-sm leading-7 text-cream-600">Para este tipo, a mídia é opcional. Você pode salvar apenas texto.</p>
            ) : (
              <>
                <input
                  type="file"
                  accept={type === "video" ? "video/*" : type === "audio" ? "audio/*" : "image/*"}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-cream-700 file:mr-4 file:rounded-full file:border-0 file:bg-cream-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-cream-800"
                />
                <p className="mt-2 text-xs text-cream-500">
                  {file ? `Arquivo escolhido: ${file.name}` : "Escolha uma foto, vídeo ou áudio."}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-cream-200/70 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-cream-600">{message || "Tudo será salvo automaticamente após o upload."}</p>
          <div className="flex gap-3">
            <button type="button" onClick={close} className="glass-btn">
              Cancelar
            </button>
            <button type="button" onClick={save} disabled={loading} className="glass-btn-dark">
              {loading ? <LoaderCircle className="animate-spin" size={16} /> : <Upload size={16} />}
              {loading ? "Salvando..." : "Salvar memória"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
