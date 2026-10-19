import {
  pgTable,
  serial,
  uuid,
  text,
  varchar,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  date,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 120 }).notNull().default(""),
  size: varchar("size", { length: 40 }).notNull().default("100ml"),
  price: integer("price").notNull(), // EGP
  category: varchar("category", { length: 40 }).notNull(), // men | women | unisex | oriental | home | gift
  imageUrl: text("image_url").notNull().default(""),
  stock: integer("stock").notNull().default(25),
  discount: integer("discount").notNull().default(0), // percent
  rating: real("rating").notNull().default(4.6),
  reviewsCount: integer("reviews_count").notNull().default(0),
  sales: integer("sales").notNull().default(0),
  isNew: boolean("is_new").notNull().default(false),
  descriptionAr: text("description_ar").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const shippingRates = pgTable("shipping_rates", {
  id: serial("id").primaryKey(),
  governorate: varchar("governorate", { length: 80 }).notNull().unique(),
  governorateAr: varchar("governorate_ar", { length: 80 }).notNull().default(""),
  price: integer("price").notNull(),
  estimatedDays: varchar("estimated_days", { length: 20 }).notNull().default("2-4"),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  discountPercent: integer("discount_percent").notNull(),
  maxUses: integer("max_uses").notNull().default(100),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  active: boolean("active").notNull().default(true),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  trackingCode: varchar("tracking_code", { length: 16 }).notNull().unique(),
  customerId: integer("customer_id"),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
  customerEmail: varchar("customer_email", { length: 160 }).default(""),
  governorate: varchar("governorate", { length: 80 }).notNull(),
  address: text("address").notNull().default(""),
  items: jsonb("items").notNull(), // [{productId, nameAr, nameEn, qty, price}]
  subtotal: integer("subtotal").notNull(),
  shippingCost: integer("shipping_cost").notNull().default(75),
  discountCode: varchar("discount_code", { length: 40 }).default(""),
  discountAmount: integer("discount_amount").notNull().default(0),
  giftWrap: boolean("gift_wrap").notNull().default(false),
  giftCardText: text("gift_card_text").notNull().default(""),
  total: integer("total").notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull().default("cod"),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"),
  orderStatus: varchar("order_status", { length: 20 }).notNull().default("preparing"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  phone: varchar("phone", { length: 40 }).notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  governorate: varchar("governorate", { length: 80 }).notNull().default(""),
  address: text("address").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull().default(""),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 160 }).notNull(),
  smsOptIn: boolean("sms_opt_in").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type ShippingRate = typeof shippingRates.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Customer = typeof customers.$inferSelect;
