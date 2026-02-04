import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/utils/cn';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { isDark } = useThemeStore();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed top-0 right-0 h-full w-full max-w-md z-[50] transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full',
        isDark ? 'bg-gray-900' : 'bg-white'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            'flex items-center justify-between p-4 border-b',
            isDark ? 'border-gray-700' : 'border-gray-200'
          )}>
            <h2 className={cn(
              'text-xl font-bold flex items-center space-x-2',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              <ShoppingBag className="h-6 w-6" />
              <span>Seu Carrinho</span>
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-full transition-colors',
                isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className={cn(
                  'h-16 w-16 mb-4',
                  isDark ? 'text-gray-600' : 'text-gray-300'
                )} />
                <p className={cn(
                  'text-lg font-medium',
                  isDark ? 'text-gray-400' : 'text-gray-500'
                )}>
                  Seu carrinho está vazio
                </p>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-gray-500' : 'text-gray-400'
                )}>
                  Adicione produtos para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${item.specialNotes}-${index}`}
                    className={cn(
                      'flex space-x-4 p-4 rounded-xl',
                      isDark ? 'bg-gray-800' : 'bg-gray-50'
                    )}
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className={cn(
                        'font-medium',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        {item.product.name}
                      </h3>
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
                      {/* Special Notes for food products */}
                      {item.specialNotes && (
                        <div className={cn(
                          'mt-1 p-2 rounded-lg text-xs',
                          isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-700'
                        )}>
                          <span className="font-medium">📝 Obs:</span> {item.specialNotes}
                        </div>
                      )}
                      <p className={cn(
                        'font-medium mt-1',
                        isDark ? 'text-indigo-400' : 'text-indigo-600'
                      )}>
                        R$ {item.product.price.toFixed(2).replace('.', ',')}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor, item.specialNotes)}
                            className={cn(
                              'p-1 rounded transition-colors',
                              isDark
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            )}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className={cn(
                            'w-8 text-center font-medium',
                            isDark ? 'text-white' : 'text-gray-900'
                          )}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor, item.specialNotes)}
                            className={cn(
                              'p-1 rounded transition-colors',
                              isDark
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            )}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor, item.specialNotes)}
                          className="p-1 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className={cn(
              'p-4 border-t',
              isDark ? 'border-gray-700' : 'border-gray-200'
            )}>
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  'text-lg font-medium',
                  isDark ? 'text-gray-300' : 'text-gray-600'
                )}>
                  Total
                </span>
                <span className={cn(
                  'text-2xl font-bold',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Finalizar Compra
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
