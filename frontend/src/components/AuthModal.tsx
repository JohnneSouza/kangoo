import { useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { isDark } = useThemeStore();
  const { login, signup, isLoading } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const result = isLoginMode
      ? await login(email, password)
      : await signup(email, password);

    if (result.success) {
      toast.success(isLoginMode ? 'Bem-vindo de volta!' : 'Conta criada com sucesso!');
      onClose();
      setEmail('');
      setPassword('');
    } else {
      toast.error(result.error || 'Ocorreu um erro');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        'relative w-full max-w-md rounded-2xl shadow-2xl p-8',
        isDark ? 'bg-gray-800' : 'bg-white'
      )}>
        <button
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4 p-2 rounded-full transition-colors',
            isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className={cn(
          'text-2xl font-bold text-center mb-6',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          {isLoginMode ? 'Bem-vindo de Volta' : 'Criar Conta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={cn(
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              E-mail
            </label>
            <div className="relative">
              <Mail className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-lg border transition-colors',
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500'
                )}
              />
            </div>
          </div>

          <div>
            <label className={cn(
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              Senha
            </label>
            <div className="relative">
              <Lock className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-lg border transition-colors',
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500'
                )}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center',
              'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              isLoginMode ? 'Entrar' : 'Criar Conta'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
            {isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="ml-1 text-indigo-500 hover:text-indigo-600 font-medium"
            >
              {isLoginMode ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
