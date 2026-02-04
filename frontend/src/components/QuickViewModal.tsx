import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Plus, Minus, Star, ShoppingCart, ChevronLeft, ChevronRight, MessageSquare, Leaf, Wheat, Flame, Droplets, AlertTriangle, Scale, Clock } from 'lucide-react';
import { Product } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import ColorSelector from './ColorSelector';
import { ReviewsPopup } from './ReviewsPopup';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();
  const { addToCart } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviews, setShowReviews] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');

  // Effect to change image when color is selected
  useEffect(() => {
    if (product && selectedColor && product.colorImages) {
      const colorImage = product.colorImages.find(ci => ci.color === selectedColor);
      if (colorImage && colorImage.imageIndex < product.images.length) {
        setCurrentImageIndex(colorImage.imageIndex);
      }
    }
  }, [selectedColor, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity, selectedSize, selectedColor, specialNotes || undefined);
      toast.success(`${product.name} adicionado ao carrinho`);
      onClose();
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleViewAllReviews = () => {
    onClose();
    navigate(`/product/${product.id}/reviews`);
  };

  const handleRatingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReviews(true);
  };

  const handleImageClick = () => {
    setShowLightbox(true);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={cn(
          'relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl',
          isDark ? 'bg-gray-800' : 'bg-white'
        )}>
          {/* Header with close button */}
          <div className={cn(
            'sticky top-0 z-20 flex justify-between items-center p-4 border-b',
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <h2 className={cn(
              'text-lg font-semibold',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Detalhes do Produto
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-full transition-colors',
                isDark ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'
              )}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {/* Click hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
                  <span className="text-white opacity-0 hover:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                    Clique para ampliar
                  </span>
                </div>

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className={cn(
                        'absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors',
                        isDark ? 'bg-gray-900/70 hover:bg-gray-900 text-white' : 'bg-white/70 hover:bg-white text-gray-900'
                      )}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className={cn(
                        'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors',
                        isDark ? 'bg-gray-900/70 hover:bg-gray-900 text-white' : 'bg-white/70 hover:bg-white text-gray-900'
                      )}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                        currentImageIndex === index
                          ? 'border-indigo-500'
                          : isDark ? 'border-gray-700' : 'border-gray-200'
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    'text-sm font-medium px-3 py-1 rounded-full',
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  )}>
                    {product.category}
                  </span>
                  {/* Clickable Rating */}
                  <div className="relative">
                    <button
                      onClick={handleRatingClick}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-lg transition-colors',
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      )}
                    >
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                        {product.rating}
                      </span>
                      <span className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                        ({product.reviews})
                      </span>
                      <MessageSquare className={cn('h-4 w-4 ml-1', isDark ? 'text-gray-400' : 'text-gray-500')} />
                    </button>
                    
                    {/* Reviews Popup */}
                    {showReviews && (
                      <ReviewsPopup
                        product={product}
                        onClose={() => setShowReviews(false)}
                        onViewAll={handleViewAllReviews}
                      />
                    )}
                  </div>
                </div>
                <h2 className={cn(
                  'text-2xl font-bold mb-2',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {product.name}
                </h2>
                <p className={cn(
                  'text-lg',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {product.description}
                </p>
              </div>

              {/* Food Product Information */}
              {product.isFood && product.foodInfo && (
                <div className={cn(
                  'rounded-xl p-4 space-y-4',
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                )}>
                  {/* Dietary Badges */}
                  <div className="flex flex-wrap gap-2">
                    {product.foodInfo.isVegan && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                        <Leaf className="h-4 w-4" />
                        Vegano
                      </span>
                    )}
                    {product.foodInfo.isVegetarian && !product.foodInfo.isVegan && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                        <Leaf className="h-4 w-4" />
                        Vegetariano
                      </span>
                    )}
                    {product.foodInfo.isGlutenFree && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                        <Wheat className="h-4 w-4" />
                        Sem Glúten
                      </span>
                    )}
                    {product.foodInfo.isLactoseFree && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                        <Droplets className="h-4 w-4" />
                        Sem Lactose
                      </span>
                    )}
                    {product.foodInfo.isSugarFree && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
                        🍬 Sem Açúcar
                      </span>
                    )}
                    {product.foodInfo.isOrganic && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        🌱 Orgânico
                      </span>
                    )}
                    {product.foodInfo.spicyLevel !== undefined && product.foodInfo.spicyLevel > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                        <Flame className="h-4 w-4" />
                        Picante: {product.foodInfo.spicyLevel === 1 ? 'Leve 🌶️' : product.foodInfo.spicyLevel === 2 ? 'Médio 🌶️🌶️' : 'Forte 🌶️🌶️🌶️'}
                      </span>
                    )}
                  </div>

                  {/* Weight and Expiration */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {product.foodInfo.weight && (
                      <div className={cn('flex items-center gap-1.5', isDark ? 'text-gray-300' : 'text-gray-600')}>
                        <Scale className="h-4 w-4" />
                        <span>Peso: <strong>{product.foodInfo.weight}</strong></span>
                      </div>
                    )}
                    {product.foodInfo.expirationDays && (
                      <div className={cn('flex items-center gap-1.5', isDark ? 'text-gray-300' : 'text-gray-600')}>
                        <Clock className="h-4 w-4" />
                        <span>Validade: <strong>{product.foodInfo.expirationDays} dias</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Nutritional Information */}
                  <div>
                    <h4 className={cn('text-sm font-semibold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                      Informação Nutricional <span className="font-normal text-gray-500">({product.foodInfo.nutritionalInfo.servingSize})</span>
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      <div className={cn('text-center p-2 rounded-lg', isDark ? 'bg-gray-600' : 'bg-white')}>
                        <div className={cn('text-lg font-bold', isDark ? 'text-indigo-400' : 'text-indigo-600')}>
                          {product.foodInfo.nutritionalInfo.calories}
                        </div>
                        <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>kcal</div>
                      </div>
                      {product.foodInfo.nutritionalInfo.protein !== undefined && (
                        <div className={cn('text-center p-2 rounded-lg', isDark ? 'bg-gray-600' : 'bg-white')}>
                          <div className={cn('text-lg font-bold', isDark ? 'text-green-400' : 'text-green-600')}>
                            {product.foodInfo.nutritionalInfo.protein}g
                          </div>
                          <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>Proteína</div>
                        </div>
                      )}
                      {product.foodInfo.nutritionalInfo.carbs !== undefined && (
                        <div className={cn('text-center p-2 rounded-lg', isDark ? 'bg-gray-600' : 'bg-white')}>
                          <div className={cn('text-lg font-bold', isDark ? 'text-amber-400' : 'text-amber-600')}>
                            {product.foodInfo.nutritionalInfo.carbs}g
                          </div>
                          <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>Carbos</div>
                        </div>
                      )}
                      {product.foodInfo.nutritionalInfo.fat !== undefined && (
                        <div className={cn('text-center p-2 rounded-lg', isDark ? 'bg-gray-600' : 'bg-white')}>
                          <div className={cn('text-lg font-bold', isDark ? 'text-red-400' : 'text-red-600')}>
                            {product.foodInfo.nutritionalInfo.fat}g
                          </div>
                          <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>Gordura</div>
                        </div>
                      )}
                      {product.foodInfo.nutritionalInfo.fiber !== undefined && (
                        <div className={cn('text-center p-2 rounded-lg', isDark ? 'bg-gray-600' : 'bg-white')}>
                          <div className={cn('text-lg font-bold', isDark ? 'text-emerald-400' : 'text-emerald-600')}>
                            {product.foodInfo.nutritionalInfo.fiber}g
                          </div>
                          <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>Fibra</div>
                        </div>
                      )}
                      {product.foodInfo.nutritionalInfo.sodium !== undefined && (
                        <div className={cn('text-center p-2 rounded-lg', isDark ? 'bg-gray-600' : 'bg-white')}>
                          <div className={cn('text-lg font-bold', isDark ? 'text-blue-400' : 'text-blue-600')}>
                            {product.foodInfo.nutritionalInfo.sodium}mg
                          </div>
                          <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>Sódio</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className={cn('text-sm font-semibold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                      Ingredientes
                    </h4>
                    <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
                      {product.foodInfo.ingredients.join(', ')}.
                    </p>
                  </div>

                  {/* Allergens */}
                  {product.foodInfo.allergens && product.foodInfo.allergens.length > 0 && (
                    <div className={cn(
                      'flex items-start gap-2 p-3 rounded-lg',
                      isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'
                    )}>
                      <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className={cn('text-sm font-semibold', isDark ? 'text-yellow-400' : 'text-yellow-700')}>
                          Contém Alérgenos
                        </h4>
                        <p className={cn('text-sm', isDark ? 'text-yellow-300' : 'text-yellow-600')}>
                          {product.foodInfo.allergens.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={cn(
                'text-3xl font-bold',
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              )}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-2',
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    Tamanho
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          'px-4 py-2 rounded-lg border transition-colors',
                          selectedSize === size
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : isDark
                              ? 'border-gray-600 text-gray-300 hover:border-indigo-500'
                              : 'border-gray-300 text-gray-700 hover:border-indigo-500'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-3',
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    Cor
                  </label>
                  <ColorSelector
                    colors={product.colors}
                    selectedColor={selectedColor || ''}
                    onColorSelect={handleColorSelect}
                    size="md"
                    showSelectedName={true}
                  />
                </div>
              )}

              {/* Quantity Controls */}
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Quantidade
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={cn(
                      'p-3 rounded-lg transition-colors',
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(value, product.stock)));
                    }}
                    min="1"
                    max={product.stock}
                    className={cn(
                      'w-20 text-center py-3 rounded-lg border text-lg font-medium',
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    )}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className={cn(
                      'p-3 rounded-lg transition-colors',
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  <span className={cn(
                    'text-sm',
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {product.stock} disponíveis
                  </span>
                </div>
              </div>

              {/* Special Notes for Food Products */}
              {product.isFood && (
                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-2',
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Observações do Pedido
                  </label>
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Ex: Sem cebola, sem alho, pouco sal, bem passado..."
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border text-sm resize-none',
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    )}
                    rows={3}
                  />
                  <p className={cn(
                    'text-xs mt-1',
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    Informe restrições alimentares, preferências de preparo ou qualquer observação sobre o produto
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Adicionar ao Carrinho</span>
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={cn(
                    'p-3 rounded-lg transition-colors',
                    isFavorite(product.id)
                      ? 'bg-red-500 text-white'
                      : isDark
                        ? 'bg-gray-700 hover:bg-red-500 text-white'
                        : 'bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700'
                  )}
                >
                  <Heart className={cn('h-6 w-6', isFavorite(product.id) && 'fill-current')} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setShowLightbox(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Navigation Arrows */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
            {currentImageIndex + 1} / {product.images.length}
          </div>

          {/* Thumbnails at bottom */}
          {product.images.length > 1 && (
            <div 
              className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2"
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'w-12 h-12 rounded-lg overflow-hidden border-2 transition-all',
                    currentImageIndex === index
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
