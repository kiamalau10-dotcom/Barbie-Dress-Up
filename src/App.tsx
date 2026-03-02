import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Camera, 
  RotateCcw, 
  Heart, 
  ChevronRight, 
  ChevronLeft,
  Shirt,
  Scissors,
  Footprints,
  Crown,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import { CLOTHING_ITEMS } from './constants';
import { Category, ClothingItem } from './types';

const CATEGORIES: { id: Category; label: string; icon: any }[] = [
  { id: 'hair', label: 'Hair', icon: Scissors },
  { id: 'dresses', label: 'Dresses', icon: Heart },
  { id: 'tops', label: 'Tops', icon: Shirt },
  { id: 'bottoms', label: 'Bottoms', icon: Scissors },
  { id: 'shoes', label: 'Shoes', icon: Footprints },
  { id: 'accessories', label: 'Accessories', icon: Crown },
  { id: 'background', label: 'Background', icon: ImageIcon },
];

export default function App() {
  const [selectedItems, setSelectedItems] = useState<Partial<Record<Category, string>>>({
    background: 'bg-1',
    hair: 'hair-1',
  });
  const [activeCategory, setActiveCategory] = useState<Category>('hair');

  const filteredItems = useMemo(() => 
    CLOTHING_ITEMS.filter(item => item.category === activeCategory),
    [activeCategory]
  );

  const handleItemSelect = (item: ClothingItem) => {
    setSelectedItems(prev => {
      const next = { ...prev };
      
      // If selecting a dress, remove tops and bottoms
      if (item.category === 'dresses') {
        delete next.tops;
        delete next.bottoms;
      }
      // If selecting tops or bottoms, remove dresses
      if (item.category === 'tops' || item.category === 'bottoms') {
        delete next.dresses;
      }

      next[item.category] = item.id;
      return next;
    });
  };

  const resetGame = () => {
    setSelectedItems({
      background: 'bg-1',
      hair: 'hair-1',
    });
  };

  const getSelectedItem = (category: Category) => {
    const id = selectedItems[category];
    return CLOTHING_ITEMS.find(item => item.id === id);
  };

  const currentBg = getSelectedItem('background')?.image || CLOTHING_ITEMS.find(i => i.id === 'bg-1')?.image;

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Background Layer */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${currentBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8) saturate(1.2)'
        }}
      />

      {/* Main Game Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-6xl md:text-8xl text-white drop-shadow-[0_4px_4px_rgba(224,33,138,0.8)]"
          >
            Barbie
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-accent text-xl md:text-2xl text-barbie-light-pink bg-white/80 px-4 py-1 rounded-full shadow-lg mt-2 inline-block"
          >
            Dream Dress Up
          </motion.p>
        </div>

        {/* Doll Container */}
        <div className="relative w-full max-w-[400px] aspect-[3/4] flex items-center justify-center">
          {/* Base Doll - Using a stylized placeholder silhouette/image */}
          <div className="relative w-full h-full flex items-center justify-center">
             <img 
               src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=800" 
               alt="Doll Base"
               className="absolute inset-0 w-full h-full object-contain opacity-20 pointer-events-none"
               referrerPolicy="no-referrer"
             />
             
             {/* Layered Clothing Items */}
             <AnimatePresence mode="popLayout">
               {Object.entries(selectedItems).map(([category, id]) => {
                 if (category === 'background') return null;
                 const item = CLOTHING_ITEMS.find(i => i.id === id);
                 if (!item) return null;

                 return (
                   <motion.img
                     key={`${category}-${id}`}
                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 1.1, y: -20 }}
                     transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                     src={item.image}
                     alt={item.name}
                     className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                     style={{ 
                       zIndex: category === 'hair' ? 50 : 
                               category === 'accessories' ? 60 :
                               category === 'shoes' ? 10 :
                               category === 'dresses' ? 30 :
                               category === 'tops' ? 35 :
                               category === 'bottoms' ? 25 : 0
                     }}
                     referrerPolicy="no-referrer"
                   />
                 );
               })}
             </AnimatePresence>

             {/* Doll Silhouette Overlay for structure */}
             <div className="absolute inset-0 border-4 border-white/30 rounded-[40px] pointer-events-none shadow-inner" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-8 flex gap-4">
          <button 
            onClick={resetGame}
            className="p-4 rounded-full glass-panel text-barbie-pink hover:bg-white transition-colors"
          >
            <RotateCcw size={24} />
          </button>
          <button 
            className="p-4 rounded-full bg-barbie-pink text-white shadow-lg hover:scale-110 transition-transform sparkle"
            onClick={() => window.print()}
          >
            <Camera size={24} />
          </button>
        </div>
      </main>

      {/* Sidebar Closet */}
      <aside className="relative z-20 w-full md:w-[400px] h-[400px] md:h-full glass-panel flex flex-col border-t md:border-t-0 md:border-l border-white/40">
        {/* Category Tabs */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto border-b md:border-b-0 md:border-r border-white/20 bg-white/30">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 md:flex-none p-4 flex flex-col md:flex-row items-center gap-2 transition-all ${
                activeCategory === cat.id 
                  ? 'bg-barbie-pink text-white shadow-inner' 
                  : 'text-barbie-pink hover:bg-white/50'
              }`}
            >
              <cat.icon size={20} />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleItemSelect(item)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedItems[item.category] === item.id
                    ? 'border-barbie-pink ring-4 ring-barbie-pink/20'
                    : 'border-white/40 hover:border-barbie-light-pink'
                }`}
              >
                <img 
                  src={item.thumbnail} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[10px] text-white font-medium truncate">{item.name}</span>
                </div>
                {selectedItems[item.category] === item.id && (
                  <div className="absolute top-2 right-2 bg-barbie-pink text-white p-1 rounded-full">
                    <Sparkles size={12} />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-white/20 text-center">
          <p className="text-xs text-barbie-pink font-bold uppercase tracking-widest opacity-60">
            Style your dream Barbie
          </p>
        </div>
      </aside>
    </div>
  );
}
