import { Coupon } from '@/types';

export const coupons: Coupon[] = [
  {
    code: 'BEMVINDO10',
    discountType: 'percentage',
    discountValue: 10,
    description: '10% de desconto na primeira compra',
  },
  {
    code: 'PROMO20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 200,
    description: '20% de desconto em compras acima de R$ 200',
  },
  {
    code: 'FRETE50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 150,
    description: 'R$ 50,00 de desconto em compras acima de R$ 150',
  },
  {
    code: 'SUPER30',
    discountType: 'percentage',
    discountValue: 30,
    minOrderValue: 500,
    description: '30% de desconto em compras acima de R$ 500',
  },
  {
    code: 'DESC25',
    discountType: 'fixed',
    discountValue: 25,
    description: 'R$ 25,00 de desconto em qualquer compra',
  },
];

export function validateCoupon(code: string, orderTotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    return { valid: false, error: 'Cupom inválido ou expirado' };
  }

  if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
    return { 
      valid: false, 
      error: `Valor mínimo de R$ ${coupon.minOrderValue.toFixed(2).replace('.', ',')} para usar este cupom` 
    };
  }

  return { valid: true, coupon };
}

export function calculateDiscount(coupon: Coupon, orderTotal: number): number {
  if (coupon.discountType === 'percentage') {
    return (orderTotal * coupon.discountValue) / 100;
  }
  return Math.min(coupon.discountValue, orderTotal);
}
