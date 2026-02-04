import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { useThemeStore } from '@/store/themeStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { cn } from '@/utils/cn';

interface FavoritesPageProps {
  onQuickView: (product: Product) => void;
}

export function FavoritesPage({ onQuickView }: FavoritesPageProps) {
  const { isDark } = useThemeStore();
  const { favorites } = useFavoritesStore();

  return (
    <div className={cn(
      'min-h-screen py-8',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={cn(
          'text-3xl font-bold mb-8',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          Meus Favoritos
        </h1>

        {favorites.length === 0 ? (
          <div className={cn(
            'text-center py-16 rounded-xl',
            isDark ? 'bg-gray-800' : 'bg-white'
          )}>
            <Heart className={cn(
              'h-16 w-16 mx-auto mb-4',
              isDark ? 'text-gray-600' : 'text-gray-300'
            )} />
            <p className={cn(
              'text-lg font-medium',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )}>
              Nenhum favorito ainda
            </p>
            <p className={cn(
              'text-sm mt-1',
              isDark ? 'text-gray-500' : 'text-gray-400'
            )}>
              Clique no ícone de coração nos produtos para adicioná-los aqui
            </p>
            <Link
              to="/"
              className="inline-block mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
