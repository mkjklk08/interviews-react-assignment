import { Box, Typography, Button, Card, CardContent, Alert, CircularProgress, Divider } from '@mui/material';
import { Cart } from '../product/Products.tsx';
import { ShippingData, PaymentData } from './Checkout.tsx';

interface CheckoutConfirmationProps {
  cart: Cart;
  shippingData: ShippingData | null;
  paymentData: PaymentData | null;
  success: boolean;
  error: boolean;
  onRetry: () => void;
  onClose: () => void;
}

export const CheckoutConfirmation = ({
  cart,
  shippingData,
  paymentData,
  success,
  error,
  onRetry,
  onClose,
}: CheckoutConfirmationProps) => {
  const subtotal = cart?.totalPrice || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (!success && !error) {
    return (
      <Box textAlign="center" py={8}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6">Processing your order...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>Failed to place order. Please try again.</Alert>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={onRetry}>Retry</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Alert severity="success" sx={{ mb: 3 }}>Order placed successfully! Thank you for your purchase.</Alert>

      <Typography variant="h5" gutterBottom>Order Summary</Typography>

      {shippingData && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <Typography>{shippingData.name}</Typography>
            <Typography>{shippingData.address}</Typography>
            <Typography>{shippingData.city}, {shippingData.postal}</Typography>
            <Typography>Phone: {shippingData.phone}</Typography>
            <Typography sx={{ mt: 1 }}>Delivery: {shippingData.deliveryTime}</Typography>
          </CardContent>
        </Card>
      )}

      {paymentData && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <Typography>
              {paymentData.method === 'card' && 'Credit/Debit Card'}
              {paymentData.method === 'paypal' && 'PayPal'}
              {paymentData.method === 'cash' && 'Cash on Delivery'}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>Total Amount</Typography>
          
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body1" fontWeight="medium">Subtotal:</Typography>
            <Typography variant="body1" fontWeight="medium">${subtotal.toFixed(2)}</Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body1" fontWeight="medium">Tax (10%):</Typography>
            <Typography variant="body1" fontWeight="medium">${tax.toFixed(2)}</Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="h6" fontWeight="bold">Total:</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">${total.toFixed(2)}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="contained" size="large" onClick={onClose}>Continue Shopping</Button>
      </Box>
    </Box>
  );
};