import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Filter } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { products } from '@/data/products';
import { cn } from '@/utils/cn';

// Mock reviews data
const generateMockReviews = (productId: string) => [
  {
    id: '1',
    productId,
    userName: 'Maria Santos',
    rating: 5,
    date: '2024-01-15',
    comment: 'Produto excelente! Superou minhas expectativas. A qualidade é incrível e chegou antes do prazo. Recomendo muito para quem está em dúvida. O acabamento é perfeito e o material é de primeira qualidade.',
    verified: true
  },
  {
    id: '2',
    productId,
    userName: 'João Pereira',
    rating: 4,
    date: '2024-01-10',
    comment: 'Muito bom, recomendo. Apenas o tamanho veio um pouco diferente do esperado, mas nada que comprometa. O produto em si é de ótima qualidade.',
    verified: true
  },
  {
    id: '3',
    productId,
    userName: 'Ana Costa',
    rating: 5,
    date: '2024-01-05',
    comment: 'Amei! Já é a segunda vez que compro e a qualidade continua impecável. Entrega super rápida e o produto veio muito bem embalado.',
    verified: true
  },
  {
    id: '4',
    productId,
    userName: 'Carlos Oliveira',
    rating: 3,
    date: '2024-01-03',
    comment: 'Produto ok, mas esperava um pouco mais pela qualidade. Atendeu às expectativas básicas mas poderia ser melhor.',
    verified: true
  },
  {
    id: '5',
    productId,
    userName: 'Fernanda Lima',
    rating: 5,
    date: '2023-12-28',
    comment: 'Simplesmente perfeito! Exatamente como nas fotos. A cor é linda e o material é muito resistente. Vale cada centavo investido.',
    verified: true
  },
  {
    id: '6',
    productId,
    userName: 'Roberto Silva',
    rating: 4,
    date: '2023-12-20',
    comment: 'Ótimo custo-benefício. O produto chegou bem embalado e corresponde à descrição. Recomendo a compra.',
    verified: false
  },
  {
    id: '7',
    productId,
    userName: 'Juliana Mendes',
    rating: 2,
    date: '2023-12-15',
    comment: 'Não gostei muito. A qualidade poderia ser melhor considerando o preço. O acabamento deixou a desejar em alguns detalhes.',
    verified: true
  },
  {
    id: '8',
    productId,
    userName: 'Pedro Almeida',
    rating: 5,
    date: '2023-12-10',
    comment: 'Excelente produto! Comprei para presentear e foi um sucesso. A pessoa amou! Com certeza comprarei novamente.',
    verified: true
  }
];

type SortOption = 'recent' | 'oldest' | 'highest' | 'lowest';

export function ProductReviewsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const product = products.find(p => p.id === productId);
  const allReviews = useMemo(() => generateMockReviews(productId || ''), [productId]);

  if (!product) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      )}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:underline"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  const filteredAndSortedReviews = useMemo(() => {
    let reviews = [...allReviews];

    // Filter by rating
    if (filterRating !== null) {
      reviews = reviews.filter(r => r.rating === filterRating);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        reviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        reviews.sort((a, b) => a.rating - b.rating);
        break;
    }

    return reviews;
  }, [allReviews, filterRating, sortBy]);

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(r => {
      dist[r.rating as keyof typeof dist]++;
    });
    return dist;
  }, [allReviews]);

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= rating ? 'text-yellow-400 fill-current' : isDark ? 'text-gray-600' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn(
      'min-h-screen pt-20 pb-12',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/?product=${productId}`)}
          className={cn(
            'flex items-center gap-2 mb-6 transition-colors',
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar ao Produto</span>
        </button>

        {/* Product Info */}
        <div className={cn(
          'rounded-xl p-6 mb-6',
          isDark ? 'bg-gray-800' : 'bg-white'
        )}>
          <div className="flex items-start gap-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h1 className={cn(
                'text-xl font-bold',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(Math.round(product.rating), 'md')}
                <span className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                  {product.rating}
                </span>
                <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                  ({product.reviews} avaliações)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Summary */}
        <div className={cn(
          'rounded-xl p-6 mb-6',
          isDark ? 'bg-gray-800' : 'bg-white'
        )}>
          <h2 className={cn(
            'text-lg font-semibold mb-4',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            Resumo das Avaliações
          </h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage = (count / allReviews.length) * 100;
              return (
                <button
                  key={rating}
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={cn(
                    'w-full flex items-center gap-3 py-1 px-2 rounded transition-colors',
                    filterRating === rating
                      ? isDark ? 'bg-gray-700' : 'bg-indigo-50'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex items-center gap-1 w-16">
                    <span className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
                      {rating}
                    </span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className={cn('text-sm w-8', isDark ? 'text-gray-400' : 'text-gray-500')}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          {filterRating !== null && (
            <button
              onClick={() => setFilterRating(null)}
              className="mt-3 text-sm text-indigo-600 hover:underline"
            >
              Limpar filtro
            </button>
          )}
        </div>

        {/* Sort and Filter */}
        <div className={cn(
          'rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-4',
          isDark ? 'bg-gray-800' : 'bg-white'
        )}>
          <div className="flex items-center gap-2">
            <Filter className={cn('h-5 w-5', isDark ? 'text-gray-400' : 'text-gray-500')} />
            <span className={cn('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
              {filteredAndSortedReviews.length} avaliações
            </span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className={cn(
              'px-4 py-2 rounded-lg border text-sm',
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            )}
          >
            <option value="recent">Mais Recentes</option>
            <option value="oldest">Mais Antigas</option>
            <option value="highest">Maior Nota</option>
            <option value="lowest">Menor Nota</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredAndSortedReviews.length === 0 ? (
            <div className={cn(
              'rounded-xl p-8 text-center',
              isDark ? 'bg-gray-800' : 'bg-white'
            )}>
              <p className={cn(isDark ? 'text-gray-400' : 'text-gray-500')}>
                Nenhuma avaliação encontrada com este filtro.
              </p>
            </div>
          ) : (
            filteredAndSortedReviews.map((review) => (
              <div
                key={review.id}
                className={cn(
                  'rounded-xl p-6',
                  isDark ? 'bg-gray-800' : 'bg-white'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'font-semibold',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        {review.userName}
                      </span>
                      {review.verified && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          Compra Verificada
                        </span>
                      )}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <span className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-400')}>
                    {new Date(review.date).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className={cn(
                  'leading-relaxed',
                  isDark ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
