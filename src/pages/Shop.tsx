import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Grid, LayoutGrid, X } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'men', name: 'Men' },
  { id: 'women', name: 'Women' },
  { id: 'sneakers', name: 'Sneakers' },
  { id: 'sports', name: 'Sports' },
  { id: 'casual', name: 'Casual' },
];

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'newest', name: 'Newest' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Top Rated' },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered = filtered.filter((p) => p.new).concat(filtered.filter((p) => !p.new));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered = filtered.filter((p) => p.featured).concat(filtered.filter((p) => !p.featured));
    }

    return filtered;
  }, [selectedCategory, sortBy]);

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-primary py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl lg:text-6xl font-bold mb-4 text-primary-foreground">Shop All Shoes</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Discover our complete collection of premium footwear designed for every occasion
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'bg-accent text-accent-foreground' : ''}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            <div className="hidden lg:flex items-center gap-1 border border-border rounded-lg p-1">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded ${gridCols === 3 ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 rounded ${gridCols === 4 ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {selectedCategory !== 'all' && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Products Grid */}
        <motion.div
          layout
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
          } gap-6`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-muted-foreground">No products found in this category.</p>
            <Button className="mt-4" onClick={() => setSelectedCategory('all')}>
              View All Products
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shop;
