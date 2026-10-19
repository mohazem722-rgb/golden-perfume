"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  productId: number;
  nameAr: string;
  nameEn: string;
  brand: string;
  size: string;
  price: number; // base price EGP
  discount: number; // percent
  imageUrl: string;
  qty: number;
};

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: number) => void;
  setQty: (productId: number, qty: number) => void;
  clear: () => void;
  wishlist: number[];
  toggleWish: (productId: number) => void;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mn-cart");
      if (raw) setItems(JSON.parse(raw));
      const w = localStorage.getItem("mn-wish");
      if (w) setWishlist(JSON.parse(w));
    } catch {}
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem("mn-cart", JSON.stringify(next));
  };

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      const next = existing
        ? prev.map((i) => (i.productId === item.productId ? { ...i, qty: Math.min(i.qty + qty, 20) } : i))
        : [...prev, { ...item, qty }];
      localStorage.setItem("mn-cart", JSON.stringify(next));
      return next;
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((productId: number) => {
    persist(items.filter((i) => i.productId !== productId));
  }, [items]);

  const setQty = useCallback((productId: number, qty: number) => {
    if (qty <= 0) {
      persist(items.filter((i) => i.productId !== productId));
      return;
    }
    persist(items.map((i) => (i.productId === productId ? { ...i, qty: Math.min(qty, 20) } : i)));
  }, [items]);

  const clear = useCallback(() => persist([]), []);

  const toggleWish = useCallback((productId: number) => {
    setWishlist((prev) => {
      const next = prev.includes(productId) ? prev.filter((x) => x !== productId) : [...prev, productId];
      localStorage.setItem("mn-wish", JSON.stringify(next));
      return next;
    });
  }, []);

  const subtotal = items.reduce((s, i) => s + Math.round(i.price * (1 - i.discount / 100)) * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      add,
      remove,
      setQty,
      clear,
      wishlist,
      toggleWish,
    }),
    [items, count, subtotal, isOpen, add, remove, setQty, clear, wishlist, toggleWish]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): Ctx {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
