import React, { useState } from 'react';
import { Check } from 'lucide-react';

// Color mapping for common color names to CSS colors
const singleColorMap: Record<string, string> = {
  // Basic colors
  'Preto': '#000000',
  'Branco': '#FFFFFF',
  'Vermelho': '#DC2626',
  'Azul': '#2563EB',
  'Verde': '#16A34A',
  'Amarelo': '#EAB308',
  'Laranja': '#EA580C',
  'Rosa': '#EC4899',
  'Roxo': '#9333EA',
  'Marrom': '#78350F',
  'Cinza': '#6B7280',
  'Bege': '#D4A574',
  'Dourado': '#D4AF37',
  'Prata': '#C0C0C0',
  'Azul Marinho': '#1E3A5F',
  'Azul Claro': '#93C5FD',
  'Verde Escuro': '#166534',
  'Verde Claro': '#86EFAC',
  'Vermelho Escuro': '#991B1B',
  'Rosa Claro': '#FBCFE8',
  'Lilás': '#C4B5FD',
  'Turquesa': '#14B8A6',
  'Coral': '#F97316',
  'Bordô': '#7F1D1D',
  'Creme': '#FFFDD0',
  'Caramelo': '#C68E17',
  'Nude': '#E8BEAC',
  'Grafite': '#383838',
  'Vinho': '#722F37',
  'Cáqui': '#C3B091',
  'Mostarda': '#FFDB58',
  'Terracota': '#E2725B',
  'Lavanda': '#E6E6FA',
  'Menta': '#98FF98',
  'Salmão': '#FA8072',
  'Pêssego': '#FFCBA4',
  'Oliva': '#808000',
  'Índigo': '#4B0082',
  'Ciano': '#00FFFF',
  'Magenta': '#FF00FF',
};

const multiColorMap: Record<string, string[]> = {
  'Preto/Branco': ['#000000', '#FFFFFF'],
  'Azul/Branco': ['#2563EB', '#FFFFFF'],
  'Vermelho/Preto': ['#DC2626', '#000000'],
  'Verde/Amarelo': ['#16A34A', '#EAB308'],
  'Rosa/Roxo': ['#EC4899', '#9333EA'],
  'Azul/Verde': ['#2563EB', '#16A34A'],
  'Laranja/Preto': ['#EA580C', '#000000'],
  'Dourado/Preto': ['#D4AF37', '#000000'],
  'Prata/Preto': ['#C0C0C0', '#000000'],
  'Vermelho/Branco': ['#DC2626', '#FFFFFF'],
  'Azul Marinho/Branco': ['#1E3A5F', '#FFFFFF'],
  'Preto/Vermelho': ['#000000', '#DC2626'],
  'Branco/Rosa': ['#FFFFFF', '#EC4899'],
  'Cinza/Preto': ['#6B7280', '#000000'],
  'Multicolorido': ['#DC2626', '#2563EB', '#16A34A', '#EAB308'],
  'Arco-íris': ['#DC2626', '#EA580C', '#EAB308', '#16A34A', '#2563EB', '#9333EA'],
};

// Helper to get color value(s) from color name
const getColorValue = (colorName: string): string | string[] => {
  // Check multi-color map first
  if (multiColorMap[colorName]) {
    return multiColorMap[colorName];
  }
  
  // Check single color map
  if (singleColorMap[colorName]) {
    return singleColorMap[colorName];
  }
  
  // Check if it's a compound color with /
  if (colorName.includes('/')) {
    const parts = colorName.split('/').map(p => p.trim());
    const colors = parts.map(part => {
      if (singleColorMap[part]) {
        return singleColorMap[part];
      }
      return '#888888';
    });
    return colors;
  }
  
  // Default fallback
  return '#888888';
};

interface ColorCircleProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const ColorCircle: React.FC<ColorCircleProps> = ({ color, isSelected, onClick, size = 'md' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const colorValue = getColorValue(color);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };
  
  const isMultiColor = Array.isArray(colorValue);
  const isWhiteOrLight = colorValue === '#FFFFFF' || colorValue === '#FFFDD0' || colorValue === '#E8BEAC';
  
  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          ${sizeClasses[size]} rounded-full relative overflow-hidden
          transition-all duration-200 flex-shrink-0
          ${isSelected 
            ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800' 
            : 'hover:scale-110'
          }
          ${isWhiteOrLight ? 'border border-gray-300 dark:border-gray-600' : ''}
        `}
        style={
          isMultiColor
            ? {
                background: colorValue.length === 2
                  ? `linear-gradient(135deg, ${colorValue[0]} 50%, ${colorValue[1]} 50%)`
                  : colorValue.length === 3
                  ? `conic-gradient(${colorValue[0]} 0deg 120deg, ${colorValue[1]} 120deg 240deg, ${colorValue[2]} 240deg 360deg)`
                  : `conic-gradient(${colorValue.map((c, i) => `${c} ${(i * 360) / colorValue.length}deg ${((i + 1) * 360) / colorValue.length}deg`).join(', ')})`
              }
            : { backgroundColor: colorValue as string }
        }
        title={color}
      >
        {isSelected && (
          <span className={`absolute inset-0 flex items-center justify-center ${
            isWhiteOrLight || (isMultiColor && (colorValue as string[]).includes('#FFFFFF'))
              ? 'text-gray-800'
              : 'text-white'
          }`}>
            <Check className="w-4 h-4" strokeWidth={3} />
          </span>
        )}
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 
          bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap z-50
          pointer-events-none animate-fade-in">
          {color}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 
            border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
};

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showSelectedName?: boolean;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  size = 'md',
  showSelectedName = true,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <ColorCircle
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onClick={() => onColorSelect(color)}
            size={size}
          />
        ))}
      </div>
      
      {showSelectedName && selectedColor && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2 font-medium">
          {selectedColor}
        </span>
      )}
    </div>
  );
};

export default ColorSelector;
