import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface CompareState {
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareList: [],
      
      addToCompare: (product) => {
        const list = get().compareList;
        if (list.length >= 3) return false;
        if (list.find(p => p.id === product.id)) return true;
        set({ compareList: [...list, product] });
        return true;
      },
      
      removeFromCompare: (productId) => {
        set({ compareList: get().compareList.filter(p => p.id !== productId) });
      },
      
      clearCompare: () => set({ compareList: [] }),
      
      isInCompare: (productId) => {
        return get().compareList.some(p => p.id === productId);
      },
    }),
    { name: 'stride-compare' }
  )
);
