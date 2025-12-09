import { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { Cart } from '../product/Products.tsx';
import { CheckoutCart } from './CheckoutCart.tsx';
import { CheckoutShipping } from './CheckoutShipping.tsx';
import { CheckoutPayment } from './CheckoutPayment.tsx';
import { CheckoutConfirmation } from './CheckoutConfirmation.tsx';

export type ShippingData = {
  name: string;
  address: string;
  city: string;
  postal: string;
  phone: string;
  deliveryTime: string;
};

export type PaymentData = {
  method: 'card' | 'paypal' | 'cash';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
};

interface CheckoutProps {
  cart: Cart | undefined;
  onCartChange: (cart: Cart) => void;
  onClose: () => void;
}

const steps = ['Cart', 'Shipping', 'Payment', 'Confirmation'];

export const Checkout = ({ cart, onCartChange, onClose }: CheckoutProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const [savedCart, setSavedCart] = useState<Cart | null>(null);

  useEffect(() => {
    const savedShipping = localStorage.getItem('shippingData');
    if (savedShipping) {
      setShippingData(JSON.parse(savedShipping));
    }
  }, []);

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    localStorage.setItem('shippingData', JSON.stringify(data));
    setActiveStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setOrderSuccess(true);
        const currentCart = savedCart || cart;
        const orderData = {
          cart: currentCart,
          shippingData: shippingData,
          paymentData: paymentData,
          orderDate: new Date().toISOString(),
          subtotal: currentCart?.totalPrice || 0,
          tax: (currentCart?.totalPrice || 0) * 0.1,
          total: (currentCart?.totalPrice || 0) * 1.1,
        };
        
        const existingOrders = localStorage.getItem('orderHistory');
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.unshift(orderData);
        localStorage.setItem('orderHistory', JSON.stringify(orders.slice(0, 10)));
        
        onCartChange({ items: [], totalPrice: 0, totalItems: 0 });
        localStorage.removeItem('shippingData');
      } else {
        setOrderError(true);
      }
    } catch (err) {
      setOrderError(true);
    }
  };

  const handlePaymentSubmit = (data: PaymentData) => {
    setPaymentData(data);
    setActiveStep(3);
    if (cart) setSavedCart(cart);
    handlePlaceOrder();
  };

  if (!cart) return null;

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <CheckoutCart cart={cart} onNext={() => cart?.items.length && setActiveStep(1)} onClose={onClose} />
      )}

      {activeStep === 1 && (
        <CheckoutShipping initialData={shippingData} onSubmit={handleShippingSubmit} onBack={() => setActiveStep(0)} />
      )}

      {activeStep === 2 && (
        <CheckoutPayment onSubmit={handlePaymentSubmit} onBack={() => setActiveStep(1)} />
      )}

      {activeStep === 3 && (
        <CheckoutConfirmation
          cart={savedCart || cart || { items: [], totalPrice: 0, totalItems: 0 }}
          shippingData={shippingData}
          paymentData={paymentData}
          success={orderSuccess}
          error={orderError}
          onRetry={() => { setOrderError(false); handlePlaceOrder(); }}
          onClose={onClose}
        />
      )}
    </Box>
  );
};