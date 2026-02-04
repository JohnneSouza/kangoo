import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';

export function ErrorPage() {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center p-4',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className={cn(
          'w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center',
          isDark ? 'bg-red-900/30' : 'bg-red-100'
        )}>
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>

        {/* 404 Text */}
        <h1 className={cn(
          'text-7xl font-bold mb-4',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          404
        </h1>

        <h2 className={cn(
          'text-2xl font-semibold mb-4',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          Página Não Encontrada
        </h2>

        <p className={cn(
          'mb-8',
          isDark ? 'text-gray-400' : 'text-gray-600'
        )}>
          Desculpe, a página que você está procurando não existe ou foi movida. 
          Verifique se o endereço está correto ou volte para a página inicial.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className={cn(
              'flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            )}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Página Inicial</span>
          </button>
        </div>
      </div>
    </div>
  );
}
