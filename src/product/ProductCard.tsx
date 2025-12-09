import { memo } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { HeavyComponent } from '../HeavyComponent.tsx';
import { Product } from './Products.tsx';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number) => void;
  imageUrl: string;
  onImageError: (productId: number) => void;
}

export const ProductCard = memo(({ product, onAddToCart, imageUrl, onImageError }: ProductCardProps) => {
  return (
    <Box>
      <HeavyComponent/>
      <Card sx={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}>
        <Box sx={{ 
          height: 150, 
          width: '100%', 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <CardMedia
            component="img"
            height="150"
            image={imageUrl}
            alt={product.name}
            onError={() => onImageError(product.id)}
            sx={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Box display="flex" alignItems="center">
            <IconButton size="small" onClick={() => onAddToCart(product.id, -1)} color="primary">
              <RemoveIcon fontSize="small"/>
            </IconButton>
            <Typography variant="body1" mx={1.5} minWidth="24px" textAlign="center">
              {product.itemInCart || 0}
            </Typography>
            <IconButton size="small" onClick={() => onAddToCart(product.id, 1)} color="primary">
              <AddIcon fontSize="small"/>
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
});

ProductCard.displayName = 'ProductCard';