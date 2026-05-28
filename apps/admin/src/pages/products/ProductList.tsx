import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  Search, Plus, Filter, Grid, List, Edit2, Trash2, 
  ChevronDown, Star, Package, Eye, AlertCircle, Sparkles 
} from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Golden Bone Chew 🦴', category: 'Dogs', price: 14.99, stock: 120, status: 'Active', rating: 4.8, imageColor: 'bg-orange-100 text-orange-600' },
  { id: '2', name: 'Tuna Purrfection Pack 🐟', category: 'Cats', price: 8.99, stock: 85, status: 'Active', rating: 4.9, imageColor: 'bg-violet-100 text-violet-600' },
  { id: '3', name: 'Rainbow Bird Swing 🌈', category: 'Birds', price: 12.50, stock: 42, status: 'Active', rating: 4.5, imageColor: 'bg-amber-100 text-amber-600' },
  { id: '4', name: 'Premium Catnip Spray 🌱', category: 'Cats', price: 9.99, stock: 0, status: 'Out of Stock', rating: 4.7, imageColor: 'bg-emerald-100 text-emerald-600' },
  { id: '5', name: 'Hamster Running Wheel 🎡', category: 'Small Pets', price: 19.99, stock: 28, status: 'Active', rating: 4.6, imageColor: 'bg-pink-100 text-pink-600' },
  { id: '6', name: 'Orthopedic Dog Bed 🐕', category: 'Dogs', price: 49.99, stock: 14, status: 'Active', rating: 5.0, imageColor: 'bg-blue-100 text-blue-600' },
];

export default function ProductList() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const categories = ['All', 'Dogs', 'Cats', 'Birds', 'Small Pets'];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to retire this pet accessory, Mia?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#3d2c54] flex items-center gap-2">
            <Package className="text-violet-500 fill-violet-100" />
            Product Catalog
          </h2>
          <p className="text-xs text-[#705e8c]">Manage and monitor boutique listings and inventory</p>
        </div>

        <NavLink
          to="/products/new"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-bold text-xs shadow-[0_8px_20px_-4px_rgba(138,92,245,0.3)] hover:scale-102 transition-transform self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          Add New Product
        </NavLink>
      </div>

      {/* FILTER AND VIEW CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-4 rounded-[28px] border border-white/60 shadow-[0_8px_24px_rgba(138,92,245,0.03)]">
        
        {/* Search */}
        <div className="relative w-full md:w-[300px]">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full clay-input pr-10 pl-5 text-xs py-2.5"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400" size={14} />
        </div>

        {/* Categories Chips list */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-full text-xs font-bold transition-all duration-300
                ${selectedCategory === cat 
                  ? 'bg-violet-600 text-white shadow-[0_4px_12px_rgba(138,92,245,0.2)]' 
                  : 'bg-white/80 hover:bg-white text-[#705e8c] border border-violet-100/50'}
              `}
            >
              {cat === 'All' && '🐾 All'}
              {cat === 'Dogs' && '🐶 Dogs'}
              {cat === 'Cats' && '🐱 Cats'}
              {cat === 'Birds' && '🦜 Birds'}
              {cat === 'Small Pets' && '🐹 Small Pets'}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 bg-white/80 border border-violet-100 p-1.5 rounded-full self-end md:self-auto shrink-0">
          <button 
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-full transition-all ${viewMode === 'table' ? 'bg-violet-100 text-violet-600' : 'text-[#9f8fb3] hover:text-[#705e8c]'}`}
            title="Table List View"
          >
            <List size={16} />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-violet-100 text-violet-600' : 'text-[#9f8fb3] hover:text-[#705e8c]'}`}
            title="Card Grid View"
          >
            <Grid size={16} />
          </button>
        </div>

      </div>

      {/* PRODUCTS DISPLAY CONTAINER */}
      <AnimatePresence mode="wait">
        
        {/* GRID VIEW LAYOUT */}
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map(p => (
              <motion.div 
                key={p.id}
                layoutId={`card-${p.id}`}
                className="glass-panel p-5 rounded-[28px] border border-white/60 shadow-soft shadow-soft-hover relative overflow-hidden flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner ${p.imageColor}`}>
                      {p.name.split(' ').pop()}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.stock > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                        {p.stock > 0 ? `Stock: ${p.stock}` : 'Out of Stock'}
                      </span>
                      <span className="text-[10px] text-[#9f8fb3] font-bold bg-white/60 px-2 py-0.5 rounded-full border border-violet-100">{p.category}</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-[#3d2c54]">{p.name}</h3>

                  <div className="flex items-center gap-1.5 mt-2">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-[#705e8c]">{p.rating} / 5.0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-violet-100/40 pt-4 mt-4">
                  <span className="text-lg font-extrabold text-[#3d2c54]">${p.price}</span>
                  <div className="flex items-center gap-2">
                    <NavLink 
                      to={`/products/${p.id}/edit`}
                      className="p-2 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-full transition-all"
                    >
                      <Edit2 size={14} />
                    </NavLink>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          
          /* TABLE LIST LAYOUT */
          <motion.div 
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel rounded-[32px] border border-white/60 shadow-soft overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-violet-100">
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Product</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Category</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Price</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20">Stock Status</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20 text-center">Rating</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#9f8fb3] bg-white/20 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-violet-50">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-white/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-md font-bold ${p.imageColor}`}>
                            {p.name.split(' ').pop()}
                          </div>
                          <span className="font-extrabold text-sm text-[#3d2c54]">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-[#705e8c]">{p.category}</td>
                      <td className="py-4 px-6 font-extrabold text-sm text-[#3d2c54]">${p.price}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${p.stock > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                          {p.stock > 0 ? `${p.stock} Available` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-[#3d2c54]">{p.rating}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <NavLink 
                            to={`/products/${p.id}/edit`}
                            className="p-2 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-full transition-all"
                            title="Edit details"
                          >
                            <Edit2 size={13} />
                          </NavLink>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                <AlertCircle className="text-violet-300" size={36} />
                <h4 className="font-extrabold text-sm text-[#3d2c54]">No matching pet products found!</h4>
                <p className="text-xs text-[#705e8c]">Try expanding your search query or choosing another filter chip.</p>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
