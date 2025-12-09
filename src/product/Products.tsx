import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Box, Alert, Button, Snackbar } from '@mui/material';
import { ProductGrid } from './ProductGrid.tsx';
import { ProductFilters } from './ProductFilters.tsx';

export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

const PRODUCTS_PER_PAGE = 10;
const SCROLL_THRESHOLD = 200;
const PLACEHOLDER_IMAGE = 'https://loremflickr.com/300/300/technology?lock=999';

interface ProductsProps {
  onCartChange: (cart: Cart) => void;
  searchQuery: string;
  selectedCategory: string | null;
}

export const Products = ({ onCartChange, searchQuery, selectedCategory }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [sortBy, setSortBy] = useState('name');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
    
    return filtered;
  }, [products, minPrice, maxPrice, sortBy]);

  const loadProducts = useCallback(async (page: number, isInitial: boolean, search: string, category: string | null) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (isInitial) {
      setIsLoading(true);
      setError(null);
      setProducts([]);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', PRODUCTS_PER_PAGE.toString());
      if (search) params.set('q', search);
      if (category) params.set('category', category);

      const response = await fetch(`/products?${params.toString()}`, {
        signal: controller.signal
      });
      
      if (!response.ok) throw new Error('Something went wrong');
      
      const data = await response.json();
      
      setProducts(prev => isInitial ? (data.products || []) : [...prev, ...(data.products || [])]);
      setHasMore(data.hasMore !== false);
      setError(null);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Something went wrong');
      if (!isInitial) setError(null);
    } finally {
      if (isInitial) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(0);
    setHasMore(true);
    loadProducts(0, true, searchQuery, selectedCategory);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery, selectedCategory, loadProducts]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      
      if (distanceToBottom < SCROLL_THRESHOLD && hasMore && !isLoadingMore && !isLoading) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        loadProducts(nextPage, false, searchQuery, selectedCategory);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, isLoading, currentPage, searchQuery, selectedCategory, loadProducts]);

  const updateProductQuantity = (productId: number, change: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, itemInCart: Math.max(0, (p.itemInCart || 0) + change) }
        : p
    ));
  };

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    updateProductQuantity(productId, quantity);
    setCartError(null);
    
    try {
      const response = await fetch('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      
      if (response.ok) {
        const cart = await response.json();
        onCartChange(cart);
      } else {
        updateProductQuantity(productId, -quantity);
        setCartError('Failed to update cart');
      }
    } catch {
      updateProductQuantity(productId, -quantity);
      setCartError('Network error');
    }
  }, [onCartChange]);

  const getImageUrl = useCallback((product: Product) => {
    return imageErrors[product.id] ? PLACEHOLDER_IMAGE : product.imageUrl;
  }, [imageErrors]);

  const handleImageError = useCallback((productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setImageErrors({});
    setCurrentPage(0);
    loadProducts(0, true, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, loadProducts]);

  return (
    <Box 
      ref={scrollContainerRef} 
      sx={{ height: '100%', width: '100%', overflowY: 'auto', overflowX: 'hidden' }}
    >
      {error && !isLoading && products.length === 0 && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="400px" p={3}>
          <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
            Something went wrong
          </Alert>
          <Button variant="contained" onClick={handleRetry}>Try again</Button>
        </Box>
      )}

      <Snackbar
        open={!!cartError}
        autoHideDuration={6000}
        onClose={() => setCartError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setCartError(null)} severity="error">{cartError}</Alert>
      </Snackbar>

      {!isLoading && products.length > 0 && (
        <ProductFilters
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultsCount={filteredAndSortedProducts.length}
        />
      )}

      <ProductGrid
        products={filteredAndSortedProducts}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onAddToCart={addToCart}
        getImageUrl={getImageUrl}
        onImageError={handleImageError}
      />
    </Box>
  );
};
