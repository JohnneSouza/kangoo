import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Check, ShoppingBag, QrCode, Banknote, Truck, Store, Calendar, Tag, X, Percent, User } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useOrderStore } from '@/store/orderStore';
import { PaymentType, DeliveryMethod, AppliedCoupon, Address } from '@/types';
import { validateCoupon, calculateDiscount } from '@/data/coupons';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

export function CheckoutPage() {
  const { isDark } = useThemeStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { addresses, paymentMethods } = useProfileStore();
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    paymentMethods.find((p) => p.isDefault)?.id || paymentMethods[0]?.id
  );
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Guest checkout state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: 'Entrega',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
  });
  const [useNewAddress, setUseNewAddress] = useState(!isAuthenticated || addresses.length === 0);
  
  // Guest payment selection
  const [guestPaymentType, setGuestPaymentType] = useState<PaymentType>('pix');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const selectedPayment = paymentMethods.find((p) => p.id === selectedPaymentId);
  const subtotal = getTotalPrice();
  const discount = appliedCoupon?.discountAmount || 0;
  const total = subtotal - discount;

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const getPaymentIcon = (type: PaymentType) => {
    switch (type) {
      case 'credit_card':
        return CreditCard;
      case 'pix':
        return QrCode;
      case 'cash':
        return Banknote;
      default:
        return CreditCard;
    }
  };

  const getDeliveryIcon = (method: DeliveryMethod) => {
    switch (method) {
      case 'pickup':
        return Store;
      case 'delivery':
        return Truck;
      case 'scheduled':
        return Calendar;
    }
  };

  const deliveryOptions: { method: DeliveryMethod; label: string; description: string }[] = [
    { method: 'delivery', label: 'Entrega Padrão', description: 'Receba em 3-5 dias úteis' },
    { method: 'pickup', label: 'Retirar na Loja', description: 'Disponível em 2 horas' },
    { method: 'scheduled', label: 'Entrega Agendada', description: 'Escolha a data e horário' },
  ];

  const paymentOptions: { type: PaymentType; label: string; description: string }[] = [
    { type: 'pix', label: 'Pix', description: 'Transferência instantânea' },
    { type: 'credit_card', label: 'Cartão de Crédito', description: 'Parcele em até 12x' },
    { type: 'cash', label: 'Dinheiro', description: 'Pagamento na entrega' },
  ];

  const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '18:00 - 20:00',
  ];

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Digite um código de cupom');
      return;
    }

    const result = validateCoupon(couponCode.trim(), subtotal);

    if (!result.valid) {
      setCouponError(result.error || 'Cupom inválido');
      toast.error(result.error || 'Cupom inválido');
      return;
    }

    if (result.coupon) {
      const discountAmount = calculateDiscount(result.coupon, subtotal);
      setAppliedCoupon({
        ...result.coupon,
        discountAmount,
      });
      setCouponError('');
      setCouponCode('');
      toast.success(`Cupom "${result.coupon.code}" aplicado com sucesso!`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Cupom removido');
  };

  const validateGuestInfo = () => {
    if (!isAuthenticated) {
      if (!guestName.trim()) {
        toast.error('Por favor, informe seu nome');
        return false;
      }
      if (!guestEmail.trim() || !guestEmail.includes('@')) {
        toast.error('Por favor, informe um e-mail válido');
        return false;
      }
      if (!guestPhone.trim()) {
        toast.error('Por favor, informe seu telefone');
        return false;
      }
    }
    return true;
  };

  const validateAddress = () => {
    if (deliveryMethod === 'pickup') return true;

    if (useNewAddress || !isAuthenticated) {
      if (!guestAddress.street.trim()) {
        toast.error('Por favor, informe o endereço');
        return false;
      }
      if (!guestAddress.city.trim()) {
        toast.error('Por favor, informe a cidade');
        return false;
      }
      if (!guestAddress.state.trim()) {
        toast.error('Por favor, informe o estado');
        return false;
      }
      if (!guestAddress.zipCode.trim()) {
        toast.error('Por favor, informe o CEP');
        return false;
      }
    } else if (!selectedAddressId) {
      toast.error('Por favor, selecione um endereço de entrega');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateGuestInfo()) return;
    if (!validateAddress()) return;

    if (deliveryMethod === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      toast.error('Por favor, selecione a data e horário da entrega');
      return;
    }

    // Determine the address to use
    let orderAddress: Address;
    if (deliveryMethod === 'pickup') {
      orderAddress = {
        id: 'pickup',
        name: 'Retirada na Loja',
        street: 'Av. Paulista, 1000 - Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        country: 'Brasil',
        isDefault: false,
      };
    } else if (useNewAddress || !isAuthenticated) {
      orderAddress = {
        id: 'guest-address',
        ...guestAddress,
        isDefault: false,
      };
    } else {
      orderAddress = selectedAddress!;
    }

    // Determine payment method
    const orderPayment = isAuthenticated && selectedPayment
      ? selectedPayment
      : {
          id: 'guest-payment',
          type: guestPaymentType,
          displayName: paymentOptions.find(p => p.type === guestPaymentType)?.label || 'Pagamento',
          label: paymentOptions.find(p => p.type === guestPaymentType)?.label || 'Pagamento',
          isDefault: false,
        };

    const deliveryOption = {
      method: deliveryMethod,
      scheduledDate: deliveryMethod === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: deliveryMethod === 'scheduled' ? scheduledTime : undefined,
    };

    const order = createOrder(
      items, 
      orderAddress, 
      orderPayment, 
      deliveryOption,
      appliedCoupon || undefined
    );
    clearCart();
    toast.success('Pedido realizado com sucesso!');
    navigate(`/orders/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      )}>
        <div className="text-center">
          <ShoppingBag className={cn(
            'h-16 w-16 mx-auto mb-4',
            isDark ? 'text-gray-600' : 'text-gray-300'
          )} />
          <p className={cn(
            'text-lg font-medium',
            isDark ? 'text-gray-400' : 'text-gray-500'
          )}>
            Seu carrinho está vazio
          </p>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen py-8',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className={cn(
            'inline-flex items-center space-x-2 mb-6 transition-colors',
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Continuar Comprando</span>
        </Link>

        <h1 className={cn(
          'text-3xl font-bold mb-8',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          Finalizar Compra
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Guest Info, Delivery, Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information - Only show for guests */}
            {!isAuthenticated && (
              <div className={cn(
                'rounded-xl p-6',
                isDark ? 'bg-gray-800' : 'bg-white'
              )}>
                <h2 className={cn(
                  'text-lg font-semibold mb-4 flex items-center',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  <User className="h-5 w-5 mr-2" />
                  Suas Informações
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={cn(
                      'block text-sm font-medium mb-2',
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Seu nome completo"
                      className={cn(
                        'w-full px-4 py-2 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      )}
                    />
                  </div>
                  <div>
                    <label className={cn(
                      'block text-sm font-medium mb-2',
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className={cn(
                        'w-full px-4 py-2 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      )}
                    />
                  </div>
                  <div>
                    <label className={cn(
                      'block text-sm font-medium mb-2',
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className={cn(
                        'w-full px-4 py-2 rounded-lg border transition-colors',
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      )}
                    />
                  </div>
                </div>

                <div className={cn(
                  'mt-4 p-3 rounded-lg flex items-start space-x-3',
                  isDark ? 'bg-indigo-900/30' : 'bg-indigo-50'
                )}>
                  <div className="text-indigo-500 mt-0.5">ℹ️</div>
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-indigo-300' : 'text-indigo-700'
                  )}>
                    Você está comprando como visitante. <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                      className="underline font-medium hover:no-underline"
                    >
                      Faça login
                    </button> para salvar seus pedidos e acessar benefícios exclusivos.
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Method */}
            <div className={cn(
              'rounded-xl p-6',
              isDark ? 'bg-gray-800' : 'bg-white'
            )}>
              <h2 className={cn(
                'text-lg font-semibold mb-4 flex items-center',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                <Truck className="h-5 w-5 mr-2" />
                Método de Entrega
              </h2>

              <div className="grid gap-4">
                {deliveryOptions.map((option) => {
                  const Icon = getDeliveryIcon(option.method);
                  return (
                    <label
                      key={option.method}
                      className={cn(
                        'flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors',
                        deliveryMethod === option.method
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === option.method}
                        onChange={() => setDeliveryMethod(option.method)}
                      />
                      <Icon className={cn(
                        'h-6 w-6',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      )} />
                      <div className="flex-1">
                        <p className={cn(
                          'font-medium',
                          isDark ? 'text-white' : 'text-gray-900'
                        )}>
                          {option.label}
                        </p>
                        <p className={cn(
                          'text-sm',
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {option.description}
                        </p>
                      </div>
                      {deliveryMethod === option.method && (
                        <Check className="h-5 w-5 text-indigo-500" />
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Scheduled Delivery Options */}
              {deliveryMethod === 'scheduled' && (
                <div className={cn(
                  'mt-4 pt-4 border-t',
                  isDark ? 'border-gray-700' : 'border-gray-200'
                )}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-2',
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Data da Entrega
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={today}
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border transition-colors',
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-2',
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Horário
                      </label>
                      <select
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border transition-colors',
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        )}
                      >
                        <option value="">Selecione um horário</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address - Only show for delivery methods */}
            {deliveryMethod !== 'pickup' && (
              <div className={cn(
                'rounded-xl p-6',
                isDark ? 'bg-gray-800' : 'bg-white'
              )}>
                <h2 className={cn(
                  'text-lg font-semibold mb-4 flex items-center',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  <MapPin className="h-5 w-5 mr-2" />
                  Endereço de Entrega
                </h2>

                {/* Toggle between saved and new address for authenticated users */}
                {isAuthenticated && addresses.length > 0 && (
                  <div className={cn(
                    'flex space-x-4 mb-4 pb-4 border-b',
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  )}>
                    <button
                      onClick={() => setUseNewAddress(false)}
                      className={cn(
                        'px-4 py-2 rounded-lg font-medium transition-colors',
                        !useNewAddress
                          ? 'bg-indigo-600 text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      Endereços Salvos
                    </button>
                    <button
                      onClick={() => setUseNewAddress(true)}
                      className={cn(
                        'px-4 py-2 rounded-lg font-medium transition-colors',
                        useNewAddress
                          ? 'bg-indigo-600 text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      Novo Endereço
                    </button>
                  </div>
                )}

                {/* Saved Addresses */}
                {isAuthenticated && !useNewAddress && addresses.length > 0 ? (
                  <div className="grid gap-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={cn(
                          'flex items-start space-x-4 p-4 rounded-lg border cursor-pointer transition-colors',
                          selectedAddressId === address.id
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={cn(
                              'font-medium',
                              isDark ? 'text-white' : 'text-gray-900'
                            )}>
                              {address.name}
                            </span>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                Padrão
                              </span>
                            )}
                          </div>
                          <p className={cn(
                            'text-sm mt-1',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            {address.street}<br />
                            {address.city}, {address.state} {address.zipCode}<br />
                            {address.country}
                          </p>
                        </div>
                        {selectedAddressId === address.id && (
                          <Check className="h-5 w-5 text-indigo-500" />
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  /* New Address Form */
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={cn(
                        'block text-sm font-medium mb-2',
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Endereço *
                      </label>
                      <input
                        type="text"
                        value={guestAddress.street}
                        onChange={(e) => setGuestAddress({ ...guestAddress, street: e.target.value })}
                        placeholder="Rua, número, complemento"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border transition-colors',
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-2',
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={guestAddress.city}
                        onChange={(e) => setGuestAddress({ ...guestAddress, city: e.target.value })}
                        placeholder="Cidade"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border transition-colors',
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-2',
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Estado *
                      </label>
                      <input
                        type="text"
                        value={guestAddress.state}
                        onChange={(e) => setGuestAddress({ ...guestAddress, state: e.target.value })}
                        placeholder="Estado"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border transition-colors',
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-2',
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        CEP *
                      </label>
                      <input
                        type="text"
                        value={guestAddress.zipCode}
                        onChange={(e) => setGuestAddress({ ...guestAddress, zipCode: e.target.value })}
                        placeholder="00000-000"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border transition-colors',
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-2',
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        País
                      </label>
                      <input
                        type="text"
                        value={guestAddress.country}
                        onChange={(e) => setGuestAddress({ ...guestAddress, country: e.target.value })}
                        placeholder="País"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border transition-colors',
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pickup Address - Only show for pickup */}
            {deliveryMethod === 'pickup' && (
              <div className={cn(
                'rounded-xl p-6',
                isDark ? 'bg-gray-800' : 'bg-white'
              )}>
                <h2 className={cn(
                  'text-lg font-semibold mb-4 flex items-center',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  <Store className="h-5 w-5 mr-2" />
                  Local de Retirada
                </h2>
                <div className={cn(
                  'p-4 rounded-lg border',
                  isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                )}>
                  <p className={cn(
                    'font-medium',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    ShopVerse - Loja Centro
                  </p>
                  <p className={cn(
                    'text-sm mt-1',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Av. Paulista, 1000 - Bela Vista<br />
                    São Paulo, SP - 01310-100<br />
                    Segunda a Sábado: 10h às 22h
                  </p>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className={cn(
              'rounded-xl p-6',
              isDark ? 'bg-gray-800' : 'bg-white'
            )}>
              <h2 className={cn(
                'text-lg font-semibold mb-4 flex items-center',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                <CreditCard className="h-5 w-5 mr-2" />
                Forma de Pagamento
              </h2>

              {/* Authenticated users with saved payment methods */}
              {isAuthenticated && paymentMethods.length > 0 ? (
                <div className="grid gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = getPaymentIcon(method.type);
                    return (
                      <label
                        key={method.id}
                        className={cn(
                          'flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors',
                          selectedPaymentId === method.id
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={selectedPaymentId === method.id}
                          onChange={() => setSelectedPaymentId(method.id)}
                        />
                        <Icon className={cn(
                          'h-8 w-8',
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        )} />
                        <div className="flex-1">
                          <p className={cn(
                            'font-medium',
                            isDark ? 'text-white' : 'text-gray-900'
                          )}>
                            {method.displayName}
                          </p>
                          {method.type === 'credit_card' && method.cardHolder && (
                            <p className={cn(
                              'text-sm',
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                              {method.cardHolder} • Expira em {method.expiryDate}
                            </p>
                          )}
                          {method.type === 'pix' && (
                            <p className={cn(
                              'text-sm',
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                              Transferência instantânea
                            </p>
                          )}
                          {method.type === 'cash' && (
                            <p className={cn(
                              'text-sm',
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                              Pagamento na entrega
                            </p>
                          )}
                        </div>
                        {selectedPaymentId === method.id && (
                          <Check className="h-5 w-5 text-indigo-500" />
                        )}
                      </label>
                    );
                  })}
                </div>
              ) : (
                /* Guest payment options */
                <div className="grid gap-4">
                  {paymentOptions.map((option) => {
                    const Icon = getPaymentIcon(option.type);
                    return (
                      <label
                        key={option.type}
                        className={cn(
                          'flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors',
                          guestPaymentType === option.type
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <input
                          type="radio"
                          name="guestPayment"
                          checked={guestPaymentType === option.type}
                          onChange={() => setGuestPaymentType(option.type)}
                        />
                        <Icon className={cn(
                          'h-8 w-8',
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        )} />
                        <div className="flex-1">
                          <p className={cn(
                            'font-medium',
                            isDark ? 'text-white' : 'text-gray-900'
                          )}>
                            {option.label}
                          </p>
                          <p className={cn(
                            'text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            {option.description}
                          </p>
                        </div>
                        {guestPaymentType === option.type && (
                          <Check className="h-5 w-5 text-indigo-500" />
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className={cn(
              'rounded-xl p-6 sticky top-24',
              isDark ? 'bg-gray-800' : 'bg-white'
            )}>
              <h2 className={cn(
                'text-lg font-semibold mb-4',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Resumo do Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${item.specialNotes}-${index}`}
                    className="flex space-x-3"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className={cn(
                        'font-medium text-sm',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        {item.product.name}
                      </p>
                      <p className={cn(
                        'text-xs',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        Qtd: {item.quantity}
                        {item.selectedSize && ` • ${item.selectedSize}`}
                        {item.selectedColor && ` • ${item.selectedColor}`}
                      </p>
                      {/* Special Notes for food items */}
                      {item.specialNotes && (
                        <p className={cn(
                          'text-xs mt-1 p-1.5 rounded',
                          isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'
                        )}>
                          📝 {item.specialNotes}
                        </p>
                      )}
                    </div>
                    <p className={cn(
                      'font-medium text-sm',
                      isDark ? 'text-gray-300' : 'text-gray-900'
                    )}>
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className={cn(
                'border-t pt-4 mb-4',
                isDark ? 'border-gray-700' : 'border-gray-200'
              )}>
                <h3 className={cn(
                  'text-sm font-semibold mb-3 flex items-center',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  <Tag className="h-4 w-4 mr-2" />
                  Cupom de Desconto
                </h3>

                {appliedCoupon ? (
                  <div className={cn(
                    'flex items-center justify-between p-3 rounded-lg',
                    isDark ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
                  )}>
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4 text-green-500" />
                      <div>
                        <p className={cn(
                          'font-medium text-sm',
                          isDark ? 'text-green-400' : 'text-green-700'
                        )}>
                          {appliedCoupon.code}
                        </p>
                        <p className={cn(
                          'text-xs',
                          isDark ? 'text-green-500' : 'text-green-600'
                        )}>
                          {appliedCoupon.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className={cn(
                        'p-1 rounded-full transition-colors',
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-green-100'
                      )}
                    >
                      <X className="h-4 w-4 text-green-500" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        placeholder="Digite o código"
                        className={cn(
                          'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                          couponError
                            ? 'border-red-500'
                            : isDark
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        )}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-500 mt-2">{couponError}</p>
                    )}
                    <p className={cn(
                      'text-xs mt-2',
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      Cupons disponíveis: BEMVINDO10, PROMO20, FRETE50, DESC25
                    </p>
                  </div>
                )}
              </div>

              <div className={cn(
                'border-t pt-4 space-y-2',
                isDark ? 'border-gray-700' : 'border-gray-200'
              )}>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Subtotal
                  </span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="text-green-500">
                      Desconto ({appliedCoupon.code})
                    </span>
                    <span className="text-green-500">
                      - R$ {discount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Frete
                  </span>
                  <span className="text-green-500">Grátis</span>
                </div>
                <div className={cn(
                  'flex justify-between pt-3 border-t font-semibold text-lg',
                  isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'
                )}>
                  <span>Total</span>
                  <span className={isDark ? 'text-indigo-400' : 'text-indigo-600'}>
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={
                  (deliveryMethod === 'scheduled' && (!scheduledDate || !scheduledTime))
                }
                className="w-full mt-6 py-3 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
