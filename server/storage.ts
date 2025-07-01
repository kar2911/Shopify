import { users, products, type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<boolean>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private currentUserId: number;
  private currentProductId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.initializeData();
  }

  private async initializeData() {
    // Initialize users
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
      },
    ];

    for (const user of usersList) {
      await this.createUser(user);
    }

    // Initialize comprehensive product catalog with proper images
    const productsList = [
      // Electronics Category
      {
        name: "Apple iPhone 15 Pro Max",
        description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system with 5x telephoto zoom",
        price: "1199.99",
        originalPrice: "1299.99",
        discountPercentage: 8,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
        category: "Electronics",
        inStock: true,
        stockQuantity: 25,
        rating: "4.8",
        reviewCount: 15420,
        brand: "Apple",
        features: "A17 Pro chip, Titanium design, 5x telephoto zoom, Action Button, USB-C",
      },
      {
        name: "Samsung 65\" 4K QLED Smart TV",
        description: "Quantum Dot technology with 4K resolution, HDR10+ support, and built-in streaming apps",
        price: "899.99",
        originalPrice: "1199.99",
        discountPercentage: 25,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop",
        category: "Electronics",
        inStock: true,
        stockQuantity: 15,
        rating: "4.6",
        reviewCount: 8934,
        brand: "Samsung",
        features: "QLED display, 4K resolution, HDR10+, Smart TV, Voice control",
      },
      {
        name: "Sony WH-1000XM5 Wireless Headphones",
        description: "Industry-leading noise canceling with exceptional sound quality and 30-hour battery life",
        price: "349.99",
        originalPrice: "399.99",
        discountPercentage: 13,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
        category: "Electronics",
        inStock: true,
        stockQuantity: 45,
        rating: "4.7",
        reviewCount: 12567,
        brand: "Sony",
        features: "Active noise canceling, 30-hour battery, Quick charge, Multipoint connection",
      },
      {
        name: "MacBook Air M3 13-inch",
        description: "Supercharged by the M3 chip with 18-hour battery life and stunning Liquid Retina display",
        price: "1099.99",
        originalPrice: "1199.99",
        discountPercentage: 8,
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop",
        category: "Electronics",
        inStock: true,
        stockQuantity: 12,
        rating: "4.9",
        reviewCount: 9876,
        brand: "Apple",
        features: "M3 chip, 18-hour battery, Liquid Retina display, 8GB unified memory",
      },
      {
        name: "Canon EOS R6 Mark II Camera",
        description: "Full-frame mirrorless camera with 24.2MP sensor and advanced autofocus system",
        price: "2499.99",
        originalPrice: "2799.99",
        discountPercentage: 11,
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop",
        category: "Electronics",
        inStock: true,
        stockQuantity: 8,
        rating: "4.8",
        reviewCount: 3456,
        brand: "Canon",
        features: "24.2MP full-frame sensor, 4K video, In-body stabilization, Dual Pixel autofocus",
      },

      // Fashion Category
      {
        name: "Nike Air Force 1 '07 Sneakers",
        description: "Classic basketball shoe with leather upper and Air-Sole unit for lightweight cushioning",
        price: "89.99",
        originalPrice: "110.00",
        discountPercentage: 18,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
        category: "Fashion",
        inStock: true,
        stockQuantity: 67,
        rating: "4.5",
        reviewCount: 23456,
        brand: "Nike",
        features: "Leather upper, Air-Sole cushioning, Rubber outsole, Classic design",
      },
      {
        name: "Levi's Women's 501 Original Jeans",
        description: "The original blue jean with a straight leg and button fly, made from premium cotton denim",
        price: "59.99",
        originalPrice: "79.99",
        discountPercentage: 25,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop",
        category: "Fashion",
        inStock: true,
        stockQuantity: 89,
        rating: "4.4",
        reviewCount: 18765,
        brand: "Levi's",
        features: "100% cotton denim, Straight leg, Button fly, Classic 5-pocket styling",
      },
      {
        name: "Adidas Ultraboost 23 Running Shoes",
        description: "Energy-returning running shoes with Boost midsole and Primeknit upper for ultimate comfort",
        price: "179.99",
        originalPrice: "220.00",
        discountPercentage: 18,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
        category: "Fashion",
        inStock: true,
        stockQuantity: 34,
        rating: "4.6",
        reviewCount: 9876,
        brand: "Adidas",
        features: "Boost midsole, Primeknit upper, Continental rubber outsole, Energy return",
      },
      {
        name: "Ray-Ban Aviator Classic Sunglasses",
        description: "Iconic aviator sunglasses with crystal lenses and gold-tone metal frame",
        price: "154.99",
        originalPrice: "189.99",
        discountPercentage: 18,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
        category: "Fashion",
        inStock: true,
        stockQuantity: 56,
        rating: "4.7",
        reviewCount: 15432,
        brand: "Ray-Ban",
        features: "Crystal lenses, Gold-tone frame, UV protection, Classic aviator design",
      },
      {
        name: "Patagonia Better Sweater Fleece Jacket",
        description: "Cozy fleece jacket made from recycled polyester with a classic fit and full-zip design",
        price: "99.99",
        originalPrice: "129.99",
        discountPercentage: 23,
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
        category: "Fashion",
        inStock: true,
        stockQuantity: 42,
        rating: "4.5",
        reviewCount: 7890,
        brand: "Patagonia",
        features: "Recycled polyester, Full-zip design, Classic fit, Machine washable",
      },

      // Home & Kitchen Category
      {
        name: "Ninja Foodi Personal Blender",
        description: "Powerful personal blender with Auto-iQ technology and 18 oz. to-go cups",
        price: "79.99",
        originalPrice: "99.99",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=500&fit=crop",
        category: "Home & Kitchen",
        inStock: true,
        stockQuantity: 38,
        rating: "4.4",
        reviewCount: 12345,
        brand: "Ninja",
        features: "Auto-iQ technology, 18 oz. cups, BPA-free, Dishwasher safe",
      },
      {
        name: "Cuisinart 14-Cup Food Processor",
        description: "Large capacity food processor with stainless steel blades and multiple attachments",
        price: "199.99",
        originalPrice: "249.99",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
        category: "Home & Kitchen",
        inStock: true,
        stockQuantity: 22,
        rating: "4.6",
        reviewCount: 8765,
        brand: "Cuisinart",
        features: "14-cup capacity, Stainless steel blades, Multiple attachments, BPA-free",
      },
      {
        name: "All-Clad Stainless Steel Cookware Set",
        description: "Professional-grade 10-piece cookware set with tri-ply construction",
        price: "399.99",
        originalPrice: "599.99",
        discountPercentage: 33,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
        category: "Home & Kitchen",
        inStock: true,
        stockQuantity: 15,
        rating: "4.8",
        reviewCount: 5432,
        brand: "All-Clad",
        features: "Tri-ply construction, Stainless steel, Dishwasher safe, Oven safe to 600°F",
      },
      {
        name: "Dyson V15 Detect Cordless Vacuum",
        description: "Powerful cordless vacuum with laser dust detection and intelligent suction",
        price: "649.99",
        originalPrice: "749.99",
        discountPercentage: 13,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
        category: "Home & Kitchen",
        inStock: true,
        stockQuantity: 18,
        rating: "4.7",
        reviewCount: 9876,
        brand: "Dyson",
        features: "Laser dust detection, Intelligent suction, 60-minute runtime, HEPA filtration",
      },

      // Sports & Outdoors Category
      {
        name: "Hydro Flask 32 oz Water Bottle",
        description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours",
        price: "44.95",
        originalPrice: "54.95",
        discountPercentage: 18,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
        category: "Sports & Outdoors",
        inStock: true,
        stockQuantity: 78,
        rating: "4.6",
        reviewCount: 23456,
        brand: "Hydro Flask",
        features: "Double-wall insulation, BPA-free, Dishwasher safe, Lifetime warranty",
      },
      {
        name: "REI Co-op Trail 25 Backpack",
        description: "Versatile hiking backpack with 25-liter capacity and multiple pockets for organization",
        price: "89.99",
        originalPrice: "119.99",
        discountPercentage: 25,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        category: "Sports & Outdoors",
        inStock: true,
        stockQuantity: 34,
        rating: "4.5",
        reviewCount: 6789,
        brand: "REI Co-op",
        features: "25-liter capacity, Multiple pockets, Adjustable straps, Hydration compatible",
      },
      {
        name: "Wilson Pro Staff Tennis Racket",
        description: "Professional tennis racket with precision control and power for advanced players",
        price: "189.99",
        originalPrice: "229.99",
        discountPercentage: 17,
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
        category: "Sports & Outdoors",
        inStock: true,
        stockQuantity: 26,
        rating: "4.4",
        reviewCount: 3456,
        brand: "Wilson",
        features: "Professional grade, Precision control, Power frame, Advanced player design",
      },
      {
        name: "Fitbit Charge 6 Fitness Tracker",
        description: "Advanced fitness tracker with built-in GPS, heart rate monitoring, and 7-day battery life",
        price: "159.99",
        originalPrice: "199.99",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop",
        category: "Sports & Outdoors",
        inStock: true,
        stockQuantity: 45,
        rating: "4.3",
        reviewCount: 12345,
        brand: "Fitbit",
        features: "Built-in GPS, Heart rate monitoring, 7-day battery, Sleep tracking",
      },

      // Books & Media Category
      {
        name: "The Seven Husbands of Evelyn Hugo",
        description: "Captivating novel about a reclusive Hollywood icon who finally decides to tell her story",
        price: "13.99",
        originalPrice: "17.99",
        discountPercentage: 22,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
        category: "Books & Media",
        inStock: true,
        stockQuantity: 156,
        rating: "4.8",
        reviewCount: 89765,
        brand: "Atria Books",
        features: "Bestselling fiction, Paperback edition, 400 pages, Award-winning author",
      },
      {
        name: "Educated: A Memoir by Tara Westover",
        description: "Powerful memoir about education, family, and the struggle between loyalty and independence",
        price: "14.99",
        originalPrice: "18.99",
        discountPercentage: 21,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
        category: "Books & Media",
        inStock: true,
        stockQuantity: 98,
        rating: "4.7",
        reviewCount: 67890,
        brand: "Random House",
        features: "Memoir, Bestseller, 334 pages, Award-winning",
      },
      {
        name: "The Midnight Library by Matt Haig",
        description: "Thought-provoking novel about life's infinite possibilities and the choices we make",
        price: "12.99",
        originalPrice: "16.99",
        discountPercentage: 24,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
        category: "Books & Media",
        inStock: true,
        stockQuantity: 87,
        rating: "4.5",
        reviewCount: 45678,
        brand: "Viking",
        features: "Fiction, Bestseller, 288 pages, International bestseller",
      },
      {
        name: "Dune: Complete Series Box Set",
        description: "Complete collection of Frank Herbert's epic science fiction series in a beautiful box set",
        price: "89.99",
        originalPrice: "119.99",
        discountPercentage: 25,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
        category: "Books & Media",
        inStock: true,
        stockQuantity: 23,
        rating: "4.9",
        reviewCount: 12345,
        brand: "Ace Books",
        features: "Complete series, Box set, Science fiction classic, 6 books included",
      },

      // Home & Garden Category
      {
        name: "Monstera Deliciosa Indoor Plant",
        description: "Beautiful tropical houseplant with large, split leaves perfect for brightening any room",
        price: "29.99",
        originalPrice: "39.99",
        discountPercentage: 25,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop",
        category: "Home & Garden",
        inStock: true,
        stockQuantity: 45,
        rating: "4.6",
        reviewCount: 8765,
        brand: "Plant Paradise",
        features: "Low maintenance, Air purifying, Large decorative leaves, Pet-friendly",
      },
      {
        name: "Ceramic Planter Set with Drainage",
        description: "Set of 3 modern ceramic planters with drainage holes and saucers in neutral colors",
        price: "34.99",
        originalPrice: "49.99",
        discountPercentage: 30,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop",
        category: "Home & Garden",
        inStock: true,
        stockQuantity: 67,
        rating: "4.4",
        reviewCount: 5432,
        brand: "Garden Essentials",
        features: "Set of 3, Drainage holes, Saucers included, Modern design",
      },
      {
        name: "Solar String Lights 100 LED",
        description: "Waterproof solar-powered string lights perfect for outdoor decoration and ambiance",
        price: "24.99",
        originalPrice: "34.99",
        discountPercentage: 29,
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop",
        category: "Home & Garden",
        inStock: true,
        stockQuantity: 89,
        rating: "4.3",
        reviewCount: 9876,
        brand: "Bright Garden",
        features: "Solar powered, 100 LED lights, Waterproof, 8 lighting modes",
      },
      {
        name: "Raised Garden Bed Kit",
        description: "Easy-to-assemble raised garden bed kit made from cedar wood, perfect for vegetables and herbs",
        price: "129.99",
        originalPrice: "169.99",
        discountPercentage: 24,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop",
        category: "Home & Garden",
        inStock: true,
        stockQuantity: 18,
        rating: "4.7",
        reviewCount: 3456,
        brand: "Garden Pro",
        features: "Cedar wood construction, Easy assembly, 4x4 feet, Tool-free setup",
      },

      // Beauty & Personal Care Category
      {
        name: "The Ordinary Niacinamide 10% + Zinc 1%",
        description: "High-strength vitamin and mineral blemish formula for clearer, more balanced skin",
        price: "6.90",
        originalPrice: "8.90",
        discountPercentage: 22,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
        category: "Beauty & Personal Care",
        inStock: true,
        stockQuantity: 156,
        rating: "4.5",
        reviewCount: 34567,
        brand: "The Ordinary",
        features: "10% Niacinamide, 1% Zinc, Blemish formula, Vegan, Cruelty-free",
      },
      {
        name: "Fenty Beauty Gloss Bomb Universal Lip Luminizer",
        description: "Universal lip gloss that enhances your natural lip color with explosive shine",
        price: "19.00",
        originalPrice: "24.00",
        discountPercentage: 21,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop",
        category: "Beauty & Personal Care",
        inStock: true,
        stockQuantity: 78,
        rating: "4.6",
        reviewCount: 23456,
        brand: "Fenty Beauty",
        features: "Universal shade, High shine, Non-sticky formula, Peach-vanilla scent",
      },
      {
        name: "Drunk Elephant C-Firma Day Serum",
        description: "Potent vitamin C day serum that firms, brightens, and improves signs of photoaging",
        price: "78.00",
        originalPrice: "98.00",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&h=500&fit=crop",
        category: "Beauty & Personal Care",
        inStock: true,
        stockQuantity: 34,
        rating: "4.4",
        reviewCount: 12345,
        brand: "Drunk Elephant",
        features: "15% L-Ascorbic Acid, Antioxidant protection, Brightening, Anti-aging",
      },
      {
        name: "Glossier Cloud Paint Liquid Blush",
        description: "Seamless, buildable liquid blush that gives you a natural, dewy flush of color",
        price: "18.00",
        originalPrice: "22.00",
        discountPercentage: 18,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop",
        category: "Beauty & Personal Care",
        inStock: true,
        stockQuantity: 92,
        rating: "4.3",
        reviewCount: 18765,
        brand: "Glossier",
        features: "Liquid formula, Buildable coverage, Natural finish, Long-lasting",
      },

      // Automotive Category
      {
        name: "Garmin DriveSmart 65 GPS Navigator",
        description: "Advanced GPS navigator with 6.95-inch display, voice-activated navigation, and live traffic updates",
        price: "199.99",
        originalPrice: "249.99",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
        category: "Automotive",
        inStock: true,
        stockQuantity: 28,
        rating: "4.5",
        reviewCount: 6789,
        brand: "Garmin",
        features: "6.95-inch display, Voice activation, Live traffic, Bluetooth connectivity",
      },
      {
        name: "Chemical Guys Car Wash Kit",
        description: "Complete car washing kit with premium soap, microfiber towels, and detailing accessories",
        price: "79.99",
        originalPrice: "99.99",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=500&fit=crop",
        category: "Automotive",
        inStock: true,
        stockQuantity: 45,
        rating: "4.6",
        reviewCount: 9876,
        brand: "Chemical Guys",
        features: "Complete kit, Premium soap, Microfiber towels, Professional grade",
      },
      {
        name: "Anker Roav DashCam C1",
        description: "Compact dashboard camera with 1080p recording, night vision, and emergency recording",
        price: "89.99",
        originalPrice: "119.99",
        discountPercentage: 25,
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=500&fit=crop",
        category: "Automotive",
        inStock: true,
        stockQuantity: 36,
        rating: "4.4",
        reviewCount: 5432,
        brand: "Anker",
        features: "1080p recording, Night vision, Emergency recording, Compact design",
      },

      // Pet Supplies Category
      {
        name: "KONG Classic Dog Toy",
        description: "Durable rubber dog toy that can be stuffed with treats to keep dogs mentally stimulated",
        price: "12.99",
        originalPrice: "16.99",
        discountPercentage: 24,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop",
        category: "Pet Supplies",
        inStock: true,
        stockQuantity: 89,
        rating: "4.7",
        reviewCount: 23456,
        brand: "KONG",
        features: "Durable rubber, Treat dispensing, Mental stimulation, Vet recommended",
      },
      {
        name: "PetSafe Automatic Pet Feeder",
        description: "Programmable automatic pet feeder with portion control and battery backup",
        price: "149.99",
        originalPrice: "189.99",
        discountPercentage: 21,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop",
        category: "Pet Supplies",
        inStock: true,
        stockQuantity: 23,
        rating: "4.5",
        reviewCount: 8765,
        brand: "PetSafe",
        features: "Programmable, Portion control, Battery backup, Easy to clean",
      },
      {
        name: "Furminator deShedding Tool",
        description: "Professional grooming tool that reduces shedding by up to 90% for dogs and cats",
        price: "39.99",
        originalPrice: "49.99",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop",
        category: "Pet Supplies",
        inStock: true,
        stockQuantity: 67,
        rating: "4.6",
        reviewCount: 15432,
        brand: "FURminator",
        features: "Reduces shedding 90%, Professional grade, Ergonomic handle, Vet recommended",
      },

      // Toys & Games Category
      {
        name: "LEGO Creator 3-in-1 Deep Sea Creatures",
        description: "Build a shark, squid, or angler fish with this creative 3-in-1 LEGO set",
        price: "15.99",
        originalPrice: "19.99",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop",
        category: "Toys & Games",
        inStock: true,
        stockQuantity: 78,
        rating: "4.8",
        reviewCount: 12345,
        brand: "LEGO",
        features: "3-in-1 build, 230 pieces, Ages 7+, Creative play",
      },
      {
        name: "Monopoly Classic Board Game",
        description: "The classic property trading game that brings families together for hours of fun",
        price: "19.99",
        originalPrice: "24.99",
        discountPercentage: 20,
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=500&fit=crop",
        category: "Toys & Games",
        inStock: true,
        stockQuantity: 56,
        rating: "4.5",
        reviewCount: 34567,
        brand: "Hasbro",
        features: "Classic gameplay, 2-8 players, Ages 8+, Family game night",
      },
      {
        name: "Rubik's Cube 3x3 Speed Cube",
        description: "The original 3x3 speed cube with improved turning and corner cutting for faster solving",
        price: "14.99",
        originalPrice: "18.99",
        discountPercentage: 21,
        image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop",
        category: "Toys & Games",
        inStock: true,
        stockQuantity: 94,
        rating: "4.4",
        reviewCount: 8765,
        brand: "Rubik's",
        features: "Speed cube, Improved turning, Corner cutting, Classic puzzle",
      },
    ];

    for (const product of productsList) {
      await this.createProduct(product);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      id: this.currentUserId++,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      role: insertUser.role || "user"
    };
    
    this.users.set(user.id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      (product.brand && product.brand.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const now = new Date();
    const product: Product = { 
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
      updatedAt: now,
    };
    
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...updateData,
      id: existingProduct.id,
      updatedAt: new Date(),
    };

    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
}

export const storage = new MemStorage();