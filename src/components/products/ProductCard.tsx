import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart, openCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative bg-card rounded-2xl overflow-hidden shadow-brand-sm hover:shadow-brand-lg transition-all duration-500">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-secondary/50">
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.new && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                  NEW
                </span>
              )}
              {product.originalPrice && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive text-destructive-foreground">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-4 right-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleWishlist}
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                  isLiked
                    ? 'bg-destructive text-white'
                    : 'bg-background/80 backdrop-blur-sm text-foreground hover:bg-background'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
            </div>

            {/* Quick Add Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Button
                className="w-full gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Quick Add</span>
              </Button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-5">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.reviews})
              </span>
            </div>

            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-accent">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Color Options */}
            <div className="flex items-center gap-2 mt-3">
              {product.colors.slice(0, 3).map((color) => (
                <div
                  key={color}
                  className="h-5 w-5 rounded-full border-2 border-border"
                  style={{
                    backgroundColor:
                      color.toLowerCase() === 'white'
                        ? '#ffffff'
                        : color.toLowerCase() === 'black'
                        ? '#1a1a1a'
                        : color.toLowerCase() === 'navy'
                        ? '#1e3a5f'
                        : color.toLowerCase() === 'cyan'
                        ? '#0ea5e9'
                        : color.toLowerCase() === 'gray'
                        ? '#6b7280'
                        : color.toLowerCase() === 'red'
                        ? '#ef4444'
                        : color.toLowerCase() === 'pink'
                        ? '#ec4899'
                        : color.toLowerCase() === 'brown'
                        ? '#92400e'
                        : color.toLowerCase() === 'green'
                        ? '#22c55e'
                        : color.toLowerCase() === 'orange'
                        ? '#f97316'
                        : color.toLowerCase() === 'lavender'
                        ? '#a78bfa'
                        : color.toLowerCase() === 'nude'
                        ? '#d4a574'
                        : '#ddd',
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-sm text-muted-foreground">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
