import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, User } from '@/types';

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: number, color: string) => void;
  removeFromCart: (productId: string, size: number, color: string) => void;
  updateQuantity: (productId: string, size: number, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Cart Drawer
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart State
      cart: [],
      
      addToCart: (product, size, color) => {
        const cart = get().cart;
        const existingItem = cart.find(
          item => item.product.id === product.id && item.size === size && item.color === color
        );

        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity: 1, size, color }] });
        }
      },

      removeFromCart: (productId, size, color) => {
        set({
          cart: get().cart.filter(
            item => !(item.product.id === productId && item.size === size && item.color === color)
          ),
        });
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }
        set({
          cart: get().cart.map(item =>
            item.product.id === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      cartTotal: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      cartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Auth State
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Mock authentication
        await new Promise(resolve => setTimeout(resolve, 800));
        if (email && password.length >= 6) {
          set({
            user: { id: '1', name: email.split('@')[0], email },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      register: async (name, email, password) => {
        // Mock registration
        await new Promise(resolve => setTimeout(resolve, 800));
        if (name && email && password.length >= 6) {
          set({
            user: { id: '1', name, email },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // Theme State
      theme: 'light',
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      },

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      // Cart Drawer
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
    }),
    {
      name: 'stride-store',
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    }
  )
);
