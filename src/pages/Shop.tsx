import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Grid, LayoutGrid, X } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FilterPanel from '@/components/shop/FilterPanel';

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

// Calculate max price for filter
const maxProductPrice = Math.ceil(Math.max(...products.map(p => p.price)) / 10) * 10 + 50;

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxProductPrice]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSale, setOnSale] = useState(false);
  
  // Applied filter states (only apply when user clicks Apply)
  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: [0, maxProductPrice] as [number, number],
    minRating: 0,
    inStockOnly: false,
    onSale: false,
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      priceRange,
      minRating,
      inStockOnly,
      onSale,
    });
  };

  const handleResetFilters = () => {
    setPriceRange([0, maxProductPrice]);
    setMinRating(0);
    setInStockOnly(false);
    setOnSale(false);
    setAppliedFilters({
      priceRange: [0, maxProductPrice],
      minRating: 0,
      inStockOnly: false,
      onSale: false,
    });
  };

  const activeFilterCount = [
    appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < maxProductPrice,
    appliedFilters.minRating > 0,
    appliedFilters.inStockOnly,
    appliedFilters.onSale,
  ].filter(Boolean).length;

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.price >= appliedFilters.priceRange[0] && p.price <= appliedFilters.priceRange[1]
    );

    // Filter by rating
    if (appliedFilters.minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= appliedFilters.minRating);
    }

    // Filter by stock
    if (appliedFilters.inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Filter by sale
    if (appliedFilters.onSale) {
      filtered = filtered.filter((p) => p.originalPrice && p.originalPrice > p.price);
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
  }, [selectedCategory, sortBy, appliedFilters]);

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
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
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
        {(selectedCategory !== 'all' || activeFilterCount > 0) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('all')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < maxProductPrice) && (
              <Badge variant="secondary" className="gap-1">
                ${appliedFilters.priceRange[0]} - ${appliedFilters.priceRange[1]}
                <button onClick={() => {
                  setPriceRange([0, maxProductPrice]);
                  setAppliedFilters(prev => ({ ...prev, priceRange: [0, maxProductPrice] }));
                }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {appliedFilters.minRating > 0 && (
              <Badge variant="secondary" className="gap-1">
                {appliedFilters.minRating}+ stars
                <button onClick={() => {
                  setMinRating(0);
                  setAppliedFilters(prev => ({ ...prev, minRating: 0 }));
                }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {appliedFilters.inStockOnly && (
              <Badge variant="secondary" className="gap-1">
                In Stock
                <button onClick={() => {
                  setInStockOnly(false);
                  setAppliedFilters(prev => ({ ...prev, inStockOnly: false }));
                }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {appliedFilters.onSale && (
              <Badge variant="secondary" className="gap-1">
                On Sale
                <button onClick={() => {
                  setOnSale(false);
                  setAppliedFilters(prev => ({ ...prev, onSale: false }));
                }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-xs h-6">
                Clear All
              </Button>
            )}
          </div>
        )}

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          setMinRating={setMinRating}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
          onSale={onSale}
          setOnSale={setOnSale}
          maxPrice={maxProductPrice}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

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
            <p className="text-xl text-muted-foreground">No products found matching your filters.</p>
            <Button className="mt-4" onClick={handleResetFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shop;
