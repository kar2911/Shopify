import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Product, User, InsertProduct } from "@shared/schema";
import { Plus, Edit2, Trash2, Users, Package, DollarSign, TrendingUp, LogOut } from "lucide-react";

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<InsertProduct>({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    inStock: true,
    stockQuantity: 0,
    rating: "4.5",
    reviewCount: 0,
    brand: "",
    features: "",
    originalPrice: null,
    discountPercentage: null
  });

  const categories = [
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
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        toast({
          title: "Access denied",
          description: "You need administrator privileges to access this page.",
          variant: "destructive",
        });
        setLocation("/dashboard");
        return;
      }
      setUser(parsedUser);
    } else {
      setLocation("/login");
      return;
    }

    // Load products
    setProducts(storage.getProducts());
  }, []);

  const handleLogout = () => {
    storage.logout();
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    setLocation("/login");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      inStock: true,
      stockQuantity: 0,
      rating: "4.5",
      reviewCount: 0,
      brand: "",
      features: "",
      originalPrice: null,
      discountPercentage: null
    });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      const updatedProduct = storage.updateProduct(editingProduct.id, formData);
      if (updatedProduct) {
        setProducts(storage.getProducts());
        toast({
          title: "Product updated",
          description: `${formData.name} has been updated successfully.`,
        });
      }
    } else {
      // Create new product
      const newProduct = storage.createProduct(formData);
      setProducts(storage.getProducts());
      toast({
        title: "Product added",
        description: `${newProduct.name} has been added successfully.`,
      });
    }
    
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || 0,
      rating: product.rating || "4.5",
      reviewCount: product.reviewCount || 0,
      brand: product.brand || "",
      features: product.features || "",
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = (productId: number, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      storage.deleteProduct(productId);
      setProducts(storage.getProducts());
      toast({
        title: "Product deleted",
        description: `${productName} has been deleted successfully.`,
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price), 0);
  const averageRating = products.reduce((sum, p) => sum + parseFloat(p.rating || "0"), 0) / totalProducts;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold tracking-widest text-black">
                SHOPIFY ADMIN
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-900">Admin: {user.username}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/dashboard")}
                className="text-sm text-gray-900 hover:text-gray-600"
              >
                View Store
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-sm text-gray-900 hover:text-gray-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{inStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gray-900 hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    placeholder="4.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewCount">Review Count</Label>
                  <Input
                    id="reviewCount"
                    type="number"
                    value={formData.reviewCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, reviewCount: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (for discounts)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value || null }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Discount Percentage</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: parseInt(e.target.value) || null }))}
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                    rows={3}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="features">Features (optional)</Label>
                  <Textarea
                    id="features"
                    value={formData.features || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                    placeholder="List key features..."
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2 flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="mr-2"
                    />
                    In Stock
                  </label>
                </div>

                <div className="md:col-span-2 flex space-x-4">
                  <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products ({totalProducts} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={product.image}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price}
                        {product.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            ${product.originalPrice}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stockQuantity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                          className={product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(product.id, product.name)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}