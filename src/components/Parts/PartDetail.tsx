import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { useCart } from '../../contexts/CartContext';
import { Product, CartItem } from '../../types';
import { formatINR } from '../../utils/currency';
import { scrollToTop } from '../../utils/scrollToTop';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import Toast from '../UI/Toast';

const PartDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    scrollToTop(false); // Scroll to top immediately when component mounts
  }, []);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const productData = await FirestoreService.getProductById(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=400',
      qty: quantity,
      maxQty: product.stock,
      sku: product.sku,
    };

    addItem(cartItem);
    setToast({ type: 'success', message: `Added ${quantity} item(s) to cart!` });
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const nextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/parts">
            <Button>Back to Parts</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
  const stockBadgeVariant = stockStatus === 'in-stock' ? 'success' : stockStatus === 'low-stock' ? 'warning' : 'danger';
  const stockText = stockStatus === 'in-stock' ? 'In Stock' : stockStatus === 'low-stock' ? 'Low Stock' : 'Out of Stock';

  return (
    <div className="min-h-screen bg-bg py-8">
      {toast && (
        <Toast
          type={toast.type as any}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/parts" className="hover:text-primary">Parts</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
              <img
                src={product.images[selectedImage] || 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors duration-200"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors duration-200"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === selectedImage ? 'bg-primary' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative bg-white rounded-lg border-2 overflow-hidden transition-colors duration-200 ${
                      index === selectedImage ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="primary" size="sm" className="mb-2">
                  {product.brand}
                </Badge>
                <h1 className="text-3xl font-bold text-deep mb-2">{product.name}</h1>
                <p className="text-gray-600">SKU: {product.sku}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-primary transition-colors duration-200">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">(4.5 out of 5)</span>
              <span className="ml-2 text-sm text-gray-500">• 128 reviews</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {formatINR(product.price)}
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={stockBadgeVariant} size="sm">
                  {stockText}
                </Badge>
                <span className="text-sm text-gray-600">
                  {product.stock} units available
                </span>
              </div>
            </div>

            {/* Vehicle Compatibility */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-deep mb-2">Compatible Vehicle</h3>
              <p className="text-gray-700">
                {product.vehicle.make} {product.vehicle.model} ({product.vehicle.year})
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                size="lg"
                fullWidth
                className="flex items-center justify-center text-lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
              </Button>
            </div>

            {/* Service Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Free Delivery</div>
                  <div className="text-xs text-gray-500">Orders above ₹1000</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Warranty</div>
                  <div className="text-xs text-gray-500">6 months</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <RotateCcw className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Returns</div>
                  <div className="text-xs text-gray-500">7 days return</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-deep">Product Details</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-deep mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description || 'High-quality auto part designed for optimal performance and durability. Manufactured to meet OEM specifications and backed by comprehensive warranty coverage.'}
                </p>

                <h3 className="font-semibold text-deep mb-4">Key Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Premium quality materials and construction
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Direct fit replacement for OEM part
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Rigorous quality control testing
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    6-month manufacturer warranty
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-deep mb-4">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="text-gray-900">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="text-gray-900">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compatible Vehicle:</span>
                    <span className="text-gray-900">
                      {product.vehicle.make} {product.vehicle.model} ({product.vehicle.year})
                    </span>
                  </div>
                  {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetail;