import React, { useState } from 'react';
import { 
  ArrowLeft, 
  UploadCloud, 
  File, 
  Check, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  image: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product ? product.name : '');
  const [category, setCategory] = useState(product ? product.category : 'Dogs 🐕');
  const [price, setPrice] = useState(product ? product.price.toString() : '');
  const [stock, setStock] = useState(product ? product.stock.toString() : '');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(product ? product.image : null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Simulate upload
    setUploadedFile('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      alert('Please fill out all required fields!');
      return;
    }
    // Save action
    onSave();
  };

  return (
    <div className="space-y-6">
      
      {/* Header action */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onCancel}
          className="p-2.5 bg-white border-2 border-white rounded-2xl text-[#8e78f5] hover:bg-slate-50 shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-1.5">
            {product ? 'Edit Product 📝' : 'Add New Product 🐕'}
          </h2>
          <p className="text-xs text-slate-400 font-semibold">Publish new stock assets to the storefront directory</p>
        </div>
      </div>

      {/* Main split grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form detail card */}
        <div className="lg:col-span-2 clay-white-card rounded-[32px] p-6 md:p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Product Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Sunset Premium Chew Toy"
              className="w-full clay-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Category *</label>
              <select 
                className="w-full clay-input bg-white appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Dogs 🐕">Dogs 🐕</option>
                <option value="Cats 🐈">Cats 🐈</option>
                <option value="Fish 🐟">Fish 🐟</option>
                <option value="Birds 🐦">Birds 🐦</option>
                <option value="Small Pets 🐹">Small Pets 🐹</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Price ($) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="29.99"
                  className="w-full clay-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Stock *</label>
                <input 
                  type="number" 
                  placeholder="50"
                  className="w-full clay-input"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Product Description</label>
            <textarea 
              rows={4}
              placeholder="Write a playful description outlining pet benefits, ingredients, or durability features..."
              className="w-full clay-input resize-none py-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3.5 pt-4 border-t border-slate-50">
            <button 
              type="submit"
              className="clay-btn clay-btn-purple px-6 py-3.5 text-xs gap-1.5 shadow-md flex-1 sm:flex-none"
            >
              <Check className="w-4 h-4 stroke-[2.5]" /> Save Product
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="clay-btn clay-btn-light px-6 py-3.5 text-xs flex-1 sm:flex-none"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Upload media card */}
        <div className="clay-white-card rounded-[32px] p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Product Image</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Drag & drop high-definition item photos</p>
          </div>

          {/* Uploader panel */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-[3px] border-dashed rounded-3xl p-6 text-center flex flex-col items-center justify-center min-h-[220px] transition-all cursor-pointer ${
              isDragOver 
                ? 'border-[#8e78f5] bg-purple-50/30' 
                : uploadedFile 
                ? 'border-emerald-200 bg-emerald-50/10' 
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
            onClick={() => setUploadedFile('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150')}
          >
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="w-28 h-28 rounded-2xl border-2 border-white overflow-hidden shadow-md mx-auto bg-white">
                  <img src={uploadedFile} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] text-emerald-600 font-black block">✓ Image upload complete</span>
                <span className="text-[10px] text-slate-400 font-bold block">(Click to replace)</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-[#8e78f5] mx-auto animate-float">
                  <UploadCloud className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-black text-[#8e78f5] block">Choose a file or drag here</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">PNG, JPG, JPEG up to 5MB</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick instructions */}
          <div className="bg-[#e2d9ff]/30 border border-[#e2d9ff]/50 rounded-2xl p-4 flex items-start gap-3">
            <div className="text-lg filter select-none shrink-0">💡</div>
            <p className="text-[11px] text-[#523d85] font-extrabold leading-snug">
              Clear items with white backdrops look most premium in the store! Standard catalog display will prioritize clean layout slots.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
}
