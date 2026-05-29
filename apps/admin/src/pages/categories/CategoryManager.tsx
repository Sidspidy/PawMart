import React, { useState } from 'react';
import { 
  FolderPlus, 
  Trash2, 
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import CustomSelect from '../../components/common/CustomSelect';

interface Category {
  id: string;
  name: string;
  emoji: string;
  itemsCount: number;
  color: string;
  textColor: string;
  themeDesc: string;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Dogs supplies', emoji: '🐕', itemsCount: 48, color: 'bg-[#fff2cc]', textColor: 'text-[#8c6723]', themeDesc: 'Warm earth tones, playful bold fonts.' },
  { id: '2', name: 'Cats supplies', emoji: '🐈', itemsCount: 36, color: 'bg-[#e2d9ff]', textColor: 'text-[#3b238c]', themeDesc: 'Elegant lavender-purple, minimal aesthetic.' },
  { id: '3', name: 'Aquatics / Fish', emoji: '🐟', itemsCount: 22, color: 'bg-[#d0e8ff]', textColor: 'text-[#23508c]', themeDesc: 'Ocean blues and teals, fluid animations.' },
  { id: '4', name: 'Birds supplies', emoji: '🐦', itemsCount: 18, color: 'bg-[#d9f7be]', textColor: 'text-[#389e0d]', themeDesc: 'Sky blues and greens, light airy feel.' },
  { id: '5', name: 'Small Pets', emoji: '🐹', itemsCount: 12, color: 'bg-[#ffdce0]', textColor: 'text-[#8c233c]', themeDesc: 'Soft warm pinks, cute rounded UI.' },
];

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('🐾');

  // Custom modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const emojiOptions = [
    { value: '🐕', label: 'Dog Supplies 🐕', emoji: '🐕' },
    { value: '🐈', label: 'Cat Supplies 🐈', emoji: '🐈' },
    { value: '🐟', label: 'Fish supplies 🐟', emoji: '🐟' },
    { value: '🐦', label: 'Bird supplies 🐦', emoji: '🐦' },
    { value: '🐹', label: 'Small Pet supplies 🐹', emoji: '🐹' },
    { value: '🦎', label: 'Reptile supplies 🦎', emoji: '🦎' },
    { value: '🐾', label: 'Generic Paw 🐾', emoji: '🐾' },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const newCat: Category = {
      id: (categories.length + 1).toString(),
      name: newCatName,
      emoji: newCatEmoji,
      itemsCount: 0,
      color: 'bg-slate-100 border-[#eae6f8]',
      textColor: 'text-slate-700',
      themeDesc: 'Standard visual config, cozy aesthetics.'
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
  };

  const handleDeleteTrigger = (id: string) => {
    setCategoryToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c.id !== categoryToDelete));
    }
    setIsConfirmOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-6">
      


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category List */}
        <div className="lg:col-span-2 space-y-4">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className={`p-5 rounded-[28px] border-[3px] border-white shadow-clay-card flex items-center justify-between gap-4 transition-all hover:translate-y-[-2px] ${cat.color}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl filter drop-shadow-sm select-none shrink-0">{cat.emoji}</span>
                <div>
                  <h3 className={`font-black text-base ${cat.textColor}`}>{cat.name}</h3>
                  <p className={`text-xs opacity-75 font-semibold mt-0.5 max-w-md ${cat.textColor}`}>
                    {cat.themeDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-black bg-white/60 ${cat.textColor}`}>
                  {cat.itemsCount} products
                </span>
                
                <button 
                  onClick={() => handleDeleteTrigger(cat.id)}
                  className="p-2.5 rounded-xl bg-white/40 hover:bg-rose-50 hover:text-rose-600 text-slate-500 active:scale-95 transition-all shadow-sm"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Category Form */}
        <div className="clay-white-card rounded-[32px] p-6 space-y-5 flex flex-col justify-between min-h-[360px]">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Add New Category</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Define category tags and visuals</p>
          </div>

          <form onSubmit={handleAdd} className="space-y-4 flex-1 mt-4">
            <div className="space-y-1.5">
              <CustomSelect
                value={newCatEmoji}
                onChange={setNewCatEmoji}
                options={emojiOptions}
                label="Emoji Icon"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Category Name</label>
              <input 
                type="text" 
                placeholder="e.g. Reptiles 🦎"
                className="w-full clay-input"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full clay-btn clay-btn-purple py-3 text-xs gap-1.5 mt-2"
            >
              <FolderPlus className="w-4 h-4 stroke-[2.5]" /> Create Category
            </button>
          </form>

          {/* Alert tip */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-[11px] text-amber-800 font-bold leading-snug">
            <span>✨</span>
            <span>New category creates standard themes. You can modify visual overlays inside theme settings files.</span>
          </div>
        </div>

      </div>

      {/* Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Category 📂"
        message="Are you sure you want to delete this category? Any associated inventory products may need manual re-assignment."
        confirmText="Delete"
        cancelText="Cancel"
        emoji="📂"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setCategoryToDelete(null);
        }}
      />

    </div>
  );
}
