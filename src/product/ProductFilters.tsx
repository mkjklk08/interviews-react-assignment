import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { useState } from 'react';

interface ProductFiltersProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  resultsCount: number;
}

export const ProductFilters = ({
  minPrice,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
  resultsCount,
}: ProductFiltersProps) => {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice.toString());
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice.toString());

  const handlePriceBlur = () => {
    onPriceChange(parseFloat(localMinPrice) || 0, parseFloat(localMaxPrice) || 9999);
  };

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {resultsCount} {resultsCount === 1 ? 'product' : 'products'} found
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">Price:</Typography>
          <TextField
            type="number"
            size="small"
            label="Min"
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            onBlur={handlePriceBlur}
            sx={{ width: 100 }}
            inputProps={{ min: 0, step: 1 }}
          />
          <Typography variant="body2">-</Typography>
          <TextField
            type="number"
            size="small"
            label="Max"
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            onBlur={handlePriceBlur}
            sx={{ width: 100 }}
            inputProps={{ min: 0, step: 1 }}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} onChange={(e) => onSortChange(e.target.value)} label="Sort by">
            <MenuItem value="name">Name (A-Z)</MenuItem>
            <MenuItem value="name-desc">Name (Z-A)</MenuItem>
            <MenuItem value="price">Price (Low to High)</MenuItem>
            <MenuItem value="price-desc">Price (High to Low)</MenuItem>
          </Select>
        </FormControl>

        {(minPrice > 0 || maxPrice < 9999) && (
          <Chip
            label={`Price: $${minPrice} - $${maxPrice}`}
            onDelete={() => onPriceChange(0, 9999)}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  );
};