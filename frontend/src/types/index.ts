export interface ColorImage {
  color: string;
  imageIndex: number;
}

export interface NutritionalInfo {
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
  servingSize: string;
}

export interface FoodInfo {
  ingredients: string[];
  nutritionalInfo: NutritionalInfo;
  allergens?: string[];
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isOrganic?: boolean;
  isLactoseFree?: boolean;
  isSugarFree?: boolean;
  spicyLevel?: 0 | 1 | 2 | 3; // 0 = not spicy, 3 = very spicy
  weight?: string;
  expirationDays?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  colorImages?: ColorImage[];
  category: string;
  subcategory?: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  onSale?: boolean;
  originalPrice?: number;
  // Food product fields
  isFood?: boolean;
  foodInfo?: FoodInfo;
}

export type DeliveryMethod = 'pickup' | 'delivery' | 'scheduled';

export interface DeliveryOption {
  method: DeliveryMethod;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  specialNotes?: string; // For food products: special instructions like "remove onion"
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export type PaymentType = 'credit_card' | 'pix' | 'cash';

export interface PaymentMethod {
  id: string;
  type: PaymentType;
  // Credit card fields
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  // PIX fields
  pixKey?: string;
  // Display name for all types
  displayName: string;
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  description: string;
}

export interface AppliedCoupon extends Coupon {
  discountAmount: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  couponCode?: string;
  total: number;
  status: string;
  createdAt: string;
  address: Address;
  paymentMethod?: PaymentMethod;
  deliveryOption?: DeliveryOption;
}
