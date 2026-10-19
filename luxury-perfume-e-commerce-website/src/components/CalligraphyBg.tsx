"use client";

import { usePathname } from "next/navigation";

/**
 * Fixed Arabic calligraphy background on ALL pages.
 * White lines on pure black background.
 */
export default function CalligraphyBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* pure black base */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* main calligraphy texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/calligraphy-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          filter: "invert(1) contrast(1.3) brightness(0.9)",
          mixBlendMode: "screen",
          opacity: 0.2, // slightly increased to show well under the hero
        }}
      />
    </div>
  );
}
