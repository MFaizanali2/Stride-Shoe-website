import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useStore();

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-16 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything yet. Start shopping to fill your cart!
            </p>
            <Button size="lg" asChild>
              <Link to="/shop" className="gap-2">
                Start Shopping
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl lg:text-4xl font-bold mb-8"
        >
          Shopping Cart ({cart.length} items)
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={`${item.product.id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 lg:gap-6 p-4 lg:p-6 bg-card rounded-2xl shadow-brand-sm"
              >
                <Link to={`/product/${item.product.id}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-xl"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-display font-semibold text-lg hover:text-accent transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-2">
                    Size: {item.size} • Color: {item.color}
                  </p>
                  <p className="font-display text-xl font-bold text-accent">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-2 bg-secondary rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-end">
              <Button variant="outline" className="text-destructive" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-card rounded-2xl p-6 shadow-brand-md">
              <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${cartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-accent">
                    {cartTotal() >= 100 ? 'Free' : '$9.99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${(cartTotal() * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-display text-lg font-bold">Total</span>
                  <span className="font-display text-2xl font-bold text-accent">
                    $
                    {(
                      cartTotal() +
                      (cartTotal() >= 100 ? 0 : 9.99) +
                      cartTotal() * 0.08
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {cartTotal() < 100 && (
                <p className="text-sm text-muted-foreground mb-4">
                  Add ${(100 - cartTotal()).toFixed(2)} more for free shipping!
                </p>
              )}

              <Button size="lg" className="w-full h-14 font-semibold text-lg gap-2" asChild>
                <Link to="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="outline" className="w-full mt-3" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
