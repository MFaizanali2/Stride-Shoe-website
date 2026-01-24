import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingBag, Minus, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStore } from '@/store/useStore';

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorMap: Record<string, string> = {
  white: '#ffffff',
  black: '#1a1a1a',
  navy: '#1e3a5f',
  cyan: '#0ea5e9',
  gray: '#6b7280',
  red: '#ef4444',
  pink: '#ec4899',
  brown: '#92400e',
  green: '#22c55e',
  orange: '#f97316',
  lavender: '#a78bfa',
  nude: '#d4a574',
};

export const QuickViewModal = ({ product, open, onOpenChange }: QuickViewModalProps) => {
  const { addToCart, openCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    openCart();
    onOpenChange(false);
  };

  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const getColorHex = (color: string): string => {
    return colorMap[color.toLowerCase()] || '#ddd';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name} - Quick View</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative bg-secondary/30 p-4 md:p-6">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {product.new && (
                <Badge className="bg-accent text-accent-foreground">NEW</Badge>
              )}
              {product.originalPrice && (
                <Badge variant="destructive">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-xl overflow-hidden bg-background"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {product.images.slice(0, 4).map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-accent'
                        : 'border-transparent hover:border-muted-foreground/30'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Brand & Rating */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.brand}
              </p>
              <div className="flex items-center gap-1">
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
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-3xl font-bold text-accent">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 line-clamp-3">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">
                Color: <span className="text-muted-foreground">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-accent ring-2 ring-accent/30'
                        : 'border-border hover:border-accent/50'
                    }`}
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 min-w-[2.5rem] px-3 rounded-lg border transition-all font-medium ${
                      selectedSize === size
                        ? 'border-accent bg-accent text-white'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button
                className="flex-1 gap-2"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingBag className="h-5 w-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
                className={isLiked ? 'text-destructive border-destructive hover:bg-destructive/10' : ''}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* View Full Details Link */}
            <Link
              to={`/product/${product.id}`}
              className="text-center text-sm text-accent hover:underline mt-4"
              onClick={() => onOpenChange(false)}
            >
              View Full Details →
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
