"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

export interface ViewerMedia {
  src: string;
  alt?: string;
  type: "image" | "video";
}

interface PhotoViewerProps {
  photos: ViewerMedia[];
  initialIndex?: number;
  open?: boolean;
  onClose?: () => void;
}

export default function PhotoViewer({
  photos,
  initialIndex = 0,
  open = false,
  onClose,
}: PhotoViewerProps) {
  const [index, setIndex] = useState(initialIndex);

  /*
   * Jangan menggunakan useEffect untuk melakukan setIndex secara
   * langsung ketika props berubah karena React 19 lint akan
   * menganggapnya sebagai cascading render.
   *
   * Nilai index dinormalisasi ketika digunakan.
   */
  if (!open || photos.length === 0) {
    return null;
  }

  const safeIndex = Math.min(
    Math.max(index, 0),
    photos.length - 1,
  );

  const currentMedia = photos[safeIndex];

  if (!currentMedia) {
    return null;
  }

  const hasPrevious = photos.length > 1;
  const hasNext = photos.length > 1;

  const goPrevious = () => {
    if (!hasPrevious) {
      return;
    }

    setIndex((current) =>
      current <= 0 ? photos.length - 1 : current - 1,
    );
  };

  const goNext = () => {
    if (!hasNext) {
      return;
    }

    setIndex((current) =>
      current >= photos.length - 1 ? 0 : current + 1,
    );
  };

  const handleDownload = () => {
    const link = document.createElement("a");

    link.href = currentMedia.src;
    link.download = currentMedia.alt ?? "media";

    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      {/* TOP BAR */}
      <div className="absolute right-4 top-4 z-100 flex items-center gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          title="Download"
          aria-label="Download media"
        >
          <Download className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          title="Tutup"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* MEDIA */}
      <div className="relative flex h-full w-full max-w-6xl items-center justify-center">
        {currentMedia.type === "video" ? (
          <video
            key={currentMedia.src}
            src={currentMedia.src}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
          >
            Browser kamu tidak mendukung pemutaran video.
          </video>
        ) : (
          <div className="relative h-[85vh] w-full">
            <Image
              src={currentMedia.src}
              alt={currentMedia.alt ?? "Dokumentasi"}
              fill
              sizes="100vw"
              className="object-contain"
              unoptimized
              priority
            />
          </div>
        )}
      </div>

      {/* PREVIOUS */}
      {hasPrevious && (
        <button
          type="button"
          onClick={goPrevious}
          className="absolute left-4 top-1/2 z-100 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          title="Sebelumnya"
          aria-label="Media sebelumnya"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* NEXT */}
      {hasNext && (
        <button
          type="button"
          onClick={goNext}
          className="absolute right-4 top-1/2 z-100 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          title="Berikutnya"
          aria-label="Media berikutnya"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* COUNTER */}
      {photos.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-100 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
          {safeIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}