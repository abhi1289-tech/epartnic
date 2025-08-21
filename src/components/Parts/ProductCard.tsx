import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product, CartItem } from '../../types';
import { formatINR } from '../../utils/currency';
import { useCart } from '../../contexts/CartContext';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=400',
      qty: 1,
      maxQty: product.stock,
      sku: product.sku,
    };

    addItem(cartItem);
  };

  const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
  const stockBadgeVariant = stockStatus === 'in-stock' ? 'success' : stockStatus === 'low-stock' ? 'warning' : 'danger';
  const stockText = stockStatus === 'in-stock' ? 'In Stock' : stockStatus === 'low-stock' ? 'Low Stock' : 'Out of Stock';

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 group ${className}`}>
      <Link to={`/parts/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-w-16 aspect-h-12 bg-gray-100">
          <img
            src={product.images[0] || 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="primary" size="sm">
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant={stockBadgeVariant} size="sm">
              {stockText}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand and Category */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              {product.brand}
            </span>
            <span className="text-xs text-gray-500">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-deep mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>

          {/* Vehicle Compatibility */}
          <p className="text-sm text-gray-600 mb-3">
            Fits: {product.vehicle.make} {product.vehicle.model} ({product.vehicle.year})
          </p>

          {/* SKU */}
          <p className="text-xs text-gray-500 mb-3">
            SKU: {product.sku}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">(4.5)</span>
          </div>

          {/* Price and Stock */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatINR(product.price)}
              </div>
              <div className="text-sm text-gray-500">
                Stock: {product.stock} units
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          fullWidth
          variant={product.stock === 0 ? 'outline' : 'primary'}
          className="flex items-center justify-center"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;