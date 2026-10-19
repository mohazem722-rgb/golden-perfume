import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
// Self-hosted fonts (Fontsource) — no Google Fonts fetch at build time,
// so `next build` works offline and can never fail on Vercel due to a
// fonts.googleapis.com outage.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "@fontsource/aref-ruqaa/400.css";
import "@fontsource/aref-ruqaa/700.css";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CalligraphyBg from "@/components/CalligraphyBg";

export const metadata: Metadata = {
  title: "MAISON NOIR — ميزون نوار | Luxury Perfumes",
  description:
    "MAISON NOIR — Egyptian luxury perfume house since 2010. Rare niche, oriental & oud fragrances with express delivery across Egypt.",
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
};

const bootScript = `
(function(){
  try{
    var l = localStorage.getItem('mn-lang') || 'ar';
    var d = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', d);
    document.documentElement.setAttribute('lang', l);
  }catch(e){}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body dir="rtl" className="bg-maison min-h-screen text-[#ece5d3] antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <CartProvider>
            <CalligraphyBg />
            <Navbar />
            <main className="relative z-[1]">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppFloat />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
