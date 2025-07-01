// Frontend-only storage using localStorage
import { User, Product, InsertUser, InsertProduct } from "@shared/schema";

// Initialize default data
const defaultUsers = [
  {
    id: 1,
    username: "customer",
    email: "customer@example.com", 
    password: "password123",
    role: "user" as const
  },
  {
    id: 2,
    username: "admin",
    email: "admin@example.com",
    password: "admin123", 
    role: "admin" as const
  }
];

const defaultProducts = [
  {
    id: 1,
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
    features: "Active Noise Cancellation, Spatial Audio, MagSafe Charging, Sweat and Water Resistant",
  },
  {
    id: 2,
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
    features: "Slim fit, stretch denim, classic five-pocket styling, machine washable",
  },
  {
    id: 3,
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    description: "7-in-1 functionality: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, warmer",
    price: "79.99",
    originalPrice: "119.99", 
    discountPercentage: 33,
    image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=500&h=500&fit=crop",
    category: "Home & Kitchen",
    inStock: true,
    stockQuantity: 30,
    rating: "4.6",
    reviewCount: 45678,
    brand: "Instant Pot",
    features: "7-in-1 functionality, 6-quart capacity, dishwasher safe, stainless steel inner pot",
  },
  {
    id: 4,
    name: "Nike Air Max 270 Running Shoes",
    description: "Men's running shoes with visible Air Max unit in the heel for maximum comfort and style",
    price: "89.99",
    originalPrice: "130.00",
    discountPercentage: 31,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "Sports & Outdoors",
    inStock: true,
    stockQuantity: 85,
    rating: "4.5",
    reviewCount: 23456,
    brand: "Nike",
    features: "Air Max technology, mesh upper, rubber outsole, cushioned midsole",
  },
  {
    id: 5,
    name: "The Silent Patient by Alex Michaelides",
    description: "Bestselling psychological thriller novel about a woman's act of violence and a psychotherapist obsessed with treating her",
    price: "12.99",
    originalPrice: "16.99",
    discountPercentage: 24,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
    category: "Books & Media",
    inStock: true,
    stockQuantity: 120,
    rating: "4.4",
    reviewCount: 18765,
    brand: "Celadon Books",
    features: "Paperback, 336 pages, psychological thriller, bestseller",
  }
];

// Storage interface
export class FrontendStorage {
  private static USERS_KEY = "shopify_users";
  private static PRODUCTS_KEY = "shopify_products";
  private static CURRENT_USER_ID = "shopify_current_user_id";

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize users if not exists
    if (!localStorage.getItem(FrontendStorage.USERS_KEY)) {
      localStorage.setItem(FrontendStorage.USERS_KEY, JSON.stringify(defaultUsers));
    }
    
    // Initialize products if not exists
    if (!localStorage.getItem(FrontendStorage.PRODUCTS_KEY)) {
      localStorage.setItem(FrontendStorage.PRODUCTS_KEY, JSON.stringify(defaultProducts));
    }
  }

  // User methods
  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(FrontendStorage.USERS_KEY) || "[]");
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(FrontendStorage.USERS_KEY, JSON.stringify(users));
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }

  getUserById(id: number): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  createUser(userData: InsertUser): User {
    const users = this.getUsers();
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const newUser: User = {
      id: newId,
      ...userData,
      role: userData.role || "user"
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  // Product methods
  getProducts(): Product[] {
    return JSON.parse(localStorage.getItem(FrontendStorage.PRODUCTS_KEY) || "[]");
  }

  private saveProducts(products: Product[]) {
    localStorage.setItem(FrontendStorage.PRODUCTS_KEY, JSON.stringify(products));
  }

  getProduct(id: number): Product | undefined {
    const products = this.getProducts();
    return products.find(product => product.id === id);
  }

  searchProducts(query: string): Product[] {
    const products = this.getProducts();
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.brand?.toLowerCase().includes(lowercaseQuery)
    );
  }

  createProduct(productData: InsertProduct): Product {
    const products = this.getProducts();
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct: Product = {
      id: newId,
      ...productData,
      stockQuantity: productData.stockQuantity || 0,
      rating: productData.rating || "0",
      reviewCount: productData.reviewCount || 0,
      brand: productData.brand || null,
      features: productData.features || null,
      originalPrice: productData.originalPrice || null,
      discountPercentage: productData.discountPercentage || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  updateProduct(id: number, updates: Partial<InsertProduct>): Product | undefined {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    products[index] = { ...products[index], ...updates };
    this.saveProducts(products);
    return products[index];
  }

  deleteProduct(id: number): boolean {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    products.splice(index, 1);
    this.saveProducts(products);
    return true;
  }

  getProductsByCategory(category: string): Product[] {
    const products = this.getProducts();
    return products.filter(product => product.category === category);
  }

  // Authentication methods
  login(email: string, password: string, role?: string): { user: User; token: string } | null {
    const user = this.getUserByEmail(email);
    if (!user || user.password !== password) {
      return null;
    }
    
    if (role && user.role !== role) {
      return null;
    }

    const token = `frontend-token-${user.id}-${Date.now()}`;
    localStorage.setItem(FrontendStorage.CURRENT_USER_ID, user.id.toString());
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    
    return { user, token };
  }

  logout() {
    localStorage.removeItem(FrontendStorage.CURRENT_USER_ID);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  getCurrentUser(): User | null {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  }
}

export const storage = new FrontendStorage();