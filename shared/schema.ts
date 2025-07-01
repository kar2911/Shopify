import { pgTable, text, serial, integer, boolean, decimal, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "user" or "admin"
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discountPercentage: integer("discount_percentage").default(0),
  image: text("image").notNull(),
  category: text("category").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  stockQuantity: integer("stock_quantity").default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  brand: text("brand"),
  features: text("features"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
}).extend({
  role: z.string().default("user"),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  originalPrice: true,
  discountPercentage: true,
  image: true,
  category: true,
  inStock: true,
  stockQuantity: true,
  rating: true,
  reviewCount: true,
  brand: true,
  features: true,
}).extend({
  inStock: z.boolean().default(true),
  stockQuantity: z.number().default(0),
  rating: z.string().default("0.0"),
  reviewCount: z.number().default(0),
  discountPercentage: z.number().default(0),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
