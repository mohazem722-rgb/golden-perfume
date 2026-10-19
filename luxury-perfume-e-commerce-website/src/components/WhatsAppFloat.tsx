"use client";

import { MessageCircle } from "lucide-react";
import { useLang } from "./LanguageProvider";

export default function WhatsAppFloat() {
  const { t } = useLang();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201000000000"; // placeholder — set real number via env
  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent("Hello MAISON NOIR, I have a question.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className="pulse-gold fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1fa855] to-[#128c4a] text-white shadow-[0_10px_35px_-5px_rgba(18,140,74,0.7)] transition-transform hover:scale-110 rtl:left-6 rtl:right-auto"
    >
      <MessageCircle size={26} fill="currentColor" />
    </a>
  );
}
