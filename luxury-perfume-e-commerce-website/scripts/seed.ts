/**
 * MAISON NOIR — Database seed
 * Run: npx tsx scripts/seed.ts
 * Idempotent: skips product seeding if catalog already present.
 */
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { products, shippingRates, coupons, reviews, orders } from "../src/db/schema";

// --- load .env / .env.local manually (no dotenv dependency for scripts) ---
for (const name of [".env.local", ".env"]) {
  const envPath = path.resolve(process.cwd(), name);
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  }
}

// Seeding must use the DIRECT connection (5432), not the transaction pooler.
const seedUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: seedUrl,
  ssl: seedUrl && /supabase\.(co|com)/.test(seedUrl) ? { rejectUnauthorized: false } : undefined,
});
const db = drizzle(pool);

const pex = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

const IMG = {
  men: [11265021, 7850600, 36834015, 11216321, 11517300, 31771395, 38729524].map(pex),
  women: [10924522, 29986521, 11216292, 37468240, 28720745, 5790458].map(pex),
  unisex: [7850600, 12402368, 30981935, 11216292, 11216321].map(pex),
  oriental: [30981935, 35806942, 3615228, 37387732, 12402368, 12402358, 5790458, 36493389].map(pex),
  home: [20390718, 20390720, 20390719, 15852128, 6724505, 15852127].map(pex),
  gift: [12053220, 15737946, 27274882, 10199016, 38729524, 12053220].map(pex),
};
const counters: Record<string, number> = {};
function imgFor(cat: string): string {
  const poolArr = (IMG as Record<string, string[]>)[cat] || IMG.men;
  const i = counters[cat] ?? 0;
  counters[cat] = i + 1;
  return poolArr[i % poolArr.length];
}

type Row = [string, string, string, string, number, string, number, number?];
// [nameAr, nameEn, brand, size, price, category, sales, discount]
const CATALOG: Row[] = [
  // ---------------- MEN (25) ----------------
  ["بلو دي شانيل", "Bleu de Chanel", "Chanel", "100ml", 3200, "men", 184, 10],
  ["سوفاج", "Sauvage", "Dior", "100ml", 2900, "men", 230],
  ["أكوا دي جيو", "Acqua di Gio", "Giorgio Armani", "100ml", 2500, "men", 150],
  ["وان مليون", "1 Million", "Paco Rabanne", "100ml", 2200, "men", 175, 15],
  ["أفينتوس", "Aventus", "Creed", "100ml", 5500, "men", 96],
  ["لا نوي دو لوم", "La Nuit de L'Homme", "Yves Saint Laurent", "100ml", 2700, "men", 141],
  ["عود وود", "Oud Wood", "Tom Ford", "50ml", 4800, "men", 88],
  ["إيروس", "Eros", "Versace", "100ml", 2100, "men", 167, 10],
  ["بلاك أوبيوم للرجال", "Black Opium Men", "Yves Saint Laurent", "100ml", 2600, "men", 120],
  ["توباكو فانيل", "Tobacco Vanille", "Tom Ford", "50ml", 4500, "men", 74],
  ["لو مال", "Le Male", "Jean Paul Gaultier", "100ml", 1850, "men", 132, 20],
  ["إنفيكتوس", "Invictus", "Paco Rabanne", "100ml", 1950, "men", 129],
  ["تير دي هيرميس", "Terre d'Hermès", "Hermès", "100ml", 3100, "men", 101],
  ["سبايسبومب", "Spicebomb", "Viktor&Rolf", "90ml", 2350, "men", 84],
  ["بوس بوتلد", "Boss Bottled", "Hugo Boss", "100ml", 1750, "men", 143, 25],
  ["ذا وان", "The One", "Dolce&Gabbana", "100ml", 2050, "men", 118],
  ["أزارو وانتد", "Azzaro Wanted", "Azzaro", "100ml", 1650, "men", 137, 15],
  ["ألور أوم سبورت", "Allure Homme Sport", "Chanel", "100ml", 2850, "men", 93],
  ["فهرنهايت", "Fahrenheit", "Dior", "100ml", 2400, "men", 66],
  ["ديور أوم إنتنس", "Dior Homme Intense", "Dior", "100ml", 3300, "men", 105],
  ["جنتلمان", "Gentleman", "Givenchy", "100ml", 2650, "men", 78],
  ["ليجند", "Legend", "Montblanc", "100ml", 1500, "men", 149, 20],
  ["إكسبلورر", "Explorer", "Montblanc", "100ml", 1900, "men", 112],
  ["بلاك إكس إس", "Black XS", "Paco Rabanne", "100ml", 1700, "men", 82],
  ["لونا روسا كاربون", "Luna Rossa Carbon", "Prada", "100ml", 2750, "men", 58],
  // ---------------- WOMEN (25) ----------------
  ["كوكو مادموزيل", "Coco Mademoiselle", "Chanel", "100ml", 3100, "women", 176, 10],
  ["لا في إي بيل", "La Vie Est Belle", "Lancôme", "75ml", 2800, "women", 198],
  ["بلاك أوبيوم", "Black Opium", "Yves Saint Laurent", "90ml", 2600, "women", 212, 15],
  ["جود جيرل", "Good Girl", "Carolina Herrera", "80ml", 2400, "women", 189],
  ["شانيل رقم 5", "Chanel No.5", "Chanel", "100ml", 3300, "women", 145],
  ["فلاور بومب", "Flowerbomb", "Viktor&Rolf", "100ml", 2200, "women", 134],
  ["ميس ديور", "Miss Dior", "Dior", "100ml", 2900, "women", 157, 10],
  ["لوست تشيري", "Lost Cherry", "Tom Ford", "50ml", 4600, "women", 71],
  ["أوليمبيا", "Olympéa", "Paco Rabanne", "80ml", 2000, "women", 126],
  ["مون باري", "Mon Paris", "Yves Saint Laurent", "90ml", 2500, "women", 139],
  ["جادور", "J'adore", "Dior", "100ml", 3200, "women", 128, 10],
  ["سكاندال", "Scandal", "Jean Paul Gaultier", "80ml", 2100, "women", 117],
  ["سي", "Sì", "Giorgio Armani", "100ml", 2750, "women", 143],
  ["هيبنوتيك بويزون", "Hypnotic Poison", "Dior", "100ml", 2650, "women", 108],
  ["ديزي", "Daisy", "Marc Jacobs", "100ml", 2300, "women", 96, 15],
  ["جيرل أوف ناو", "Girl of Now", "Elie Saab", "90ml", 2400, "women", 84],
  ["أنجيل", "Angel", "Mugler", "100ml", 2450, "women", 91],
  ["212 في آي بي", "212 VIP", "Carolina Herrera", "80ml", 2250, "women", 116, 10],
  ["فانتازي", "Fantasy", "Britney Spears", "100ml", 1200, "women", 158, 25],
  ["برايت كريستال", "Bright Crystal", "Versace", "90ml", 2350, "women", 131],
  ["ليبر", "Libre", "Yves Saint Laurent", "90ml", 2850, "women", 122],
  ["إيدول", "Idôle", "Lancôme", "75ml", 2550, "women", 87],
  ["بلاك أوركيد", "Black Orchid", "Tom Ford", "50ml", 3900, "women", 80],
  ["روز بريك", "Rose Prick", "Tom Ford", "50ml", 4700, "women", 52],
  ["ماي واي", "My Way", "Giorgio Armani", "90ml", 2600, "women", 97, 15],
  // ---------------- UNISEX (10) ----------------
  ["بكارات روج 540", "Baccarat Rouge 540", "Maison Francis Kurkdjian", "70ml", 6500, "unisex", 88, 5],
  ["عود توباكو", "Oud Tobacco", "Tom Ford", "50ml", 4800, "unisex", 74],
  ["سيلفر ماونتن ووتر", "Silver Mountain Water", "Creed", "100ml", 5200, "unisex", 63],
  ["سانتال 33", "Santal 33", "Le Labo", "100ml", 5000, "unisex", 69],
  ["نيرولي بورتوفينو", "Neroli Portofino", "Tom Ford", "50ml", 4200, "unisex", 55],
  ["جرين آيرش تويد", "Green Irish Tweed", "Creed", "100ml", 5400, "unisex", 48],
  ["آنذر 13", "Another 13", "Le Labo", "100ml", 4900, "unisex", 44],
  ["حلفتي", "Halfeti", "Penhaligon's", "100ml", 4700, "unisex", 39],
  ["عود بالاو", "Oud Palao", "Diptyque", "75ml", 3800, "unisex", 36],
  ["مسك ثيرابي", "Musk Therapy", "Initio", "90ml", 5100, "unisex", 31],
  // ---------------- ORIENTAL & OUD (15) ----------------
  ["عود كمبودي تولة", "Oud Cambodi Tola", "Maison Noir Oud", "Tola", 1500, "oriental", 121, 10],
  ["عود معتق تولة", "Aged Oud Tola", "Maison Noir Oud", "Tola", 2000, "oriental", 98],
  ["مسك أبيض", "White Musk", "Al Rehab", "50ml", 350, "oriental", 245],
  ["مسك الغزال", "Musk Al Ghazal", "Abdul Samad Al Qurashi", "50ml", 500, "oriental", 187],
  ["عنبر ملكي", "Royal Amber", "Maison Noir Oud", "50ml", 450, "oriental", 164, 15],
  ["بخور عود سوبر", "Super Oud Incense", "Arabian Oud", "50g", 300, "oriental", 213],
  ["بخور فاخر", "Luxury Incense", "Arabian Oud", "100g", 250, "oriental", 176],
  ["ورد طائفي", "Taif Rose", "Abdul Samad Al Qurashi", "50ml", 600, "oriental", 143],
  ["عود هندي تولة", "Indian Oud Tola", "Maison Noir Oud", "Tola", 1800, "oriental", 81],
  ["دهن العود الملكي", "Royal Dahn Al Oud", "Ajmal", "Tola", 2500, "oriental", 67, 10],
  ["مسك طهارة", "Musk Tahara", "Al Rehab", "50ml", 300, "oriental", 256],
  ["عنبر خشبي", "Amber Wood", "Ajmal", "50ml", 520, "oriental", 128],
  ["صندل ملكي", "Royal Sandalwood", "Rasasi", "50ml", 480, "oriental", 119],
  ["معمول ذهبي", "Golden Maamoul", "Arabian Oud", "60g", 350, "oriental", 91],
  ["زعفران وعود", "Saffron & Oud", "Maison Noir Oud", "50ml", 750, "oriental", 77, 20],
  // ---------------- HOME (10) ----------------
  ["ديفيوزر عود بالأعواد", "Reed Diffuser Oud", "Maison Noir Home", "150ml", 350, "home", 156],
  ["شمعة ورد", "Rose Candle", "Maison Noir Home", "250g", 200, "home", 189, 10],
  ["معطر سيارة", "Car Freshener", "Maison Noir Home", "1pc", 150, "home", 274],
  ["ديفيوزر كهربائي", "Electric Diffuser", "Maison Noir Home", "1pc", 450, "home", 121],
  ["بخاخ أقمشة", "Fabric Spray", "Maison Noir Home", "500ml", 180, "home", 167, 10],
  ["شمعة عنبر", "Amber Candle", "Maison Noir Home", "250g", 220, "home", 143],
  ["معطر غرف مسك", "Musk Room Spray", "Maison Noir Home", "300ml", 160, "home", 152],
  ["مبخرة إلكترونية", "Electric Incense Burner", "Maison Noir Home", "1pc", 550, "home", 76],
  ["ديفيوزر فانيليا", "Vanilla Diffuser", "Maison Noir Home", "150ml", 380, "home", 88],
  ["شمعة عود فاخرة", "Luxury Oud Candle", "Maison Noir Home", "300g", 420, "home", 97],
  // ---------------- GIFT SETS (5) ----------------
  ["طقم رجالي (عطر + مزيل عرق + لوشن)", "Men Gift Set (EDP + Deo + Lotion)", "Maison Noir", "Set", 1800, "gift", 87, 15],
  ["طقم نسائي", "Women Gift Set", "Maison Noir", "Set", 1600, "gift", 93, 15],
  ["طقم العود (عود + بخور + مبخرة)", "Oud Set (Oud + Incense + Burner)", "Maison Noir", "Set", 2500, "gift", 61],
  ["صندوق المسك", "Musk Box", "Maison Noir", "Set", 900, "gift", 112, 10],
  ["طقم العروس (5 منتجات)", "Bride Set (5 pieces)", "Maison Noir", "Set", 3500, "gift", 54],
];

const DESC: Record<string, { ar: string; en: string }> = {
  men: {
    ar: "عطر رجالي فاخر بثبات استثنائي وفوحان يدوم طوال اليوم. مقدمة منعشة وقلب دافئ وقاعدة خشبية عميقة — الاختيار الأمثل للحضور الواثق.",
    en: "A luxurious men's fragrance with exceptional longevity and sillage. Fresh opening, warm heart and a deep woody base — the ultimate choice for a confident presence.",
  },
  women: {
    ar: "عطر نسائي راقٍ يجمع بين الأنوثة والقوة — نفحات زهرية ناعمة تلتقي بقاعدة شرقية دافئة لتترك أثراً لا يُنسى.",
    en: "An elegant feminine fragrance blending softness and strength — delicate floral notes meet a warm oriental base for an unforgettable trail.",
  },
  unisex: {
    ar: "تحفة عطرية للجنسين من دور النيش العالمية — توازن مثالي بين الندرة والجرأة، مصمم لمن يرفض التأقلم مع المألوف.",
    en: "A niche unisex masterpiece — the perfect balance of rarity and boldness, designed for those who refuse the ordinary.",
  },
  oriental: {
    ar: "من قلب التراث العطري العربي — عود ومسك وعنبر فاخر معتق بعناية، يقدَّم في أنقى صوره لعشاق الشرق الأصيل.",
    en: "From the heart of Arabian perfumery — aged oud, musk and amber at their purest, crafted for lovers of authentic oriental luxury.",
  },
  home: {
    ar: "حوّل منزلك إلى جناح من الفخامة — روائح شرقية دافئة تملأ المكان بهدوء وأناقة تدوم لأسابيع.",
    en: "Turn your home into a suite of luxury — warm oriental accords that fill the space with calm elegance lasting for weeks.",
  },
  gift: {
    ar: "أطقم هدايا ميزون نوار تُغلَّف يدوياً بحرير أسود وشريط ذهبي — الإهداء الأمثل لمناسبات لا تُنسى.",
    en: "MAISON NOIR gift sets, hand-wrapped in black silk with a gold ribbon — the perfect gift for unforgettable occasions.",
  },
};

function seededRating(i: number): number {
  const r = 4.2 + ((i * 7) % 8) / 10; // 4.2 - 4.9
  return Math.round(r * 10) / 10;
}

const GOVS: [string, string, number, string][] = [
  ["Cairo", "القاهرة", 60, "1-2"],
  ["Giza", "الجيزة", 60, "1-2"],
  ["Alexandria", "الإسكندرية", 65, "2-3"],
  ["Qalyubia", "القليوبية", 65, "2-3"],
  ["Dakahlia", "الدقهلية", 70, "2-3"],
  ["Sharqia", "الشرقية", 70, "2-3"],
  ["Gharbia", "الغربية", 70, "2-3"],
  ["Monufia", "المنوفية", 70, "2-3"],
  ["Kafr El Sheikh", "كفر الشيخ", 75, "3-4"],
  ["Beheira", "البحيرة", 75, "3-4"],
  ["Damietta", "دمياط", 75, "3-4"],
  ["Port Said", "بورسعيد", 75, "3-4"],
  ["Ismailia", "الإسماعيلية", 75, "3-4"],
  ["Suez", "السويس", 75, "3-4"],
  ["Fayoum", "الفيوم", 80, "3-4"],
  ["Beni Suef", "بني سويف", 80, "3-4"],
  ["Minya", "المنيا", 85, "4-5"],
  ["Assiut", "أسيوط", 85, "4-5"],
  ["Sohag", "سوهاج", 90, "4-5"],
  ["Qena", "قنا", 90, "4-5"],
  ["Luxor", "الأقصر", 90, "4-5"],
  ["Aswan", "أسوان", 95, "5-6"],
  ["Red Sea", "البحر الأحمر", 100, "5-6"],
  ["Matrouh", "مطروح", 100, "5-6"],
  ["North Sinai", "شمال سيناء", 110, "5-7"],
  ["South Sinai", "جنوب سيناء", 110, "5-7"],
  ["New Valley", "الوادي الجديد", 110, "6-7"],
];

const NEW_IDS = new Set([2, 7, 12, 28, 33, 41, 52, 57, 66, 72, 80]);

async function main() {
  // ---- products ----
  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length === 0) {
    await db.insert(products).values(
      CATALOG.map((c, i) => ({
        nameAr: c[0],
        nameEn: c[1],
        brand: c[2],
        size: c[3],
        price: c[4],
        category: c[5],
        sales: c[6],
        discount: c[7] ?? 0,
        imageUrl: imgFor(c[5]),
        rating: seededRating(i),
        reviewsCount: 8 + ((i * 13) % 45),
        stock: 5 + ((i * 11) % 40),
        isNew: NEW_IDS.has(i),
        descriptionAr: DESC[c[5]].ar,
        descriptionEn: DESC[c[5]].en,
      }))
    );
    console.log(`Seeded ${CATALOG.length} products.`);
  } else {
    console.log("Products already seeded — skipping.");
  }

  // ---- shipping rates (upsert price) ----
  for (const g of GOVS) {
    const [ex] = await db.select().from(shippingRates).where(eq(shippingRates.governorate, g[0]));
    if (ex) {
      await db.update(shippingRates).set({ price: g[2], governorateAr: g[1], estimatedDays: g[3] }).where(eq(shippingRates.id, ex.id));
    } else {
      await db.insert(shippingRates).values({ governorate: g[0], governorateAr: g[1], price: g[2], estimatedDays: g[3] });
    }
  }
  console.log(`Shipping rates seeded (${GOVS.length} governorates).`);

  // ---- coupons ----
  const future = new Date(Date.now() + 60 * 24 * 3600 * 1000);
  const seedCoupons = [
    { code: "NOIR10", discountPercent: 10 },
    { code: "GOLD20", discountPercent: 20 },
    { code: "OUD15", discountPercent: 15 },
  ];
  for (const c of seedCoupons) {
    const [ex] = await db.select().from(coupons).where(eq(coupons.code, c.code));
    if (!ex) await db.insert(coupons).values({ ...c, maxUses: 500, expiresAt: future, active: true });
  }
  console.log("Coupons seeded.");

  // ---- sample reviews ----
  const [rev] = await db.select({ id: reviews.id }).from(reviews).limit(1);
  if (!rev) {
    await db.insert(reviews).values([
      { productId: 1, customerName: "أحمد م.", rating: 5, comment: "ثبات رائع وفوحان ممتاز — توصيل سريع جداً." },
      { productId: 1, customerName: "Karim S.", rating: 5, comment: "Original bottle, sealed and authentic. Highly recommended." },
      { productId: 2, customerName: "محمد ع.", rating: 4, comment: "العطر ممتاز لكن التغليف كان يمكن أن يكون أفضل قليلاً." },
      { productId: 27, customerName: "Sara N.", rating: 5, comment: "أجمل ريحة جربتها — بقيت على الملابس يومين!" },
      { productId: 27, customerName: "Mona A.", rating: 5, comment: "Perfect for evenings. Elegant and long lasting." },
      { productId: 51, customerName: "عمر ف.", rating: 5, comment: "بكارات أصلي 100% — سعر ممتاز مقارنة بالسوق." },
      { productId: 66, customerName: "هالة ر.", rating: 4, comment: "روعه كهدية لأمي — مبسوطة جداً." },
    ]);
    console.log("Sample reviews seeded.");
  }

  // ---- demo orders (so admin charts have data) ----
  const [ord] = await db.select({ id: orders.id }).from(orders).limit(1).offset(9);
  if (!ord) {
    const statuses = ["preparing", "shipped", "delivered", "delivered", "shipped", "delivered", "preparing", "delivered", "delivered", "shipped"];
    for (let i = 0; i < 14; i++) {
      const daysAgo = i < 10 ? i : i * 10 + 5; // 10 recent + 4 older (~2-3 months ago)
      const created = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
      const subtotal = 1200 + ((i * 937) % 5200);
      const shipping = i % 3 === 0 ? 60 : 75;
      const id = crypto.randomUUID();
      await db.insert(orders).values({
        id,
        trackingCode: id.replace(/-/g, "").slice(0, 8).toUpperCase(),
        customerName: ["أحمد علي", "Sara Khalil", "محمد حسن", "Nour Adel"][i % 4],
        customerPhone: `0100000${(1000 + i * 37).toString()}`,
        customerEmail: "",
        governorate: ["Cairo", "Giza", "Alexandria"][i % 3],
        address: "—",
        items: [{ productId: 1 + (i % 60), name: "Sample", qty: 1 + (i % 2), price: subtotal }],
        subtotal,
        shippingCost: shipping,
        discountCode: "",
        discountAmount: 0,
        giftWrap: i % 5 === 0,
        giftCardText: "",
        total: subtotal + shipping,
        paymentMethod: ["cod", "visa", "instapay"][i % 3],
        paymentStatus: i % 3 === 0 ? "cod" : i % 4 === 0 ? "pending" : "paid",
        orderStatus: statuses[i % statuses.length],
        createdAt: created,
      });
    }
    console.log("Demo orders seeded.");
  }

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(products);
  console.log(`Done. Catalog size: ${count}`);
  await pool.end();
}

main().catch(async (e) => {
  // One-line summary first so it is visible even in truncated build logs.
  console.error(`SEED_ERROR code=${e?.cause?.code ?? e?.code ?? "?"} message=${e?.cause?.message ?? e?.message ?? e}`);
  console.error(e);
  await pool.end();
  process.exit(1);
});
