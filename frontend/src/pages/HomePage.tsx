import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { products } from '@/data/products';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';

interface HomePageProps {
  searchQuery: string;
  onQuickView: (product: Product) => void;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  showOnSale: boolean;
  onClearFilters: () => void;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'rating-asc';

const categoryNames: Record<string, string> = {
  electronics: 'Eletrônicos',
  fashion: 'Moda',
  home: 'Casa & Decoração',
  sports: 'Esportes',
  beauty: 'Beleza & Saúde',
  books: 'Livros',
};

const subcategoryNames: Record<string, Record<string, string>> = {
  electronics: {
    smartphones: 'Smartphones',
    laptops: 'Notebooks',
    tablets: 'Tablets',
    accessories: 'Acessórios',
    audio: 'Áudio',
  },
  fashion: {
    mens: 'Masculino',
    womens: 'Feminino',
    kids: 'Infantil',
    shoes: 'Calçados',
    accessories: 'Acessórios',
  },
  home: {
    furniture: 'Móveis',
    decoration: 'Decoração',
    kitchen: 'Cozinha',
    bathroom: 'Banheiro',
    garden: 'Jardim',
  },
  sports: {
    fitness: 'Fitness',
    outdoor: 'Ar Livre',
    'team-sports': 'Esportes Coletivos',
    'water-sports': 'Esportes Aquáticos',
  },
  beauty: {
    skincare: 'Cuidados com a Pele',
    makeup: 'Maquiagem',
    hair: 'Cabelo',
    perfume: 'Perfumaria',
  },
  books: {
    fiction: 'Ficção',
    'non-fiction': 'Não-Ficção',
    technical: 'Técnicos',
    kids: 'Infantil',
  },
};

export function HomePage({ 
  searchQuery, 
  onQuickView, 
  selectedCategory, 
  selectedSubcategory, 
  showOnSale,
  onClearFilters 
}: HomePageProps) {
  const { isDark } = useThemeStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Check for product parameter in URL and open QuickView modal
  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        onQuickView(product);
        // Remove the product param from URL after opening
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, setSearchParams, onQuickView]);

  const sortOptions = [
    { value: 'default', label: 'Padrão' },
    { value: 'price-asc', label: 'Preço: Menor para Maior' },
    { value: 'price-desc', label: 'Preço: Maior para Menor' },
    { value: 'rating-desc', label: 'Avaliação: Maior para Menor' },
    { value: 'rating-asc', label: 'Avaliação: Menor para Maior' },
  ];

  const hasActiveFilters = selectedCategory || selectedSubcategory || showOnSale;

  const getFilterTitle = () => {
    if (showOnSale) return 'Promoções';
    if (selectedCategory && selectedSubcategory) {
      const catName = categoryNames[selectedCategory] || selectedCategory;
      const subName = subcategoryNames[selectedCategory]?.[selectedSubcategory] || selectedSubcategory;
      return `${catName} > ${subName}`;
    }
    if (selectedCategory) {
      return categoryNames[selectedCategory] || selectedCategory;
    }
    return 'Todos os Produtos';
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
    }

    // Filter by sale
    if (showOnSale) {
      result = result.filter((p) => p.onSale);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        result.sort((a, b) => a.rating - b.rating);
        break;
    }

    return result;
  }, [searchQuery, sortBy, selectedCategory, selectedSubcategory, showOnSale]);

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      {/* Hero Section */}
      <div className={cn(
        'relative overflow-hidden',
        isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Descubra Seu Estilo
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
              Explore nossa coleção exclusiva de produtos premium projetados para a vida moderna
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className={cn(
                'text-2xl font-bold',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {searchQuery ? `Resultados para "${searchQuery}"` : getFilterTitle()}
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className={cn(
                    'flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors',
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  )}
                >
                  <X className="h-3 w-3" />
                  <span>Limpar</span>
                </button>
              )}
            </div>
            <p className={cn(
              'text-sm mt-1',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )}>
              {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors',
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Ordenar por: {sortOptions.find((o) => o.value === sortBy)?.label}</span>
              <ChevronDown className={cn(
                'h-4 w-4 transition-transform',
                isSortOpen && 'rotate-180'
              )} />
            </button>

            {isSortOpen && (
              <div className={cn(
                'absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 z-10',
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              )}>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value as SortOption);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-4 py-2 transition-colors',
                      sortBy === option.value
                        ? isDark
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-50 text-indigo-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className={cn(
              'text-lg',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )}>
              Nenhum produto encontrado para sua busca.
            </p>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ver todos os produtos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
