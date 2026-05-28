import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Extended local cart item — includes display fields not in the shared ICartItem
export interface LocalCartItem {
  sku: string;
  product: string;      // product id
  name: string;         // display name
  image?: string;       // thumbnail
  variant?: string;     // e.g. "5 kg / Salmon"
  size?: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: LocalCartItem[];
  isOpen: boolean;
  addItem: (item: LocalCartItem) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  setOpen: (open: boolean) => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.sku === item.sku);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.sku === item.sku ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (sku) => set((state) => ({ items: state.items.filter((i) => i.sku !== sku) })),

      updateQuantity: (sku, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.sku !== sku)
              : state.items.map((i) => (i.sku === sku ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'pawmart-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
