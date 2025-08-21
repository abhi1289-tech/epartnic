import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { useAuth } from '../../contexts/AuthContext';
import { Order, OrderStatus } from '../../types';
import { formatINR } from '../../utils/currency';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userOrders = await FirestoreService.getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'canceled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    canceled: orders.filter(o => o.status === 'canceled').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep">My Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon="package"
            title="No orders yet"
            description="You haven't placed any orders yet. Start shopping to see your orders here."
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
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Orders' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'paid', label: 'Paid' },
                  { key: 'shipped', label: 'Shipped' },
                  { key: 'delivered', label: 'Delivered' },
                  { key: 'canceled', label: 'Canceled' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      filter === tab.key
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                    {statusCounts[tab.key as keyof typeof statusCounts] > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        filter === tab.key
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {statusCounts[tab.key as keyof typeof statusCounts]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-deep">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Placed on {order.createdAt.toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge 
                          variant={getStatusVariant(order.status)}
                          className="flex items-center"
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {formatINR(order.total)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <Link to={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.productId} className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-deep truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.qty} × {formatINR(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                          +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    {/* Delivery Address */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-start space-x-2">
                        <Truck className="h-4 w-4 text-gray-400 mt-1" />
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Delivering to:</span> {order.address.fullName}, {order.address.city}, {order.address.state} {order.address.pincode}
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      </Link>
                      
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Write Review
                        </Button>
                      )}
                      
                      {order.status === 'pending' && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Cancel Order
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {filteredOrders.length >= 10 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Orders
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;