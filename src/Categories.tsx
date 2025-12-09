import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const drawerWidth = 180;
const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Audio', 'Gaming', 'Wearables', 'Cameras'];

interface CategoriesProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  searchQuery: string;
  onClearFilters: () => void;
}

export const Categories = ({ selectedCategory, onCategoryChange }: CategoriesProps) => {
  return (
    <Box 
      minWidth={drawerWidth} 
      sx={{ 
        borderRight: '1px solid #e0e0e0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <ListItem disablePadding>
          <ListItemButton selected={selectedCategory === null} onClick={() => onCategoryChange(null)}>
            <ListItemText primary="All Categories" />
          </ListItemButton>
        </ListItem>
        {categories.map((category) => (
          <ListItem key={category} disablePadding>
            <ListItemButton
              selected={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
            >
              <ListItemText primary={category} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};