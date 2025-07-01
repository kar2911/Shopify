import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { storage } from "@/lib/storage";
import { Search, ShoppingCart, Star, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Product, User as UserType } from "@shared/schema";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState<UserType | null>(null);
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    "All",
    "Electronics", 
    "Fashion", 
    "Home & Kitchen", 
    "Sports & Outdoors", 
    "Books & Media", 
    "Home & Garden", 
    "Beauty & Personal Care",
    "Automotive",
    "Pet Supplies",
    "Toys & Games"
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const products = searchQuery 
      ? storage.searchProducts(searchQuery)
      : storage.getProducts();
    setAllProducts(products);
    setIsLoading(false);
  }, [searchQuery]);

  // Filter products by category
  const products = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  const handleLogout = () => {
    storage.logout();
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    setLocation("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle the search when searchQuery changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold tracking-widest text-black">
                SHOPIFY
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-900">
                    Welcome, {user.username}
                  </span>
                  {user.role === 'admin' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLocation("/admin")}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Admin Panel
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-sm text-gray-900 hover:text-gray-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation("/login")}
                    className="text-sm text-gray-900 hover:text-gray-600"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation("/login")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm">
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="space-y-4">
                <div className="mb-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {user ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Welcome, {user.username}</p>
                    {user.role === 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation("/admin")}
                        className="w-full justify-start text-blue-600"
                      >
                        Admin Panel
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLocation("/login")}
                      className="w-full justify-start"
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation("/login")}
                      className="w-full justify-start"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-gray-200 focus:border-gray-900 focus:ring-gray-900"
              />
            </form>
          </div>
        </div>

        {/* Category Pills for Mobile */}
        <div className="mb-6 md:hidden">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 text-sm mb-2 sm:mb-0">
              {searchQuery ? (
                <>Showing results for "{searchQuery}" ({products.length} products)</>
              ) : (
                <>
                  {selectedCategory === "All" ? "All Products" : selectedCategory} 
                  ({products.length} items)
                </>
              )}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-sm"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-48 w-full"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No products match "${searchQuery}"`
                : `No products found in ${selectedCategory}`
              }
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              View all products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
                <div 
                  className="relative"
                  onClick={() => setLocation(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                      -{product.discountPercentage}% OFF
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-white text-black">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div onClick={() => setLocation(`/product/${product.id}`)}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && product.discountPercentage && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.rating && product.reviewCount && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-sm text-gray-600">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.reviewCount.toLocaleString()})</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      disabled={!product.inStock}
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          toast({
                            title: "Sign in required",
                            description: "Please sign in to add items to your cart",
                          });
                          setLocation("/login");
                        } else {
                          toast({
                            title: "Added to cart",
                            description: `${product.name} has been added to your cart`,
                          });
                        }
                      }}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}