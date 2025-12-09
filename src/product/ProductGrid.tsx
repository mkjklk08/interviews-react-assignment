import { memo } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { ProductCard } from './ProductCard.tsx';
import { Product } from './Products.tsx';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onAddToCart: (productId: number, quantity: number) => void;
  getImageUrl: (product: Product) => string;
  onImageError: (productId: number) => void;
}

export const ProductGrid = memo(({ 
  products, 
  isLoading, 
  isLoadingMore, 
  hasMore,
  onAddToCart,
  getImageUrl,
  onImageError 
}: ProductGridProps) => {
  if (isLoading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No products found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2} p={2}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              imageUrl={getImageUrl(product)}
              onImageError={onImageError}
            />
          </Grid>
        ))}
      </Grid>

      {isLoadingMore && (
        <Box display="flex" flexDirection="column" alignItems="center" py={4}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      )}

      {!hasMore && !isLoadingMore && (
        <Box display="flex" justifyContent="center" py={2}>
          <Typography color="text.secondary">All products loaded</Typography>
        </Box>
      )}
    </>
  );
});

ProductGrid.displayName = 'ProductGrid';