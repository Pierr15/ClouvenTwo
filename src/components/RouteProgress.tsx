"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

const MIN_VISIBLE_TIME = 350;

export default function RouteProgress() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const started = useRef(false);
  const startedAt = useRef(0);

  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ================================================
  // GERAKKAN BAR SELAMA NAVIGATION MASIH PENDING
  // ================================================

  useEffect(() => {
    if (!isPending || !started.current) {
      return;
    }

    progressTimer.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return current;
        }

        if (current < 25) {
          return Math.min(current + 1.8, 25);
        }

        if (current < 50) {
          return Math.min(current + 1.1, 50);
        }

        if (current < 70) {
          return Math.min(current + 0.65, 70);
        }

        if (current < 85) {
          return Math.min(current + 0.3, 85);
        }

        return Math.min(current + 0.12, 92);
      });
    }, 50);

    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    };
  }, [isPending]);

  // ================================================
  // NAVIGATION BENAR-BENAR SELESAI
  // ================================================

  useEffect(() => {
    if (isPending || !started.current) {
      return;
    }

    const elapsed = performance.now() - startedAt.current;

    const remaining = Math.max(0, MIN_VISIBLE_TIME - elapsed);

    finishTimer.current = setTimeout(() => {
      requestAnimationFrame(() => {
        setProgress(100);

        hideTimer.current = setTimeout(() => {
          setVisible(false);

          setTimeout(() => {
            setProgress(0);
            started.current = false;
          }, 200);
        }, 180);
      });
    }, remaining);

    return () => {
      if (finishTimer.current) {
        clearTimeout(finishTimer.current);
      }

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, [isPending]);

  // ================================================
  // INTERCEPT SEMUA INTERNAL LINK
  // ================================================

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Hanya klik kiri biasa
      if (event.button !== 0) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>("a");

      if (!link) {
        return;
      }

      // Jangan ganggu link download / new tab
      if (link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const destination = new URL(link.href, window.location.href);

      // External URL
      if (destination.origin !== window.location.origin) {
        return;
      }

      // Anchor di halaman yang sama
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        destination.hash
      ) {
        return;
      }

      // Klik menuju URL yang persis sama
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        !destination.hash
      ) {
        return;
      }

      event.preventDefault();

      // Bersihkan timer navigasi sebelumnya
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }

      if (finishTimer.current) {
        clearTimeout(finishTimer.current);
      }

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }

      started.current = true;
      startedAt.current = performance.now();

      setVisible(true);
      setProgress(4);

      const href = destination.pathname + destination.search + destination.hash;

      startTransition(() => {
        router.push(href);
      });
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [router]);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-9999 h-0.5 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.75)] transition-[width] duration-300 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
