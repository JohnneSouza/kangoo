import { useState } from 'react';
import { Heart, Plus, Minus, Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { isDark } = useThemeStore();
  const { addToCart } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 0) {
      addToCart(product, quantity);
      toast.success(`${product.name} adicionado ao carrinho`);
      setQuantity(1);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = parseInt(e.target.value) || 0;
    setQuantity(Math.max(0, Math.min(value, product.stock)));
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className={cn(
        'group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl',
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10',
            isFavorite(product.id)
              ? 'bg-red-500 text-white'
              : isDark
                ? 'bg-gray-900/50 text-white hover:bg-red-500'
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          )}
        >
          <Heart
            className={cn('h-5 w-5', isFavorite(product.id) && 'fill-current')}
          />
        </button>

        {/* Sale Badge */}
        {product.onSale && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
            PROMOÇÃO
          </div>
        )}

        {/* Food badge removed - dietary info shown in QuickView modal */}
      </div>

      {/* Content */}
      <div className="p-4 cursor-pointer">
        <h3 className={cn(
          'font-semibold text-lg line-clamp-1 mb-1',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          {product.name}
        </h3>
        
        {/* Rating - on its own row */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current flex-shrink-0" />
          <span className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
            {product.rating}
          </span>
          <span className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-400')}>
            ({product.reviews} avaliações)
          </span>
        </div>

        <p className={cn(
          'text-sm line-clamp-2 mb-3',
          isDark ? 'text-gray-400' : 'text-gray-600'
        )}>
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className={cn(
            'text-xl font-bold',
            isDark ? 'text-indigo-400' : 'text-indigo-600'
          )}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <span className={cn(
            'text-xs',
            isDark ? 'text-gray-500' : 'text-gray-400'
          )}>
            {product.stock} em estoque
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 mb-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuantity(Math.max(0, quantity - 1));
            }}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            onClick={(e) => e.stopPropagation()}
            min="0"
            max={product.stock}
            className={cn(
              'w-16 text-center py-2 rounded-lg border',
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            )}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuantity(Math.min(product.stock, quantity + 1));
            }}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={quantity === 0}
          className={cn(
            'w-full py-2.5 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors',
            'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Adicionar ao Carrinho</span>
        </button>
      </div>
    </div>
  );
}
