"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RouteProgress() {
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const previousPathname = useRef(pathname);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  // Gerakkan progress selama navigation masih berjalan
  useEffect(() => {
    if (!loading) return;

    timer.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return current;
        }

        if (current < 30) {
          return current + 2.5;
        }

        if (current < 60) {
          return current + 1.5;
        }

        if (current < 80) {
          return current + 0.8;
        }

        return current + 0.25;
      });
    }, 60);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [loading]);

  // Navigation selesai ketika pathname berubah
  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;

    const finishFrame = requestAnimationFrame(() => {
      setProgress(100);

      hideTimer.current = setTimeout(() => {
        setVisible(false);
      }, 250);

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    });

    return () => {
      cancelAnimationFrame(finishFrame);

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, [pathname]);

  // Deteksi klik internal link
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");

      if (!href) return;

      if (
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      if (href === pathname) {
        return;
      }

      setVisible(true);
      setProgress(5);
      setLoading(true);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  return (
    <div
      className={`pointer-events-none fixed left-0 top-0 z-9999 h-0.5 w-full transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.7)] transition-[width] duration-300 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
