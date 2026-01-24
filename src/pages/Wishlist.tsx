import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart, openCart } = useStore();

  const handleAddToCart = (product: typeof wishlist[0]) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    openCart();
  };

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              My Wishlist
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wishlist Items */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {wishlist.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {wishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-brand-sm hover:shadow-brand-lg transition-all duration-300"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-secondary/50">
                      <motion.img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-display font-bold text-xl text-accent">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromWishlist(product.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Heart className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Save items you love by clicking the heart icon
            </p>
            <Button asChild size="lg">
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
