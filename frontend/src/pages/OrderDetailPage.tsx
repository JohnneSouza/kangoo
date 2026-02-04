import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CheckCircle, CreditCard, QrCode, Banknote } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useOrderStore } from '@/store/orderStore';
import { PaymentType } from '@/types';
import { cn } from '@/utils/cn';

export function OrderDetailPage() {
  const { isDark } = useThemeStore();
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrderStore();
  const order = orderId ? getOrderById(orderId) : undefined;

  const getPaymentIcon = (type?: PaymentType) => {
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

  if (!order) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      )}>
        <div className="text-center">
          <Package className={cn(
            'h-16 w-16 mx-auto mb-4',
            isDark ? 'text-gray-600' : 'text-gray-300'
          )} />
          <p className={cn(
            'text-lg',
            isDark ? 'text-gray-400' : 'text-gray-500'
          )}>
            Pedido não encontrado
          </p>
          <Link
            to="/orders"
            className="inline-block mt-4 text-indigo-500 hover:text-indigo-600"
          >
            Voltar para Pedidos
          </Link>
        </div>
      </div>
    );
  }

  const PaymentIcon = getPaymentIcon(order.paymentMethod?.type);

  return (
    <div className={cn(
      'min-h-screen py-8',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/orders"
          className={cn(
            'inline-flex items-center space-x-2 mb-6 transition-colors',
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar para Pedidos</span>
        </Link>

        {/* Success Banner */}
        <div className={cn(
          'rounded-xl p-6 mb-6',
          isDark ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
        )}>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <h2 className={cn(
                'text-lg font-semibold',
                isDark ? 'text-green-400' : 'text-green-800'
              )}>
                Pedido Confirmado!
              </h2>
              <p className={cn(
                'text-sm',
                isDark ? 'text-green-300' : 'text-green-600'
              )}>
                Obrigado pela sua compra. Seu pedido foi realizado com sucesso.
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className={cn(
          'rounded-xl p-6 mb-6',
          isDark ? 'bg-gray-800' : 'bg-white'
        )}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={cn(
                'text-2xl font-bold',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Pedido {order.id}
              </h1>
              <p className={cn(
                'text-sm mt-1',
                isDark ? 'text-gray-400' : 'text-gray-500'
              )}>
                Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className={cn(
              'px-4 py-2 rounded-full text-sm font-medium',
              order.status === 'Confirmado'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            )}>
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h3 className={cn(
              'font-semibold',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              Itens ({order.items.length})
            </h3>
            {order.items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'flex space-x-4 p-4 rounded-lg',
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                )}
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className={cn(
                    'font-medium',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    {item.product.name}
                  </h4>
                  {(item.selectedSize || item.selectedColor) && (
                    <p className={cn(
                      'text-sm',
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {item.selectedSize && `Tamanho: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && ' | '}
                      {item.selectedColor && `Cor: ${item.selectedColor}`}
                    </p>
                  )}
                  {/* Special Notes for food items */}
                  {item.specialNotes && (
                    <div className={cn(
                      'mt-2 p-2 rounded-lg text-sm',
                      isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'
                    )}>
                      <span className="font-medium">📝 Observações:</span> {item.specialNotes}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn(
                      'text-sm',
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      Qtd: {item.quantity}
                    </span>
                    <span className={cn(
                      'font-medium',
                      isDark ? 'text-indigo-400' : 'text-indigo-600'
                    )}>
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className={cn(
          'rounded-xl p-6 mb-6',
          isDark ? 'bg-gray-800' : 'bg-white'
        )}>
          <h3 className={cn(
            'font-semibold mb-4 flex items-center',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            <MapPin className="h-5 w-5 mr-2" />
            Endereço de Entrega
          </h3>
          <div className={cn(
            'text-sm',
            isDark ? 'text-gray-300' : 'text-gray-600'
          )}>
            <p className="font-medium">{order.address.name}</p>
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
            <p>{order.address.country}</p>
          </div>
        </div>

        {/* Payment Method */}
        {order.paymentMethod && (
          <div className={cn(
            'rounded-xl p-6 mb-6',
            isDark ? 'bg-gray-800' : 'bg-white'
          )}>
            <h3 className={cn(
              'font-semibold mb-4 flex items-center',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              <PaymentIcon className="h-5 w-5 mr-2" />
              Forma de Pagamento
            </h3>
            <div className={cn(
              'text-sm',
              isDark ? 'text-gray-300' : 'text-gray-600'
            )}>
              <p className="font-medium">{order.paymentMethod.displayName}</p>
              {order.paymentMethod.type === 'credit_card' && order.paymentMethod.cardHolder && (
                <p>{order.paymentMethod.cardHolder}</p>
              )}
              {order.paymentMethod.type === 'pix' && (
                <p>Pagamento via PIX</p>
              )}
              {order.paymentMethod.type === 'cash' && (
                <p>Pagamento em dinheiro na entrega</p>
              )}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className={cn(
          'rounded-xl p-6',
          isDark ? 'bg-gray-800' : 'bg-white'
        )}>
          <h3 className={cn(
            'font-semibold mb-4',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            Resumo do Pedido
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Subtotal
              </span>
              <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>
                R$ {(order.subtotal || order.total + (order.discount || 0)).toFixed(2).replace('.', ',')}
              </span>
            </div>
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-green-500">
                  Desconto {order.couponCode && `(${order.couponCode})`}
                </span>
                <span className="text-green-500">
                  - R$ {order.discount.toFixed(2).replace('.', ',')}
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
                R$ {order.total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
