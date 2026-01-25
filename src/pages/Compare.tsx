import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Star, Check, Minus, ShoppingBag } from 'lucide-react';
import { useCompareStore } from '@/store/useCompareStore';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();
  const { addToCart, openCart } = useStore();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof compareList[0]) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    openCart();
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (compareList.length === 0) {
    return (
      <div className="pt-32 pb-16 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-bold mb-4">Compare Products</h1>
            <p className="text-muted-foreground mb-8">
              You haven't added any products to compare yet.
            </p>
            <Button asChild size="lg">
              <Link to="/shop">Browse Products</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const specs = [
    { label: 'Brand', key: 'brand' },
    { label: 'Category', key: 'category' },
    { label: 'Price', key: 'price', format: (v: number) => `$${v.toFixed(2)}` },
    { label: 'Original Price', key: 'originalPrice', format: (v?: number) => v ? `$${v.toFixed(2)}` : '-' },
    { label: 'Rating', key: 'rating' },
    { label: 'Reviews', key: 'reviews' },
    { label: 'In Stock', key: 'inStock', format: (v: boolean) => v ? 'Yes' : 'No' },
    { label: 'Sizes', key: 'sizes', format: (v: number[]) => v.join(', ') },
    { label: 'Colors', key: 'colors', format: (v: string[]) => v.join(', ') },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold">Compare Products</h1>
            <p className="text-muted-foreground mt-2">
              Compare up to 3 products side by side
            </p>
          </div>
          <Button variant="outline" onClick={clearCompare}>
            Clear All
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48 bg-muted/50">Product</TableHead>
                  {compareList.map((product) => (
                    <TableHead key={product.id} className="min-w-64 text-center">
                      <div className="relative">
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute -top-2 right-0 p-1 hover:bg-muted rounded-full transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
                          />
                          <p className="font-semibold hover:text-accent transition-colors">
                            {product.name}
                          </p>
                        </Link>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {specs.map((spec) => (
                  <TableRow key={spec.key}>
                    <TableCell className="font-medium bg-muted/50">
                      {spec.label}
                    </TableCell>
                    {compareList.map((product) => {
                      const value = product[spec.key as keyof typeof product] as unknown;
                      const formatFn = spec.format as ((v: unknown) => string) | undefined;
                      const displayValue = formatFn
                        ? formatFn(value)
                        : value;

                      return (
                        <TableCell key={product.id} className="text-center">
                          {spec.key === 'rating' ? (
                            <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span>{String(value)}</span>
                            </div>
                          ) : spec.key === 'inStock' ? (
                            value ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="capitalize">{String(displayValue)}</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium bg-muted/50">
                    Description
                  </TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {product.description}
                      </p>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="bg-muted/50" />
                  {compareList.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="gap-2"
                        disabled={!product.inStock}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Compare;
