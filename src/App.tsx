import { useState, useEffect } from 'react';
import { Cart, Products } from './product/Products.tsx';
import { Box, CssBaseline, Dialog } from '@mui/material';
import SearchAppBar from './SearchAppBar.tsx';
import { Categories } from './Categories.tsx';
import { Checkout } from './Checkout/Checkout.tsx';

function App() {
  const [cart, setCart] = useState<Cart>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get('q') || '');
    setSelectedCategory(params.get('category') || null);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    window.history.pushState({}, '', params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    );
  }, [searchQuery, selectedCategory]);

  return (
    <Box height="100vh" display="flex" flexDirection="column" sx={{ overflow: 'hidden' }}>
      <CssBaseline/>
      
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <SearchAppBar 
          quantity={cart?.totalItems || 0} 
          price={cart?.totalPrice || 0}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCartClick={() => setIsCheckoutOpen(true)}
        />
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        marginTop: '64px',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden'
      }}>
        <Categories
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onClearFilters={() => {}}
        />
        
        <Box flex={1} sx={{ height: '100%', overflow: 'hidden' }}>
          <Products 
            onCartChange={setCart}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        </Box>
      </Box>

      <Dialog open={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} maxWidth="md" fullWidth>
        <Checkout
          cart={cart}
          onCartChange={setCart}
          onClose={() => setIsCheckoutOpen(false)}
        />
      </Dialog>
    </Box>
  );
}

export default App;
