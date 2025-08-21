import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  Download,
  MessageCircle,
  Star,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { Order, OrderStatus } from '../../types';
import { formatINR } from '../../utils/currency';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import LoadingSpinner from '../UI/LoadingSpinner';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const orderData = await FirestoreService.getOrderById(id);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'paid':
        return <CheckCircle className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <Package className="h-5 w-5" />;
      case 'canceled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusVariant = (status: OrderStatus): 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
      case 'paid':
        return 'info';
      case 'pending':
        return 'warning';
      case 'canceled':
        return 'danger';
      default:
        return 'info';
    }
  };

  const orderTimeline = [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'paid', label: 'Payment Confirmed', completed: order?.status !== 'pending' },
    { status: 'shipped', label: 'Order Shipped', completed: ['shipped', 'delivered'].includes(order?.status || '') },
    { status: 'delivered', label: 'Delivered', completed: order?.status === 'delivered' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/orders"
            className="flex items-center text-gray-600 hover:text-primary mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-deep">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {order.createdAt.toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Badge 
                variant={getStatusVariant(order.status)}
                size="lg"
                className="flex items-center"
              >
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </Badge>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {formatINR(order.total)}
                </div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-deep mb-6">Order Status</h2>
              
              <div className="relative">
                {orderTimeline.map((step, index) => (
                  <div key={step.status} className="flex items-center mb-6 last:mb-0">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className={`font-medium ${step.completed ? 'text-deep' : 'text-gray-500'}`}>
                        {step.label}
                      </div>
                      {step.completed && (
                        <div className="text-sm text-gray-600">
                          {step.status === 'pending' && order.createdAt.toLocaleDateString()}
                          {step.status === 'paid' && 'Payment processed successfully'}
                          {step.status === 'shipped' && 'Your order is on the way'}
                          {step.status === 'delivered' && 'Order delivered successfully'}
                        </div>
                      )}
                    </div>
                    
                    {index < orderTimeline.length - 1 && (
                      <div className={`absolute left-5 w-0.5 h-6 mt-10 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`} style={{ top: `${index * 6 + 2.5}rem` }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-deep mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <Link to={`/parts/${item.productId}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>
                    
                    <div className="flex-1">
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
                        <span className="text-gray-600">
                          Quantity: {item.qty} × {formatINR(item.price)}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {formatINR(item.price * item.qty)}
                        </span>
                      </div>
                    </div>

                    {/* Item Actions */}
                    <div className="flex flex-col space-y-2">
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Buy Again
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatINR(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charges</span>
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-deep mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Delivery Address
              </h3>
              
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">{order.address.fullName}</p>
                <p className="text-sm text-gray-600">{order.address.phone}</p>
                <p>{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                <p>{order.address.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-deep mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
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
                  <Badge variant={order.payment.status === 'success' ? 'success' : 'warning'} size="sm">
                    {order.payment.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-deep mb-4">Order Actions</h3>
              
              <div className="space-y-3">
                <Button variant="outline" fullWidth className="flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                
                <Button variant="outline" fullWidth className="flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                
                {order.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
                
                {order.status === 'delivered' && (
                  <Button variant="outline" fullWidth>
                    Return/Exchange
                  </Button>
                )}
              </div>
            </div>

            {/* Help */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-semibold text-deep mb-2">Need Help?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Our customer support team is available 24/7 to help you with any questions.
              </p>
              <Button variant="outline" size="sm" fullWidth>
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;