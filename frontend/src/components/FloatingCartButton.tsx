import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';

interface FloatingCartButtonProps {
  onClick: () => void;
}

export function FloatingCartButton({ onClick }: FloatingCartButtonProps) {
  const { isDark } = useThemeStore();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110',
        isDark
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      )}
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
