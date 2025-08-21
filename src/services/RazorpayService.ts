// Razorpay Integration Service
// This is a placeholder implementation for Razorpay payment integration

import { PaymentInfo } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export class RazorpayService {
  private static readonly keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  static isEnabled(): boolean {
    return !!this.keyId && typeof window !== 'undefined';
  }

  static loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  static async createOrder(amount: number, currency: string = 'INR'): Promise<any> {
    try {
      // This would typically make a call to your backend to create a Razorpay order
      // For now, we'll return a mock order structure
      
      const order = {
        id: `order_${Date.now()}`,
        currency,
        amount: amount * 100, // Razorpay expects amount in paise
      };

      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  static async processPayment(
    orderData: any,
    userInfo: { name: string; email: string; contact: string }
  ): Promise<PaymentInfo> {
    try {
      if (!this.isEnabled()) {
        throw new Error('Razorpay is not enabled. Please check your configuration.');
      }

      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      return new Promise((resolve, reject) => {
        const options = {
          key: this.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Epartnic',
          description: 'Auto Parts Purchase',
          order_id: orderData.id,
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
            contact: userInfo.contact,
          },
          theme: {
            color: '#F28C28', // Primary brand color
          },
          handler: (response: any) => {
            const paymentInfo: PaymentInfo = {
              provider: 'razorpay',
              status: 'success',
              txnId: response.razorpay_payment_id,
              amount: orderData.amount / 100, // Convert back from paise
            };
            resolve(paymentInfo);
          },
          modal: {
            ondismiss: () => {
              const paymentInfo: PaymentInfo = {
                provider: 'razorpay',
                status: 'failed',
                txnId: orderData.id,
              };
              reject(new Error('Payment cancelled by user'));
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      });
    } catch (error) {
      console.error('Error processing Razorpay payment:', error);
      throw error;
    }
  }

  /*
  To switch from Mock to Razorpay payments:
  
  1. Set up Razorpay account and get API keys
  2. Add VITE_RAZORPAY_KEY_ID to your .env file
  3. In your checkout component, check if RazorpayService.isEnabled()
  4. If enabled, use RazorpayService.processPayment() instead of PaymentService.confirmPayment()
  
  Example usage in Checkout component:
  
  const handlePayment = async () => {
    try {
      if (RazorpayService.isEnabled()) {
        const order = await RazorpayService.createOrder(totalAmount);
        const result = await RazorpayService.processPayment(order, {
          name: user.displayName,
          email: user.email,
          contact: selectedAddress.phone,
        });
        // Handle successful payment
      } else {
        // Fall back to mock payment
        const result = await PaymentService.confirmPayment(paymentIntent.txnId);
        // Handle mock payment result
      }
    } catch (error) {
      // Handle payment error
    }
  };
  */
}