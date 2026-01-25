import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CompareButtonProps {
  product: Product;
  className?: string;
}

export const CompareButton = ({ product, className = '' }: CompareButtonProps) => {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompareStore();
  const { toast } = useToast();
  const inCompare = isInCompare(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeFromCompare(product.id);
      toast({
        title: 'Removed from compare',
        description: `${product.name} has been removed from comparison.`,
      });
    } else {
      if (compareList.length >= 3) {
        toast({
          title: 'Compare limit reached',
          description: 'You can only compare up to 3 products at a time.',
          variant: 'destructive',
        });
        return;
      }
      addToCompare(product);
      toast({
        title: 'Added to compare',
        description: `${product.name} has been added to comparison.`,
      });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`flex items-center justify-center transition-colors ${
        inCompare
          ? 'bg-accent text-accent-foreground'
          : 'bg-background/80 backdrop-blur-sm text-foreground hover:bg-background'
      } ${className}`}
      title={inCompare ? 'Remove from compare' : 'Add to compare'}
    >
      <BarChart3 className="h-4 w-4" />
    </motion.button>
  );
};
