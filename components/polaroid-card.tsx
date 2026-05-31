"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Memory } from "@/lib/types";

function seedFromString(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = Math.imul(31, h) + input.charCodeAt(i);
  }
  return Math.abs(h);
}

export default function PolaroidCard({
  memory,
  className = "",
  forceRotate,
}: {
  memory: Memory;
  className?: string;
  forceRotate?: number;
}) {
  const seed = useMemo(() => seedFromString(memory.id), [memory.id]);
  const rotate = forceRotate ?? ((seed % 9) - 4);
  const [tilt, setTilt] = useState(false);

  const media = memory.thumbnail_url || memory.media_url;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, rotate: rotate + 0.5 }}
      whileTap={{ scale: 0.99 }}
      onTapStart={() => setTilt(true)}
      onTapCancel={() => setTilt(false)}
      onTap={() => setTilt((value) => !value)}
      className={`polaroid text-left ${className}`}
      style={{ transform: `rotate(${tilt ? rotate + 1.5 : rotate}deg)` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-gradient-to-br from-[#e7cfb0] via-[#f2e0c7] to-[#fff8ef]">
        {media ? (
          <>
            {memory.type === "video" ? (
              <video src={media} className="h-full w-full object-cover" muted playsInline />
            ) : (
              <Image src={media} alt={memory.title || "Memória"} fill className="object-cover" />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_36%),linear-gradient(180deg,#e6d2b7,#caa47a)] p-4">
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-cream-700">sem mídia</span>
          </div>
        )}
      </div>
      <div className="space-y-1 px-1 pt-4 pb-1">
        <h3 className="line-clamp-1 text-sm font-semibold text-cream-900">{memory.title || "Sem título"}</h3>
        <p className="line-clamp-2 text-xs leading-5 text-cream-600">{memory.description || "Memória guardada com carinho."}</p>
      </div>
    </motion.button>
  );
}
