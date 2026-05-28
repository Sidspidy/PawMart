import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, Edit2, Trash2, Check, Sparkles, FolderHeart } from 'lucide-react';

const INITIAL_CATEGORIES = [
  { id: '1', name: 'Dogs', icon: '🐶', count: 142, color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { id: '2', name: 'Cats', icon: '🐱', count: 85, color: 'bg-violet-100 text-violet-600 border-violet-200' },
  { id: '3', name: 'Birds', icon: '🦜', count: 42, color: 'bg-amber-100 text-amber-600 border-amber-200' },
  { id: '4', name: 'Small Pets', icon: '🐹', count: 28, color: 'bg-pink-100 text-pink-600 border-pink-200' },
];

export default function CategoryManager() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('🐾');
  const [successSaved, setSuccessSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bgPresets = [
      'bg-orange-100 text-orange-600 border-orange-200',
      'bg-violet-100 text-violet-600 border-violet-200',
      'bg-amber-100 text-amber-600 border-amber-200',
      'bg-pink-100 text-pink-600 border-pink-200'
    ];
    const newCat = {
      id: String(categories.length + 1),
      name: newCatName,
      icon: newCatEmoji,
      count: 0,
      color: bgPresets[Math.floor(Math.random() * bgPresets.length)]
    };
    setCategories([...categories, newCat]);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      setShowAddForm(false);
      setNewCatName('');
      setNewCatEmoji('🐾');
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (confirm("Retire this pet catalog category, Mia?")) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12 relative"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#3d2c54] flex items-center gap-2">
            <FolderHeart className="text-violet-500 fill-violet-100" />
            Category Curator
          </h2>
          <p className="text-xs text-[#705e8c]">Organize pet categories, emoji stamps, and monitor total counts</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-bold text-xs shadow-[0_8px_20px_-4px_rgba(138,92,245,0.3)] hover:scale-102 transition-transform cursor-pointer"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CATEGORIES GRID */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 self-start">
          {categories.map(cat => (
            <div 
              key={cat.id}
              className="glass-panel p-5 rounded-[28px] border border-white/60 shadow-soft shadow-soft-hover flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner ${cat.color}`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#3d2c54]">{cat.name} Category</h3>
                  <span className="text-[10px] text-[#9f8fb3] font-bold block mt-1">
                    {cat.count} curated items
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-all cursor-pointer"
                  title="Remove category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: ADD FORM */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {showAddForm ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4"
              >
                <h3 className="font-extrabold text-sm text-[#3d2c54] border-b border-violet-100/60 pb-3 flex items-center gap-2">
                  <Tag size={16} className="text-orange-400" />
                  Category Details
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#705e8c] ml-1">Category Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Reptiles" 
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      className="clay-input w-full text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#705e8c] ml-1">Identifier Emoji / Icon</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 🦎" 
                      value={newCatEmoji}
                      onChange={e => setNewCatEmoji(e.target.value)}
                      className="clay-input w-full text-xs"
                      maxLength={4}
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-extrabold text-xs shadow-md hover:scale-101 cursor-pointer duration-200"
                  >
                    Save Category
                  </button>
                </form>

              </motion.div>
            ) : (
              <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft text-center py-10 space-y-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-xl font-bold animate-float">
                  📂
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#3d2c54]">Add boutique sectors!</h4>
                  <p className="text-[10px] text-[#705e8c] max-w-[180px] mx-auto mt-1 leading-relaxed">
                    Set up beautiful sectors to group accessories, food, and toys for target pet owners.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-full shadow-sm cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            )}
          </AnimatePresence>

          {/* Success Overlay Alerts */}
          <AnimatePresence>
            {successSaved && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-[18px] text-[10px] font-bold flex items-center justify-center gap-1.5"
              >
                <Sparkles size={12} className="animate-bounce" />
                Category created successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
}
