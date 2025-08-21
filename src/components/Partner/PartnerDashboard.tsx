import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';

const PartnerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'analytics'>('overview');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPartnerData();
    }
  }, [user]);

  const loadPartnerData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const inventory = await FirestoreService.getPartnerInventory(user.uid);
      setProducts(inventory);
    } catch (error) {
      console.error('Error loading partner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + (product.price * product.stock), 0),
    lowStock: products.filter(product => product.stock < 10).length,
    outOfStock: products.filter(product => product.stock === 0).length,
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: TrendingUp },
    { key: 'inventory', label: 'Inventory', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingCart },
    { key: 'analytics', label: 'Analytics', icon: DollarSign },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep">Partner Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.displayName || user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-deep">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-3xl font-bold text-deep">{formatINR(stats.totalValue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-deep">{stats.lowStock}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-3xl font-bold text-deep">{stats.outOfStock}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-deep">Business Overview</h2>
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </div>

                {products.length === 0 ? (
                  <EmptyState
                    icon="package"
                    title="No products yet"
                    description="Start by adding your first product to begin selling on Epartnic."
                    action={
                      <Button size="lg">
                        <Plus className="h-5 w-5 mr-2" />
                        Add Your First Product
                      </Button>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Products */}
                    <div>
                      <h3 className="text-lg font-semibold text-deep mb-4">Recent Products</h3>
                      <div className="space-y-3">
                        {products.slice(0, 5).map((product) => (
                          <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={product.images[0] || 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=100'}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-deep truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                            </div>
                            <div className="text-sm font-semibold text-primary">
                              {formatINR(product.price)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-lg font-semibold text-deep mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <Button variant="outline" fullWidth className="justify-start">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Product
                        </Button>
                        <Button variant="outline" fullWidth className="justify-start">
                          <Package className="h-4 w-4 mr-2" />
                          Update Inventory
                        </Button>
                        <Button variant="outline" fullWidth className="justify-start">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Analytics
                        </Button>
                        <Button variant="outline" fullWidth className="justify-start">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Manage Orders
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-deep">Inventory Management</h2>
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                {products.length === 0 ? (
                  <EmptyState
                    icon="package"
                    title="No inventory items"
                    description="Add products to your inventory to start selling."
                    action={
                      <Button size="lg">
                        <Plus className="h-5 w-5 mr-2" />
                        Add Product
                      </Button>
                    }
                  />
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              SKU
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
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    src={product.images[0] || 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=100'}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded-lg mr-3"
                                  />
                                  <div>
                                    <div className="text-sm font-medium text-deep">{product.name}</div>
                                    <div className="text-sm text-gray-500">{product.brand}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.sku}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                {formatINR(product.price)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.stock}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  variant={
                                    product.stock === 0 
                                      ? 'danger' 
                                      : product.stock < 10 
                                        ? 'warning' 
                                        : 'success'
                                  }
                                  size="sm"
                                >
                                  {product.stock === 0 
                                    ? 'Out of Stock' 
                                    : product.stock < 10 
                                      ? 'Low Stock' 
                                      : 'In Stock'
                                  }
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-deep">Order Management</h2>
                <EmptyState
                  icon="cart"
                  title="No orders yet"
                  description="Orders for your products will appear here once customers start purchasing."
                />
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-deep">Sales Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-deep mb-2">Total Sales</h3>
                    <p className="text-3xl font-bold text-primary">₹0</p>
                    <p className="text-sm text-gray-600 mt-1">This month</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-deep mb-2">Orders</h3>
                    <p className="text-3xl font-bold text-primary">0</p>
                    <p className="text-sm text-gray-600 mt-1">This month</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-deep mb-2">Avg. Order Value</h3>
                    <p className="text-3xl font-bold text-primary">₹0</p>
                    <p className="text-sm text-gray-600 mt-1">This month</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;