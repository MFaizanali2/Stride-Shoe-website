import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  onSale: boolean;
  setOnSale: (value: boolean) => void;
  maxPrice: number;
  onApply: () => void;
  onReset: () => void;
}

const FilterPanel = ({
  isOpen,
  onClose,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  onSale,
  setOnSale,
  maxPrice,
  onApply,
  onReset,
}: FilterPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-background border-r z-50 shadow-2xl overflow-y-auto lg:relative lg:shadow-none lg:border lg:rounded-xl lg:h-fit"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold">Filters</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="lg:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Price Range */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Price Range
                  </div>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={maxPrice}
                    step={10}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </motion.div>

                {/* Rating Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Star className="h-4 w-4 text-primary" />
                    Minimum Rating
                  </div>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMinRating(rating)}
                        className="flex-1"
                      >
                        {rating === 0 ? 'All' : (
                          <span className="flex items-center gap-1">
                            {rating}+
                            <Star className="h-3 w-3 fill-current" />
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                </motion.div>

                {/* Availability */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4 text-primary" />
                    Availability
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                      />
                      <Label
                        htmlFor="in-stock"
                        className="text-sm font-normal cursor-pointer"
                      >
                        In Stock Only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="on-sale"
                        checked={onSale}
                        onCheckedChange={(checked) => setOnSale(checked as boolean)}
                      />
                      <Label
                        htmlFor="on-sale"
                        className="text-sm font-normal cursor-pointer"
                      >
                        On Sale
                      </Label>
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 pt-4 border-t"
                >
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onReset}
                  >
                    Reset
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      onApply();
                      onClose();
                    }}
                  >
                    Apply Filters
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;
