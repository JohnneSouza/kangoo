import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, CartItem, Address, PaymentMethod, DeliveryOption, AppliedCoupon } from '@/types';

interface OrderState {
  orders: Order[];
  createOrder: (
    items: CartItem[], 
    address: Address | undefined, 
    paymentMethod?: PaymentMethod, 
    deliveryOption?: DeliveryOption,
    appliedCoupon?: AppliedCoupon
  ) => Order;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (items, address, paymentMethod, deliveryOption, appliedCoupon) => {
        const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const discount = appliedCoupon?.discountAmount || 0;
        const total = subtotal - discount;
        
        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          items,
          subtotal,
          discount: discount > 0 ? discount : undefined,
          couponCode: appliedCoupon?.code,
          total,
          status: 'Confirmado',
          createdAt: new Date().toISOString(),
          address: address!,
          paymentMethod,
          deliveryOption,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },
    }),
    {
      name: 'order-storage',
    }
  )
);
