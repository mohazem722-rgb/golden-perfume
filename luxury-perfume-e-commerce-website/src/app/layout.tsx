import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Aref_Ruqaa, Inter, Tajawal, Amiri } from "next/font/google";
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

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter-next" });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-tajawal-next" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri-next" });
const arefRuqaa = Aref_Ruqaa({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-diwani-next" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body dir="rtl" className={`${inter.variable} ${tajawal.variable} ${amiri.variable} ${arefRuqaa.variable} bg-maison min-h-screen text-[#ece5d3] antialiased`} suppressHydrationWarning>
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
