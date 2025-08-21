import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Receipt, Home } from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { Order } from '../../types';
import { formatINR } from '../../utils/currency';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      const orderData = await FirestoreService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-deep mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>
        </div>

        {order && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            {/* Order Header */}
            <div className="bg-green-50 border-b border-green-200 px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-deep mb-2">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-gray-600">
                    Placed on {order.createdAt.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-3xl font-bold text-green-600">
                    {formatINR(order.total)}
                  </div>
                  <p className="text-sm text-gray-600 text-right">Total Amount</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Details */}
                <div>
                  <h3 className="text-lg font-semibold text-deep mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-deep">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.qty} × {formatINR(item.price)}
                          </p>
                        </div>
                        <div className="text-lg font-semibold text-primary">
                          {formatINR(item.price * item.qty)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>{formatINR(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery</span>
                        <span>{order.delivery === 0 ? 'FREE' : formatINR(order.delivery)}</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">{formatINR(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery & Payment Info */}
                <div className="space-y-6">
                  {/* Delivery Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-deep mb-4 flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Delivery Address
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-deep">{order.address.fullName}</p>
                      <p className="text-sm text-gray-600 mb-2">{order.address.phone}</p>
                      <p className="text-gray-700">
                        {order.address.line1}
                        {order.address.line2 && `, ${order.address.line2}`}
                      </p>
                      <p className="text-gray-700">
                        {order.address.city}, {order.address.state} {order.address.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-deep mb-4 flex items-center">
                      <Receipt className="h-5 w-5 mr-2" />
                      Payment Information
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-medium">
                            {order.payment.provider === 'mock' && 'Mock Payment'}
                            {order.payment.provider === 'razorpay' && 'Razorpay'}
                            {order.payment.provider === 'cod' && 'Cash on Delivery'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID</span>
                          <span className="font-mono text-sm">{order.payment.txnId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className="font-medium text-green-600 capitalize">
                            {order.payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <h3 className="text-lg font-semibold text-deep mb-4">What's Next?</h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p>We'll send you an email confirmation with order details</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p>Your order will be processed and shipped within 1-2 business days</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p>You'll receive tracking information once your order ships</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p>Expected delivery: 3-5 business days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders">
            <Button size="lg" className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              View All Orders
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg" className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-200 text-center">
          <h3 className="text-xl font-semibold text-deep mb-4">Need Help?</h3>
          <p className="text-gray-700 mb-6">
            If you have any questions about your order, our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">Contact Support</Button>
            <Button variant="outline">Track Your Order</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;