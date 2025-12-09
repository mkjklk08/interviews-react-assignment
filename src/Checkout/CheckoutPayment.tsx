import { useState } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField, Alert } from '@mui/material';
import { PaymentData } from './Checkout.tsx';

interface CheckoutPaymentProps {
  onSubmit: (data: PaymentData) => void;
  onBack: () => void;
}

export const CheckoutPayment = ({ onSubmit, onBack }: CheckoutPaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCard = (): boolean => {
    if (paymentMethod !== 'card') return true;

    const newErrors: Record<string, string> = {};
    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Invalid card number';
    }
    if (!cardData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!cardData.cardExpiry.trim()) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.cardExpiry)) {
      newErrors.cardExpiry = 'Format: MM/YY';
    }
    if (!cardData.cardCvv.trim()) {
      newErrors.cardCvv = 'CVV is required';
    } else if (cardData.cardCvv.length < 3) {
      newErrors.cardCvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCard()) {
      onSubmit({
        method: paymentMethod,
        ...(paymentMethod === 'card' ? cardData : {}),
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Payment Method</Typography>

      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
          <FormLabel component="legend">Select Payment Method</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value as 'card' | 'paypal' | 'cash');
              setErrors({});
            }}
          >
            <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
            <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
            <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
          </RadioGroup>
        </FormControl>

        {paymentMethod === 'card' && (
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <TextField
              label="Card Number"
              value={cardData.cardNumber}
              onChange={(e) => setCardData(prev => ({ ...prev, cardNumber: e.target.value }))}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              fullWidth
              placeholder="1234 5678 9012 3456"
            />
            <TextField
              label="Name on Card"
              value={cardData.cardName}
              onChange={(e) => setCardData(prev => ({ ...prev, cardName: e.target.value }))}
              error={!!errors.cardName}
              helperText={errors.cardName}
              fullWidth
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Expiry (MM/YY)"
                value={cardData.cardExpiry}
                onChange={(e) => setCardData(prev => ({ ...prev, cardExpiry: e.target.value }))}
                error={!!errors.cardExpiry}
                helperText={errors.cardExpiry}
                placeholder="12/25"
                sx={{ flex: 1 }}
              />
              <TextField
                label="CVV"
                value={cardData.cardCvv}
                onChange={(e) => setCardData(prev => ({ ...prev, cardCvv: e.target.value }))}
                error={!!errors.cardCvv}
                helperText={errors.cardCvv}
                type="password"
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        )}

        {paymentMethod === 'paypal' && (
          <Alert severity="info" sx={{ mt: 2 }}>You will be redirected to PayPal to complete the payment.</Alert>
        )}

        {paymentMethod === 'cash' && (
          <Alert severity="info" sx={{ mt: 2 }}>Payment will be collected upon delivery.</Alert>
        )}

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button onClick={onBack}>Back</Button>
          <Button type="submit" variant="contained">Place Order</Button>
        </Box>
      </form>
    </Box>
  );
};