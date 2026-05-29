export const TOOLS = [
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Length, weight, temperature & speed',
    icon: '📐',
    tint: '--tint-unit',
    keywords: ['unit', 'length', 'weight', 'temperature', 'speed', 'meter', 'kg', 'celsius'],
  },
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    description: 'Live exchange rates, 30+ currencies',
    icon: '💱',
    tint: '--tint-currency',
    keywords: ['currency', 'money', 'exchange', 'usd', 'eur', 'inr', 'forex'],
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize & convert images in your browser',
    icon: '🖼️',
    tint: '--tint-image',
    keywords: ['image', 'resize', 'photo', 'jpeg', 'png', 'webp', 'compress'],
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    description: 'HEX, RGB, HSL — pick, convert & copy',
    icon: '🎨',
    tint: '--tint-color',
    keywords: ['color', 'colour', 'hex', 'rgb', 'hsl', 'palette', 'picker'],
  },
  {
    slug: 'bakers-tool',
    name: "Baker's Tool",
    description: 'Ingredient converter · Oven temps · Yeast · Scaler · Bread %',
    icon: '🍞',
    tint: '--tint-bakers',
    keywords: ['baking', 'baker', 'recipe', 'flour', 'yeast', 'oven', 'grams', 'cups', 'scale', 'bread', 'hydration'],
  },
];

export function getTool(slug) {
  return TOOLS.find(t => t.slug === slug);
}
