/**
 * Curated, high-resolution imagery (Pexels CDN).
 *
 * One source of truth shared by:
 *  - scripts/seed.ts          (new databases)
 *  - scripts/update-images.ts (refresh image_url on an existing database)
 *  - the home / about pages   (category + boutique imagery)
 *
 * Product cards are portrait (4:5), so product URLs are requested as a
 * 1080x1350 centre crop; category tiles are requested landscape.
 * Images are generic luxury-fragrance photography matched to the
 * product *type* (oud oil, incense, diffuser, candle, gift set…) rather
 * than fake recreations of trademarked bottles.
 */
const pex = (id: number, w = 1080, h = 1350) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const PRODUCT_IMAGE_POOLS: Record<string, number[]> = {
  men: [36834158, 36834160, 35930230, 33820368, 2922276, 7702669, 29805437],
  women: [19086282, 20470833, 20407122, 15007560, 4736018, 3712787, 15007550],
  unisex: [15007550, 9202860, 38631058, 29903861, 12456279, 7702669, 33820368],
  oriental: [11482468, 17155333, 30618765, 16125095, 14490628, 35658144, 29805437, 9202860],
  home: [6311846, 28260282, 36801962, 18987024, 5969414, 19784827, 4167111, 33163926, 11083507],
  gift: [30999236, 34144749, 36482359, 30999129, 36459921, 16722451],
};

/** Type-accurate overrides for products whose form is not a spray bottle. */
function specialImage(nameEn: string): string | null {
  const n = nameEn.toLowerCase();
  if (n.includes("incense") || n.includes("maamoul")) return pex(17860048);
  if (n.includes("electric incense burner")) return pex(17860048);
  if (n.includes("car freshener")) return pex(3872727);
  if (n.includes("electric diffuser")) return pex(2044432);
  if (n.includes("reed diffuser") || n.includes("diffuser")) return pex(5969414);
  if (n.includes("candle")) return pex(6311846);
  if (n.includes("fabric spray") || n.includes("room spray")) return pex(37541153);
  if (n.includes("musk") && !n.includes("musk therapy")) return pex(14490628);
  if (n.includes("oud") || n.includes("dahn")) return pex(11482468);
  if (n.includes("rose")) return pex(30618765);
  return null;
}

export function productImageFor(nameEn: string, category: string, indexInCategory: number): string {
  const special = specialImage(nameEn);
  if (special) return special;
  const pool = PRODUCT_IMAGE_POOLS[category] ?? PRODUCT_IMAGE_POOLS.men;
  return pex(pool[indexInCategory % pool.length]);
}

export function categoryImage(slug: string): string {
  const pool = PRODUCT_IMAGE_POOLS[slug] ?? PRODUCT_IMAGE_POOLS.men;
  return pex(pool[0], 1400, 1000);
}

export const STORE_IMAGES: string[] = [
  pex(32817142, 1400, 1050),
  pex(5531708, 1400, 1050),
  pex(35930230, 1400, 1050),
];
