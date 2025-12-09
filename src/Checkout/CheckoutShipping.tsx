import { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Alert, SelectChangeEvent } from '@mui/material';
import { ShippingData } from './Checkout.tsx';

interface CheckoutShippingProps {
  initialData: ShippingData | null;
  onSubmit: (data: ShippingData) => void;
  onBack: () => void;
}

export const CheckoutShipping = ({ initialData, onSubmit, onBack }: CheckoutShippingProps) => {
  const [formData, setFormData] = useState<ShippingData>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    postal: initialData?.postal || '',
    phone: initialData?.phone || '',
    deliveryTime: initialData?.deliveryTime || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postal.trim()) newErrors.postal = 'Postal code is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  const handleChange = (field: keyof ShippingData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Shipping Information</Typography>

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <TextField
            label="Full Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
          <TextField
            label="Address"
            value={formData.address}
            onChange={handleChange('address')}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
            required
            multiline
            rows={2}
          />
          <TextField
            label="City"
            value={formData.city}
            onChange={handleChange('city')}
            error={!!errors.city}
            helperText={errors.city}
            fullWidth
            required
          />
          <TextField
            label="Postal Code"
            value={formData.postal}
            onChange={handleChange('postal')}
            error={!!errors.postal}
            helperText={errors.postal}
            fullWidth
            required
          />
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
            required
          />
          <FormControl fullWidth required error={!!errors.deliveryTime}>
            <InputLabel>Delivery Time</InputLabel>
            <Select
              value={formData.deliveryTime}
              onChange={handleChange('deliveryTime')}
              label="Delivery Time"
            >
              <MenuItem value="standard">Standard (5-7 days)</MenuItem>
              <MenuItem value="express">Express (2-3 days)</MenuItem>
              <MenuItem value="overnight">Overnight (1 day)</MenuItem>
            </Select>
            {errors.deliveryTime && <Alert severity="error" sx={{ mt: 1 }}>{errors.deliveryTime}</Alert>}
          </FormControl>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button onClick={onBack}>Back</Button>
          <Button type="submit" variant="contained">Continue to Payment</Button>
        </Box>
      </form>
    </Box>
  );
};