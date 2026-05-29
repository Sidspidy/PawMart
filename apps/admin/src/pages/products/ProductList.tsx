import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit, 
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  image: string;
}

interface ProductListProps {
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Sunset Premium Kibble', category: 'Dogs 🐕', price: 45.99, stock: 85, sales: 342, image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=100' },
  { id: '2', name: 'Golden Chew Toy Bone', category: 'Dogs 🐕', price: 12.50, stock: 150, sales: 850, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100' },
  { id: '3', name: 'Organic Salmon Cat Treats', category: 'Cats 🐈', price: 8.99, stock: 200, sales: 610, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=100' },
  { id: '4', name: 'Luxury Scratching Post', category: 'Cats 🐈', price: 89.99, stock: 25, sales: 124, image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=100' },
  { id: '5', name: 'Silent Bio-Filter Tank', category: 'Fish 🐟', price: 65.00, stock: 40, sales: 98, image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=100' },
  { id: '6', name: 'Sky-view Bird Cage Small', category: 'Birds 🐦', price: 110.00, stock: 15, sales: 48, image: 'https://images.unsplash.com/photo-1606567595334-d39973c37d cb?auto=format&fit=crop&q=80&w=100' },
];

export default function ProductList({ onAddProduct, onEditProduct }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom ConfirmModal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteTrigger = (id: string) => {
    setProductToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
    }
    setIsConfirmOpen(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesFilter = activeFilter === 'All' || p.category.includes(activeFilter);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-80 flex items-center bg-white border-[3px] border-white rounded-2xl px-4 py-2.5 gap-2.5 shadow-clay-card">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search products..."
            className="bg-transparent border-none outline-none text-xs w-full placeholder-slate-400 text-slate-700 font-extrabold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories Tab switches (Claymorphic) */}
        <div className="flex flex-wrap items-center bg-white/50 border-2 border-white rounded-2xl p-1 shadow-sm">
          {['All', 'Dogs', 'Cats', 'Fish', 'Birds'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                (cat === 'All' && activeFilter === 'All') || (activeFilter.includes(cat) && cat !== 'All')
                  ? 'bg-[#8e78f5] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add Product Button (tactile purple) */}
        <button 
          onClick={onAddProduct}
          className="clay-btn clay-btn-purple px-5 py-3 text-xs w-full md:w-auto gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Add Product
        </button>
      </div>

      {/* Products Table Container */}
      <div className="clay-table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="clay-th w-16">S.No.</th>
              <th className="clay-th">Product details</th>
              <th className="clay-th">Category</th>
              <th className="clay-th">Price</th>
              <th className="clay-th text-center">Stock status</th>
              <th className="clay-th text-center">Total Sales</th>
              <th className="clay-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* S.No. */}
                  <td className="clay-td font-black text-[#8e78f5]">{index + 1}</td>
                  
                  {/* Info */}
                  <td className="clay-td">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden shrink-0 shadow-sm bg-slate-50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-800">{product.name}</h4>
                        <span className="text-[10px] text-slate-400 font-extrabold">SKU: PM-0{product.id}0{product.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="clay-td">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="clay-td">
                    <span className="font-extrabold text-slate-800">${product.price.toFixed(2)}</span>
                  </td>

                  {/* Stock */}
                  <td className="clay-td text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      product.stock > 30 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : product.stock > 0 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {product.stock} left
                    </span>
                  </td>

                  {/* Sales */}
                  <td className="clay-td text-center">
                    <span className="font-extrabold text-[#8e78f5]">{product.sales} orders</span>
                  </td>

                  {/* Actions */}
                  <td className="clay-td text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button 
                        onClick={() => onEditProduct(product)}
                        className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 active:scale-95 transition-all shadow-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTrigger(product.id)}
                        className="p-2 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 text-rose-600 active:scale-95 transition-all shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400 font-extrabold text-sm">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Claymorphic) */}
      <div className="flex items-center justify-between bg-white border-[3px] border-white p-4 rounded-3xl shadow-clay-card flex-wrap gap-3">
        <span className="text-xs text-slate-400 font-bold">Showing 1 to {filteredProducts.length} of {filteredProducts.length} entries</span>
        
        <div className="flex items-center gap-2">
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-95 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3.5 py-1.5 bg-[#8e78f5] text-white text-xs font-black rounded-xl">1</span>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 active:scale-95 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Product 🗑️"
        message="Are you sure you want to delete this product? It will be removed from the active inventory catalog."
        confirmText="Delete"
        cancelText="Cancel"
        emoji="🗑️"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setProductToDelete(null);
        }}
      />

    </div>
  );
}
