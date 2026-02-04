import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address, PaymentMethod } from '@/types';

interface ProfileState {
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  updatePersonalInfo: (info: Partial<ProfileState['personalInfo']>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      addresses: [
        {
          id: '1',
          name: 'Casa',
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil',
          isDefault: true,
        },
      ],
      paymentMethods: [
        {
          id: '1',
          type: 'credit_card',
          cardNumber: '**** **** **** 4242',
          cardHolder: 'João Silva',
          expiryDate: '12/25',
          displayName: 'Cartão de Crédito •••• 4242',
          isDefault: true,
        },
        {
          id: '2',
          type: 'pix',
          pixKey: 'joao.silva@email.com',
          displayName: 'PIX - joao.silva@email.com',
          isDefault: false,
        },
        {
          id: '3',
          type: 'cash',
          displayName: 'Dinheiro na Entrega',
          isDefault: false,
        },
      ],
      personalInfo: {
        name: '',
        email: '',
        phone: '',
      },

      addAddress: (address) => {
        set((state) => ({
          addresses: [
            ...state.addresses,
            { ...address, id: `addr-${Date.now()}` },
          ],
        }));
      },

      updateAddress: (id, address) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...address } : a
          ),
        }));
      },

      removeAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }));
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }));
      },

      addPaymentMethod: (method) => {
        set((state) => ({
          paymentMethods: [
            ...state.paymentMethods,
            { ...method, id: `pm-${Date.now()}` },
          ],
        }));
      },

      removePaymentMethod: (id) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((p) => p.id !== id),
        }));
      },

      setDefaultPaymentMethod: (id) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((p) => ({
            ...p,
            isDefault: p.id === id,
          })),
        }));
      },

      updatePersonalInfo: (info) => {
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
        }));
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);
