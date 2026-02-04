import { Link } from 'react-router-dom';
import { Package, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useOrderStore } from '@/store/orderStore';
import { cn } from '@/utils/cn';

export function OrdersPage() {
  const { isDark } = useThemeStore();
  const { orders } = useOrderStore();

  return (
    <div className={cn(
      'min-h-screen py-8',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={cn(
          'text-3xl font-bold mb-8',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          Meus Pedidos
        </h1>

        {orders.length === 0 ? (
          <div className={cn(
            'text-center py-16 rounded-xl',
            isDark ? 'bg-gray-800' : 'bg-white'
          )}>
            <Package className={cn(
              'h-16 w-16 mx-auto mb-4',
              isDark ? 'text-gray-600' : 'text-gray-300'
            )} />
            <p className={cn(
              'text-lg font-medium',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )}>
              Nenhum pedido ainda
            </p>
            <p className={cn(
              'text-sm mt-1',
              isDark ? 'text-gray-500' : 'text-gray-400'
            )}>
              Comece a comprar para ver seus pedidos aqui
            </p>
            <Link
              to="/"
              className="inline-block mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className={cn(
                  'block rounded-xl p-6 transition-all hover:shadow-lg',
                  isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-md'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={cn(
                      'font-semibold',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}>
                      Pedido {order.id}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={cn(
                        'flex items-center text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className={cn(
                        'flex items-center text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        <MapPin className="h-4 w-4 mr-1" />
                        {order.address.city}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={cn(
                        'inline-block px-3 py-1 text-sm font-medium rounded-full',
                        order.status === 'Confirmado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      )}>
                        {order.status}
                      </span>
                      <p className={cn(
                        'text-lg font-bold mt-1',
                        isDark ? 'text-indigo-400' : 'text-indigo-600'
                      )}>
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      'h-5 w-5',
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    )} />
                  </div>
                </div>

                <div className="flex -space-x-2">
                  {order.items.slice(0, 4).map((item, index) => (
                    <img
                      key={index}
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover border-2 border-white dark:border-gray-800"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium border-2',
                      isDark
                        ? 'bg-gray-700 border-gray-800 text-gray-300'
                        : 'bg-gray-100 border-white text-gray-600'
                    )}>
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
