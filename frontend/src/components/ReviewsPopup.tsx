import { useRef, useEffect } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';

interface ReviewsPopupProps {
  product: Product;
  onClose: () => void;
  onViewAll: () => void;
}

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    userName: 'Maria S.',
    rating: 5,
    date: '2024-01-15',
    comment: 'Produto excelente! Superou minhas expectativas. A qualidade é incrível e chegou antes do prazo.',
    verified: true
  },
  {
    id: '2',
    userName: 'João P.',
    rating: 4,
    date: '2024-01-10',
    comment: 'Muito bom, recomendo. Apenas o tamanho veio um pouco diferente do esperado.',
    verified: true
  },
  {
    id: '3',
    userName: 'Ana C.',
    rating: 5,
    date: '2024-01-05',
    comment: 'Amei! Já é a segunda vez que compro e a qualidade continua impecável.',
    verified: true
  }
];

export function ReviewsPopup({ product, onClose, onViewAll }: ReviewsPopupProps) {
  const { isDark } = useThemeStore();
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4',
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      ref={popupRef}
      className={cn(
        'absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl border z-50 animate-fade-in',
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className={cn(
        'p-4 border-b',
        isDark ? 'border-gray-700' : 'border-gray-200'
      )}>
        <h3 className={cn(
          'font-semibold text-lg',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          Avaliações
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-gray-900')}>
              {product.rating}
            </span>
          </div>
          <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
            ({product.reviews} avaliações)
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-h-64 overflow-y-auto">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className={cn(
              'p-4 border-b last:border-b-0',
              isDark ? 'border-gray-700' : 'border-gray-100'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'font-medium text-sm',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {review.userName}
                </span>
                {review.verified && (
                  <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                    Verificado
                  </span>
                )}
              </div>
              <span className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
                {new Date(review.date).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {renderStars(review.rating)}
            <p className={cn(
              'text-sm mt-2 line-clamp-2',
              isDark ? 'text-gray-300' : 'text-gray-600'
            )}>
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={cn(
        'p-3 border-t',
        isDark ? 'border-gray-700' : 'border-gray-200'
      )}>
        <button
          onClick={onViewAll}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors',
            isDark
              ? 'text-indigo-400 hover:bg-gray-700'
              : 'text-indigo-600 hover:bg-indigo-50'
          )}
        >
          Ver todas as avaliações
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
