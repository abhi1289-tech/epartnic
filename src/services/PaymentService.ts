import { PaymentInfo } from '../types';

export class PaymentService {
  static async createPaymentIntent(amount: number, currency: string = 'INR'): Promise<PaymentInfo> {
    try {
      // Mock payment service - always succeeds in development
      const mockPayment: PaymentInfo = {
        provider: 'mock',
        status: 'created',
        txnId: `MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return mockPayment;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Payment initialization failed');
    }
  }

  static async confirmPayment(txnId: string): Promise<PaymentInfo> {
    try {
      // Mock payment confirmation
      // In development, randomly succeed/fail for testing
      // In production, you would integrate with actual payment gateway
      
      const shouldSucceed = import.meta.env.DEV ? Math.random() > 0.2 : true; // 80% success rate in dev
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result: PaymentInfo = {
        provider: 'mock',
        status: shouldSucceed ? 'success' : 'failed',
        txnId,
      };

      return result;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw new Error('Payment confirmation failed');
    }
  }

  static async processRefund(txnId: string, amount: number): Promise<boolean> {
    try {
      // Mock refund processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Mock refund processed: ${amount} for transaction ${txnId}`);
      return true;
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  }
}