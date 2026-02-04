import { useState } from 'react';
import { X, ChevronDown, ChevronRight, Tag, Percent } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string | null, subcategory?: string | null) => void;
  onSelectSale: () => void;
}

interface Category {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Eletrônicos',
    subcategories: [
      { id: 'smartphones', name: 'Smartphones' },
      { id: 'laptops', name: 'Notebooks' },
      { id: 'tablets', name: 'Tablets' },
      { id: 'accessories', name: 'Acessórios' },
      { id: 'audio', name: 'Áudio' },
    ],
  },
  {
    id: 'fashion',
    name: 'Moda',
    subcategories: [
      { id: 'mens', name: 'Masculino' },
      { id: 'womens', name: 'Feminino' },
      { id: 'kids', name: 'Infantil' },
      { id: 'shoes', name: 'Calçados' },
      { id: 'accessories', name: 'Acessórios' },
    ],
  },
  {
    id: 'home',
    name: 'Casa & Decoração',
    subcategories: [
      { id: 'furniture', name: 'Móveis' },
      { id: 'decoration', name: 'Decoração' },
      { id: 'kitchen', name: 'Cozinha' },
      { id: 'bathroom', name: 'Banheiro' },
      { id: 'garden', name: 'Jardim' },
    ],
  },
  {
    id: 'sports',
    name: 'Esportes',
    subcategories: [
      { id: 'fitness', name: 'Fitness' },
      { id: 'outdoor', name: 'Ar Livre' },
      { id: 'team-sports', name: 'Esportes Coletivos' },
      { id: 'water-sports', name: 'Esportes Aquáticos' },
    ],
  },
  {
    id: 'beauty',
    name: 'Beleza & Saúde',
    subcategories: [
      { id: 'skincare', name: 'Cuidados com a Pele' },
      { id: 'makeup', name: 'Maquiagem' },
      { id: 'hair', name: 'Cabelo' },
      { id: 'perfume', name: 'Perfumaria' },
    ],
  },
  {
    id: 'books',
    name: 'Livros',
    subcategories: [
      { id: 'fiction', name: 'Ficção' },
      { id: 'non-fiction', name: 'Não-Ficção' },
      { id: 'technical', name: 'Técnicos' },
      { id: 'kids', name: 'Infantil' },
    ],
  },
  {
    id: 'food',
    name: 'Alimentos',
    subcategories: [
      { id: 'breakfast', name: 'Café da Manhã' },
      { id: 'snacks', name: 'Lanches' },
      { id: 'desserts', name: 'Doces e Sobremesas' },
      { id: 'bakery', name: 'Padaria' },
      { id: 'spreads', name: 'Pastas e Cremes' },
      { id: 'meals', name: 'Refeições Prontas' },
      { id: 'sauces', name: 'Molhos e Temperos' },
      { id: 'beverages', name: 'Bebidas' },
    ],
  },
];

export function CategorySidebar({ isOpen, onClose, onSelectCategory, onSelectSale }: CategorySidebarProps) {
  const { isDark } = useThemeStore();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (category: Category) => {
    onSelectCategory(category.id);
    onClose();
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onSelectCategory(categoryId, subcategoryId);
    onClose();
  };

  const handleSaleClick = () => {
    onSelectSale();
    onClose();
  };

  const handleAllProducts = () => {
    onSelectCategory(null);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ease-out shadow-2xl',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isDark ? 'bg-gray-900' : 'bg-white'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-4 border-b',
          isDark ? 'border-gray-700' : 'border-gray-200'
        )}>
          <h2 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            Categorias
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-full transition-colors',
              isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {/* Sale Section */}
          <button
            onClick={handleSaleClick}
            className={cn(
              'w-full flex items-center space-x-3 px-4 py-4 border-b transition-colors',
              isDark
                ? 'border-gray-700 hover:bg-red-900/30 text-red-400'
                : 'border-gray-200 hover:bg-red-50 text-red-600'
            )}
          >
            <Percent className="h-5 w-5" />
            <span className="font-semibold">Promoções</span>
            <span className={cn(
              'ml-auto px-2 py-0.5 text-xs font-bold rounded-full',
              isDark ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
            )}>
              ATÉ 50% OFF
            </span>
          </button>

          {/* All Products */}
          <button
            onClick={handleAllProducts}
            className={cn(
              'w-full flex items-center space-x-3 px-4 py-3 border-b transition-colors',
              isDark
                ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            )}
          >
            <Tag className="h-5 w-5" />
            <span className="font-medium">Todos os Produtos</span>
          </button>

          {/* Categories */}
          <div className="py-2">
            {categories.map((category) => (
              <div key={category.id}>
                <div className={cn(
                  'flex items-center',
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                )}>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      'flex-1 text-left px-4 py-3 transition-colors',
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    <span className="font-medium">{category.name}</span>
                  </button>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      'px-4 py-3 transition-colors',
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    )}
                  >
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Subcategories */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    expandedCategories.includes(category.id) ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(category.id, sub.id)}
                      className={cn(
                        'w-full text-left pl-10 pr-4 py-2.5 transition-colors',
                        isDark
                          ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
