import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home, HelpCircle } from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { Order } from '../../types';
import { formatINR } from '../../utils/currency';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

const PaymentFailure: React.FC = () => {
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
        {/* Failure Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-deep mb-4">Payment Failed</h1>
          <p className="text-xl text-gray-600">
            We couldn't process your payment. Don't worry, your order is saved and you can try again.
          </p>
        </div>

        {order && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            {/* Order Header */}
            <div className="bg-red-50 border-b border-red-200 px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-deep mb-2">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-gray-600">
                    Created on {order.createdAt.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-3xl font-bold text-red-600">
                    {formatINR(order.total)}
                  </div>
                  <p className="text-sm text-gray-600 text-right">Payment Pending</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Failure Reasons */}
              <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-deep mb-4">Common reasons for payment failure:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Insufficient funds in your account
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Incorrect card details or expired card
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Network connectivity issues
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Bank declined the transaction
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Daily transaction limit exceeded
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-deep mb-4">Order Summary</h3>
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

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-deep mb-4">Payment Details</h3>
                  <div className="p-4 bg-gray-50 rounded-lg mb-6">
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
                        <span className="font-medium text-red-600 capitalize">
                          {order.payment.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* What to do next */}
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-deep mb-3">What you can do:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">1.</span>
                        Check your account balance and try again
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">2.</span>
                        Verify your card details are correct
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">3.</span>
                        Try a different payment method
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">4.</span>
                        Contact your bank if the issue persists
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/checkout">
            <Button size="lg" className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Retry Payment
            </Button>
          </Link>
          <Link to="/orders">
            <Button variant="outline" size="lg">
              View Orders
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="lg" className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-deep mb-4">Need Help?</h3>
          <p className="text-gray-700 mb-6">
            If you continue to experience payment issues, our support team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">Contact Support</Button>
            <Button variant="outline">Live Chat</Button>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Support available 24/7 • Response within 2 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;