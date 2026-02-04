import { useNavigate } from 'react-router-dom';
import { CheckCircle, LogIn, ShoppingBag } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';

export function ActivationSuccessPage() {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center p-4',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="text-center max-w-md">
        {/* Success Animation */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Animated rings */}
          <div className={cn(
            'absolute inset-0 rounded-full animate-ping opacity-20',
            'bg-green-500'
          )} />
          <div className={cn(
            'absolute inset-2 rounded-full animate-ping opacity-30 animation-delay-150',
            'bg-green-500'
          )} />
          {/* Main circle */}
          <div className={cn(
            'absolute inset-4 rounded-full flex items-center justify-center',
            'bg-green-500 shadow-lg shadow-green-500/30'
          )}>
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className={cn(
          'text-3xl font-bold mb-4',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          Conta Ativada com Sucesso!
        </h1>

        {/* Description */}
        <p className={cn(
          'text-lg mb-2',
          isDark ? 'text-gray-300' : 'text-gray-600'
        )}>
          Parabéns! Sua conta foi verificada e ativada.
        </p>
        <p className={cn(
          'mb-8',
          isDark ? 'text-gray-400' : 'text-gray-500'
        )}>
          Agora você pode fazer login e aproveitar todos os recursos da nossa plataforma, 
          incluindo compras, favoritos e acompanhamento de pedidos.
        </p>

        {/* Features List */}
        <div className={cn(
          'rounded-xl p-6 mb-8 text-left',
          isDark ? 'bg-gray-800' : 'bg-white shadow-md'
        )}>
          <h3 className={cn(
            'font-semibold mb-4',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            Com sua conta você pode:
          </h3>
          <ul className="space-y-3">
            {[
              'Salvar produtos favoritos',
              'Acompanhar seus pedidos',
              'Gerenciar endereços de entrega',
              'Salvar formas de pagamento',
              'Receber ofertas exclusivas'
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <span className={cn(
                  'text-sm',
                  isDark ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className={cn(
              'flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Explorar Produtos</span>
          </button>
          <button
            onClick={() => {
              navigate('/');
              // Trigger login modal - we'll dispatch a custom event
              window.dispatchEvent(new CustomEvent('open-auth-modal'));
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <LogIn className="h-5 w-5" />
            <span>Fazer Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
