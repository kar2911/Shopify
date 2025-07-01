// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  products;
  currentUserId;
  currentProductId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.initializeData();
  }
  async initializeData() {
    const usersList = [
      {
        username: "customer",
        email: "customer@example.com",
        password: "password123",
        role: "user"
      },
      {
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      }
    ];
    for (const user of usersList) {
      await this.createUser(user);
    }
    const productsList = [
      {
        name: "Apple AirPods Pro (2nd Generation)",
        description: "Active Noise Cancelling Earbuds with Personalized Spatial Audio, MagSafe Charging Case, H2 Chip",
        price: "199.99",
        originalPrice: "249.99",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&h=500&fit=crop",
        category: "Electronics",
        inStock: true,
        stockQuantity: 50,
        rating: "4.4",
        reviewCount: 89543,
        brand: "Apple",
        features: "Active Noise Cancellation, Spatial Audio, MagSafe Charging, Sweat and Water Resistant"
      },
      {
        name: "Levi's Men's 511 Slim Jeans",
        description: "Classic slim fit jeans made with premium denim, comfortable for all-day wear",
        price: "39.99",
        originalPrice: "59.99",
        discountPercentage: 33,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
        category: "Fashion",
        inStock: true,
        stockQuantity: 75,
        rating: "4.3",
        reviewCount: 12456,
        brand: "Levi's",
        features: "Slim fit, Premium denim, Machine washable, Classic 5-pocket styling"
      },
      {
        name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
        description: "Pressure cooker, slow cooker, rice cooker, steamer, saut\xE9, yogurt maker & warmer",
        price: "79.95",
        originalPrice: "99.95",
        discountPercentage: 20,
        image: "https://m.media-amazon.com/images/I/71VxJc-OAUL._AC_SL1500_.jpg",
        category: "Home & Kitchen",
        inStock: true,
        stockQuantity: 30,
        rating: "4.6",
        reviewCount: 154234,
        brand: "Instant Pot",
        features: "7-in-1 functionality, 6 quart capacity, Stainless steel, Safety certified"
      },
      {
        name: "Nike Air Max 270 Running Shoes",
        description: "Men's running shoes with Max Air unit for exceptional cushioning and style",
        price: "89.99",
        originalPrice: "130.00",
        discountPercentage: 31,
        image: "https://m.media-amazon.com/images/I/71wYhRvBjaL._AC_UY695_.jpg",
        category: "Sports & Outdoors",
        inStock: true,
        stockQuantity: 42,
        rating: "4.5",
        reviewCount: 8765,
        brand: "Nike",
        features: "Max Air cushioning, Breathable mesh upper, Rubber outsole, Lightweight design"
      },
      {
        name: "The Thursday Murder Club by Richard Osman",
        description: "A mystery novel about four unlikely friends who meet to investigate cold cases",
        price: "12.99",
        originalPrice: "16.99",
        discountPercentage: 24,
        image: "https://m.media-amazon.com/images/I/81oJJdxYgML._SY522_.jpg",
        category: "Books & Media",
        inStock: true,
        stockQuantity: 120,
        rating: "4.4",
        reviewCount: 34567,
        brand: "Pamela Dorman Books",
        features: "Bestselling mystery, Award-winning author, Paperback edition, 384 pages"
      },
      {
        name: "Miracle-Gro All Purpose Plant Food",
        description: "Plant fertilizer for indoor and outdoor plants, feeds up to 1,000 sq ft",
        price: "8.97",
        originalPrice: "12.97",
        discountPercentage: 31,
        image: "https://m.media-amazon.com/images/I/91L8rPkD8qL._AC_SL1500_.jpg",
        category: "Home & Garden",
        inStock: true,
        stockQuantity: 85,
        rating: "4.5",
        reviewCount: 9876,
        brand: "Miracle-Gro",
        features: "All-purpose formula, Easy application, Feeds up to 1000 sq ft, Promotes growth"
      },
      {
        name: "CeraVe Daily Moisturizing Lotion",
        description: "Body and face moisturizer with hyaluronic acid and ceramides for normal to dry skin",
        price: "11.97",
        originalPrice: "15.99",
        discountPercentage: 25,
        image: "https://m.media-amazon.com/images/I/71hOLXB7zOL._SL1500_.jpg",
        category: "Beauty & Personal Care",
        inStock: true,
        stockQuantity: 67,
        rating: "4.6",
        reviewCount: 45678,
        brand: "CeraVe",
        features: "Hyaluronic acid, Ceramides, Non-greasy formula, Dermatologist developed"
      },
      {
        name: "Anker PowerCore 10000 Portable Charger",
        description: "Ultra-compact 10000mAh power bank with PowerIQ and VoltageBoost technology",
        price: "21.99",
        originalPrice: "29.99",
        discountPercentage: 27,
        image: "https://m.media-amazon.com/images/I/61yAIW6I2uL._AC_SL1500_.jpg",
        category: "Electronics",
        inStock: true,
        stockQuantity: 95,
        rating: "4.7",
        reviewCount: 67890,
        brand: "Anker",
        features: "10000mAh capacity, PowerIQ technology, Compact design, MultiProtect safety"
      },
      {
        name: "Champion Women's Powercore Sports Bra",
        description: "Medium-support sports bra with removable cups and moisture-wicking fabric",
        price: "15.99",
        originalPrice: "22.00",
        discountPercentage: 27,
        image: "https://m.media-amazon.com/images/I/71Y0KYh5TzL._AC_UY879_.jpg",
        category: "Fashion",
        inStock: true,
        stockQuantity: 38,
        rating: "4.2",
        reviewCount: 5432,
        brand: "Champion",
        features: "Medium support, Moisture-wicking, Removable cups, Racerback design"
      },
      {
        name: "Hamilton Beach 12-Cup Coffee Maker",
        description: "Programmable coffee maker with auto shut-off and 2-hour keep warm",
        price: "29.99",
        originalPrice: "39.99",
        discountPercentage: 25,
        image: "https://m.media-amazon.com/images/I/71c5jH4KBUL._AC_SL1500_.jpg",
        category: "Home & Kitchen",
        inStock: true,
        stockQuantity: 55,
        rating: "4.3",
        reviewCount: 23456,
        brand: "Hamilton Beach",
        features: "12-cup capacity, Programmable, Auto shut-off, 2-hour keep warm"
      },
      {
        name: "Coleman Sundome 4-Person Tent",
        description: "Dome tent with WeatherTec system for camping in various weather conditions",
        price: "54.99",
        originalPrice: "74.99",
        discountPercentage: 27,
        image: "https://m.media-amazon.com/images/I/91OdpGxGZCL._AC_SL1500_.jpg",
        category: "Sports & Outdoors",
        inStock: true,
        stockQuantity: 22,
        rating: "4.4",
        reviewCount: 8765,
        brand: "Coleman",
        features: "4-person capacity, WeatherTec system, Easy setup, Spacious interior"
      },
      {
        name: "Becoming by Michelle Obama",
        description: "Memoir by former First Lady Michelle Obama about her life and experiences",
        price: "14.39",
        originalPrice: "19.99",
        discountPercentage: 28,
        image: "https://m.media-amazon.com/images/I/81h2gWPTYJL._SY522_.jpg",
        category: "Books & Media",
        inStock: true,
        stockQuantity: 78,
        rating: "4.8",
        reviewCount: 89123,
        brand: "Crown Publishing",
        features: "Bestselling memoir, Hardcover edition, 448 pages, Award-winning"
      },
      {
        name: "Scotts Turf Builder Grass Seed",
        description: "Sun and shade grass seed mix for thick, green lawns that crowds out weeds",
        price: "19.97",
        originalPrice: "26.98",
        discountPercentage: 26,
        image: "https://m.media-amazon.com/images/I/91onX9ZmHrL._AC_SL1500_.jpg",
        category: "Home & Garden",
        inStock: true,
        stockQuantity: 33,
        rating: "4.3",
        reviewCount: 6789,
        brand: "Scotts",
        features: "Sun and shade mix, Fast germination, Crowds out weeds, 3 lb coverage"
      },
      {
        name: "Maybelline Fit Me Matte Foundation",
        description: "Liquid foundation that matches skin tone and texture for a natural matte finish",
        price: "5.94",
        originalPrice: "7.99",
        discountPercentage: 26,
        image: "https://m.media-amazon.com/images/I/61cKZS5EIUL._SL1500_.jpg",
        category: "Beauty & Personal Care",
        inStock: true,
        stockQuantity: 89,
        rating: "4.1",
        reviewCount: 34567,
        brand: "Maybelline",
        features: "Matte finish, Natural coverage, Oil-free formula, Available in 40 shades"
      },
      {
        name: "Samsung Galaxy Buds2 Pro",
        description: "True wireless earbuds with intelligent active noise cancellation and 360 Audio",
        price: "149.99",
        originalPrice: "229.99",
        discountPercentage: 35,
        image: "https://m.media-amazon.com/images/I/61+W6h7T79L._AC_SL1500_.jpg",
        category: "Electronics",
        inStock: true,
        stockQuantity: 41,
        rating: "4.3",
        reviewCount: 12345,
        brand: "Samsung",
        features: "Active noise cancellation, 360 Audio, IPX7 water resistant, 8-hour battery"
      },
      {
        name: "adidas Men's Ultraboost 22 Running Shoes",
        description: "Running shoes with BOOST midsole for energy return and Primeknit upper",
        price: "119.99",
        originalPrice: "190.00",
        discountPercentage: 37,
        image: "https://m.media-amazon.com/images/I/71v8V8YRd2L._AC_UY695_.jpg",
        category: "Sports & Outdoors",
        inStock: true,
        stockQuantity: 28,
        rating: "4.5",
        reviewCount: 7890,
        brand: "adidas",
        features: "BOOST midsole, Primeknit upper, Continental rubber outsole, Energy return"
      },
      {
        name: "KitchenAid Stand Mixer 5-Quart",
        description: "Artisan Series stand mixer with 10 speeds and tilt-head design",
        price: "279.99",
        originalPrice: "379.99",
        discountPercentage: 26,
        image: "https://m.media-amazon.com/images/I/8144o9aDshL._AC_SL1500_.jpg",
        category: "Home & Kitchen",
        inStock: true,
        stockQuantity: 18,
        rating: "4.8",
        reviewCount: 56789,
        brand: "KitchenAid",
        features: "5-quart capacity, 10 speeds, Tilt-head design, Multiple attachments available"
      },
      {
        name: "YETI Rambler 20 oz Tumbler",
        description: "Stainless steel vacuum insulated tumbler that keeps drinks cold or hot",
        price: "34.99",
        originalPrice: "39.99",
        discountPercentage: 13,
        image: "https://m.media-amazon.com/images/I/71v8JhVpOjL._AC_SL1500_.jpg",
        category: "Sports & Outdoors",
        inStock: true,
        stockQuantity: 64,
        rating: "4.7",
        reviewCount: 23456,
        brand: "YETI",
        features: "Double-wall vacuum insulation, 18/8 stainless steel, Dishwasher safe, MagSlider lid"
      },
      {
        name: "Atomic Habits by James Clear",
        description: "Self-help book about building good habits and breaking bad ones through small changes",
        price: "11.98",
        originalPrice: "16.99",
        discountPercentage: 29,
        image: "https://m.media-amazon.com/images/I/81wgcld4wxL._SY522_.jpg",
        category: "Books & Media",
        inStock: true,
        stockQuantity: 156,
        rating: "4.7",
        reviewCount: 98765,
        brand: "Avery",
        features: "Bestselling self-help, Practical strategies, Hardcover edition, 320 pages"
      },
      {
        name: "Weber Original Kettle 22-Inch Charcoal Grill",
        description: "Classic charcoal grill with porcelain-enameled bowl and lid for even heat distribution",
        price: "109.99",
        originalPrice: "149.99",
        discountPercentage: 27,
        image: "https://m.media-amazon.com/images/I/81Y4H4AVCML._AC_SL1500_.jpg",
        category: "Home & Garden",
        inStock: true,
        stockQuantity: 15,
        rating: "4.6",
        reviewCount: 12345,
        brand: "Weber",
        features: "22-inch cooking grate, Porcelain-enameled bowl, One-Touch cleaning, Authentic charcoal flavor"
      },
      {
        name: "Olaplex No. 3 Hair Perfector",
        description: "At-home hair treatment that reduces breakage and strengthens damaged hair",
        price: "28.00",
        originalPrice: "36.00",
        discountPercentage: 22,
        image: "https://m.media-amazon.com/images/I/61vJqtBjMDL._SL1500_.jpg",
        category: "Beauty & Personal Care",
        inStock: true,
        stockQuantity: 73,
        rating: "4.4",
        reviewCount: 67890,
        brand: "Olaplex",
        features: "Patented formula, Reduces breakage, Strengthens hair, Suitable for all hair types"
      }
    ];
    for (const product of productsList) {
      await this.createProduct(product);
    }
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return void 0;
  }
  async getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return void 0;
  }
  async createUser(insertUser) {
    const user = {
      id: this.currentUserId++,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      role: insertUser.role || "user"
    };
    this.users.set(user.id, user);
    return user;
  }
  async getProducts() {
    return Array.from(this.products.values());
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async searchProducts(query) {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => product.name.toLowerCase().includes(lowercaseQuery) || product.description.toLowerCase().includes(lowercaseQuery) || product.category.toLowerCase().includes(lowercaseQuery) || product.brand && product.brand.toLowerCase().includes(lowercaseQuery)
    );
  }
  async getProductsByCategory(category) {
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }
  async createProduct(insertProduct) {
    const now = /* @__PURE__ */ new Date();
    const product = {
      id: this.currentProductId++,
      name: insertProduct.name,
      description: insertProduct.description,
      price: insertProduct.price,
      originalPrice: insertProduct.originalPrice || null,
      discountPercentage: insertProduct.discountPercentage || 0,
      image: insertProduct.image,
      category: insertProduct.category,
      inStock: insertProduct.inStock,
      stockQuantity: insertProduct.stockQuantity || 0,
      rating: insertProduct.rating || "0.0",
      reviewCount: insertProduct.reviewCount || 0,
      brand: insertProduct.brand || null,
      features: insertProduct.features || null,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(product.id, product);
    return product;
  }
  async updateProduct(id, updateData) {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updatedProduct = {
      ...existingProduct,
      ...updateData,
      id: existingProduct.id,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    return this.products.delete(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user")
  // "user" or "admin"
});
var products = pgTable("products", {
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
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true
}).extend({
  role: z.string().default("user")
});
var insertProductSchema = createInsertSchema(products).pick({
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
  features: true
}).extend({
  inStock: z.boolean().default(true),
  stockQuantity: z.number().default(0),
  rating: z.string().default("0.0"),
  reviewCount: z.number().default(0),
  discountPercentage: z.number().default(0)
});
var loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional()
});

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, role } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      if (role && user.role !== role) {
        return res.status(403).json({ error: "Access denied for this role" });
      }
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token: `mock-token-${user.id}`
        // Mock token for demo
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists with this email" });
      }
      const newUser = await storage.createUser({
        ...userData,
        role: userData.role || "user"
        // Default to user role
      });
      res.json({
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        token: `mock-token-${newUser.id}`
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });
  app2.get("/api/auth/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.replace("Bearer ", "");
    const userId = parseInt(token.replace("mock-token-", ""));
    storage.getUser(userId).then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const { search, category } = req.query;
      let products2;
      if (search && typeof search === "string") {
        products2 = await storage.searchProducts(search);
      } else if (category && typeof category === "string") {
        products2 = await storage.getProductsByCategory(category);
      } else {
        products2 = await storage.getProducts();
      }
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 3e3;
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
var index_default = app;
export {
  index_default as default
};
