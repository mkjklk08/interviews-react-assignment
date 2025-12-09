import { Box, Typography, Button, Card, CardContent, Divider, List, ListItem, ListItemText } from '@mui/material';
import { Cart, CartItem } from '../product/Products';

interface CheckoutCartProps {
  cart: Cart;
  onNext: () => void;
  onClose: () => void;
}

export const CheckoutCart = ({ cart, onNext, onClose }: CheckoutCartProps) => {
  const tax = cart.totalPrice * 0.1;
  const total = cart.totalPrice + tax;

  if (cart.items.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" gutterBottom>Your cart is empty</Typography>
        <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>Continue Shopping</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Review Your Cart</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <List>
            {cart.items.map((item: CartItem, index: number) => {
              const { product, quantity } = item;
              const itemTotal = product.price * quantity;
              
              return (
                <Box key={product.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={<Typography variant="h6" component="div">{product.name}</Typography>}
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            Цена за единицу: ${product.price.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Количество: {quantity}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box textAlign="right" ml={2}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ${itemTotal.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${product.price.toFixed(2)} × {quantity}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < cart.items.length - 1 && <Divider />}
                </Box>
              );
            })}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal:</Typography>
            <Typography>${cart.totalPrice.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Tax (10%):</Typography>
            <Typography>${tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">${total.toFixed(2)}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onNext}>Continue to Shipping</Button>
      </Box>
    </Box>
  );
};