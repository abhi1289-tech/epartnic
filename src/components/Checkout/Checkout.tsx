import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Truck, Package, Plus } from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { PaymentService } from '../../services/PaymentService';
import { RazorpayService } from '../../services/RazorpayService';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Address, PaymentInfo, Order } from '../../types';
import { formatINR } from '../../utils/currency';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Toast from '../UI/Toast';

const Checkout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mock' | 'razorpay' | 'cod'>('mock');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryCharge = totalAmount >= 1000 ? 0 : 99;
  const finalTotal = totalAmount + deliveryCharge;

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const loadAddresses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userAddresses = await FirestoreService.getAddresses(user.uid);
      setAddresses(userAddresses);
      
      // Auto-select default address
      const defaultAddress = userAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setToast({ type: 'error', message: 'Failed to load addresses' });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedAddress) {
        setToast({ type: 'error', message: 'Please select a delivery address' });
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedAddress) return;

    setProcessing(true);
    try {
      let paymentResult: PaymentInfo;

      if (paymentMethod === 'mock') {
        const paymentIntent = await PaymentService.createPaymentIntent(finalTotal);
        paymentResult = await PaymentService.confirmPayment(paymentIntent.txnId!);
      } else if (paymentMethod === 'razorpay' && RazorpayService.isEnabled()) {
        const order = await RazorpayService.createOrder(finalTotal);
        paymentResult = await RazorpayService.processPayment(order, {
          name: user.displayName || user.email,
          email: user.email,
          contact: selectedAddress.phone,
        });
      } else {
        // Cash on Delivery
        paymentResult = {
          provider: 'cod',
          status: 'created',
          txnId: `COD-${Date.now()}`,
          amount: finalTotal,
        };
      }

      // Create order
      const orderData: Omit<Order, 'id' | 'createdAt'> = {
        userId: user.uid,
        items: items,
        subtotal: totalAmount,
        delivery: deliveryCharge,
        total: finalTotal,
        address: selectedAddress,
        status: paymentResult.status === 'success' ? 'paid' : 'pending',
        payment: paymentResult,
      };

      const orderId = await FirestoreService.createOrder(orderData);

      if (paymentResult.status === 'success' || paymentMethod === 'cod') {
        clearCart();
        navigate(`/payment/success?orderId=${orderId}`);
      } else {
        navigate(`/payment/failure?orderId=${orderId}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setToast({ type: 'error', message: 'Failed to place order. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Delivery', icon: Truck },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: Package },
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
      {toast && (
        <Toast
          type={toast.type as any}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep">Secure Checkout</h1>
          <p className="text-gray-600 mt-1">Complete your order in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-deep">Select Delivery Address</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/addresses/new')}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add New
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No addresses found. Please add a delivery address.</p>
                    <Button onClick={() => navigate('/addresses/new')}>
                      Add New Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                          selectedAddress?.id === address.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress?.id === address.id}
                          onChange={() => setSelectedAddress(address)}
                          className="sr-only"
                        />
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="font-semibold text-deep">{address.fullName}</h3>
                              {address.isDefault && (
                                <span className="ml-2 bg-primary text-white px-2 py-1 rounded-full text-xs">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                            <p className="text-gray-700">
                              {address.line1}{address.line2 && `, ${address.line2}`}
                            </p>
                            <p className="text-gray-700">
                              {address.city}, {address.state} {address.pincode}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-deep mb-6">Select Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Mock Payment */}
                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    paymentMethod === 'mock'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="mock"
                      checked={paymentMethod === 'mock'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-deep">Mock Payment (Development)</h3>
                        <p className="text-sm text-gray-600">Test payment for development purposes</p>
                      </div>
                      <div className="text-green-600 font-medium">Recommended for Testing</div>
                    </div>
                  </label>

                  {/* Razorpay */}
                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    paymentMethod === 'razorpay'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!RazorpayService.isEnabled() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      disabled={!RazorpayService.isEnabled()}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-deep">Credit/Debit Card, UPI, Net Banking</h3>
                        <p className="text-sm text-gray-600">Secure payment powered by Razorpay</p>
                        {!RazorpayService.isEnabled() && (
                          <p className="text-xs text-red-600 mt-1">
                            Razorpay not configured. Add VITE_RAZORPAY_KEY_ID to enable.
                          </p>
                        )}
                      </div>
                      <div className="text-blue-600 font-medium">Secure</div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    paymentMethod === 'cod'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-deep">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay when you receive the order</p>
                      </div>
                      <div className="text-orange-600 font-medium">Available</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-deep mb-6">Review Your Order</h2>
                
                <div className="space-y-6">
                  {/* Delivery Address */}
                  <div>
                    <h3 className="font-semibold text-deep mb-2">Delivery Address</h3>
                    {selectedAddress && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium">{selectedAddress.fullName}</p>
                        <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                        <p className="text-gray-700 mt-1">
                          {selectedAddress.line1}{selectedAddress.line2 && `, ${selectedAddress.line2}`}
                        </p>
                        <p className="text-gray-700">
                          {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold text-deep mb-2">Payment Method</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">
                        {paymentMethod === 'mock' && 'Mock Payment (Development)'}
                        {paymentMethod === 'razorpay' && 'Credit/Debit Card, UPI, Net Banking'}
                        {paymentMethod === 'cod' && 'Cash on Delivery'}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-deep mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-deep">{item.name}</h4>
                            <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                          </div>
                          <div className="text-lg font-semibold text-primary">
                            {formatINR(item.price * item.qty)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={handleNextStep}>
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  loading={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {paymentMethod === 'cod' ? 'Place Order' : 'Pay & Place Order'}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-deep mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({items.length})</span>
                  <span className="font-semibold">{formatINR(totalAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">
                    {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-deep">Total</span>
                  <span className="font-bold text-primary text-xl">
                    {formatINR(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Secure & encrypted checkout
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    7-day easy returns
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    24/7 customer support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;