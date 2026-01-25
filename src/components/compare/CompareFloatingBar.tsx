import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3 } from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';
import { Button } from '@/components/ui/button';

export const CompareFloatingBar = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-card border border-border rounded-2xl shadow-brand-lg p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <span className="font-medium">Compare ({compareList.length}/3)</span>
          </div>

          <div className="flex items-center gap-2">
            {compareList.map((product) => (
              <div key={product.id} className="relative group">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover border border-border"
                />
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearCompare}>
              Clear
            </Button>
            <Button asChild size="sm">
              <Link to="/compare">Compare</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
