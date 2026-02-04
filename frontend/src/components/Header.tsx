import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, ShoppingBag, User, Heart, Package, LogOut, X, Menu } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

interface HeaderProps {
  onOpenAuthModal: () => void;
  onSearch: (query: string) => void;
  onOpenSidebar: () => void;
}

export function Header({ onOpenAuthModal, onSearch, onOpenSidebar }: HeaderProps) {
  const { isDark, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node) && isSearchOpen) {
        if (!searchQuery) {
          setIsSearchOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onSearch('');
  };

  return (
    <header className={cn(
      'sticky top-0 z-40 border-b backdrop-blur-md',
      isDark ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Hamburger and Logo */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={onOpenSidebar}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              )}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className={cn('h-8 w-8', isDark ? 'text-indigo-400' : 'text-indigo-600')} />
              <span className={cn('text-xl font-bold hidden sm:block', isDark ? 'text-white' : 'text-gray-900')}>
                ShopVerse
              </span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Bar - Expands from right to left */}
            <div ref={searchContainerRef} className="relative flex items-center">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                {/* Expanding search input - expands to the left */}
                <div className={cn(
                  'flex items-center transition-all duration-500 ease-out overflow-hidden',
                  isSearchOpen ? 'w-48 sm:w-64 md:w-80 opacity-100 mr-2' : 'w-0 opacity-0'
                )}>
                  <button
                    type="button"
                    onClick={handleCloseSearch}
                    className={cn(
                      'p-1.5 rounded-full transition-colors flex-shrink-0',
                      isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    )}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Buscar produtos..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        onSearch(e.target.value);
                      }}
                      className={cn(
                        'w-full bg-transparent border-none outline-none py-2 px-2 transition-all duration-300',
                        isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                      )}
                    />
                    {/* Single underline */}
                    <div className={cn(
                      'absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500',
                      isDark ? 'bg-indigo-400' : 'bg-indigo-600'
                    )} />
                  </div>
                </div>

                {/* Search toggle button - always on the right */}
                <button
                  type={isSearchOpen ? "submit" : "button"}
                  onClick={() => !isSearchOpen && setIsSearchOpen(true)}
                  className={cn(
                    'p-2.5 rounded-full transition-colors flex-shrink-0',
                    isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
                  )}
                  aria-label={isSearchOpen ? "Buscar" : "Abrir busca"}
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-full transition-colors',
                isDark ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'
              )}
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth Button / User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover border-2 border-indigo-500"
                    />
                  ) : (
                    <div className={cn(
                      'h-9 w-9 rounded-full flex items-center justify-center',
                      isDark ? 'bg-indigo-600' : 'bg-indigo-500'
                    )}>
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className={cn(
                    'absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50',
                    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  )}>
                    <div className={cn(
                      'px-4 py-2 border-b',
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    )}>
                      <p className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                        {user?.name}
                      </p>
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 transition-colors',
                        isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      )}
                    >
                      <Package className="h-4 w-4" />
                      <span>Pedidos</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 transition-colors',
                        isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      )}
                    >
                      <User className="h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-2 px-4 py-2 transition-colors',
                        isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      )}
                    >
                      <Heart className="h-4 w-4" />
                      <span>Favoritos</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        'flex items-center space-x-2 w-full px-4 py-2 transition-colors',
                        isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className={cn(
                  'px-3 py-2 sm:px-4 rounded-full font-medium transition-colors text-sm sm:text-base',
                  isDark
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                )}
              >
                <span className="hidden sm:inline">Entrar / Cadastrar</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
