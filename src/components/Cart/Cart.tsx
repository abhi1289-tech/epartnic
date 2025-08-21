import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatINR } from '../../utils/currency';
import Button from '../UI/Button';
import EmptyState from '../UI/EmptyState';

const Cart: React.FC = () => {
  const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  const deliveryCharge = totalAmount >= 1000 ? 0 : 99;
  const finalTotal = totalAmount + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon="cart"
            title="Your cart is empty"
            description="Looks like you haven't added any parts to your cart yet. Start shopping to find the perfect parts for your vehicle."
            action={
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/vehicle">
                  <Button size="lg">Find Your Vehicle</Button>
                </Link>
                <Link to="/parts">
                  <Button variant="outline" size="lg">Browse All Parts</Button>
                </Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-deep">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-deep mb-6">Cart Items</h2>
                
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {/* Product Image */}
                      <Link to={`/parts/${item.productId}`} className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/parts/${item.productId}`}
                          className="text-lg font-semibold text-deep hover:text-primary transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                        {item.sku && (
                          <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xl font-bold text-primary">
                            {formatINR(item.price)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {item.maxQty} available
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-semibold min-w-[2rem] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.qty + 1)}
                          disabled={item.qty >= item.maxQty}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-deep mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">{formatINR(totalAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-semibold">
                    {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                  </span>
                </div>
                
                {deliveryCharge > 0 && (
                  <p className="text-sm text-green-600">
                    Add {formatINR(1000 - totalAmount)} more for FREE delivery
                  </p>
                )}
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-deep">Total</span>
                  <span className="font-bold text-primary text-xl">
                    {formatINR(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-3">
                {user ? (
                  <Link to="/checkout">
                    <Button size="lg" fullWidth className="flex items-center justify-center">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login">
                      <Button size="lg" fullWidth className="flex items-center justify-center">
                        Login to Checkout
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" size="lg" fullWidth>
                        Create Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-1 text-green-500" />
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link to="/parts">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;