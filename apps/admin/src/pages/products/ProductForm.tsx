import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { 
  ArrowLeft, Upload, Sparkles, Check, 
  HelpCircle, Image as ImageIcon, Plus, Star 
} from 'lucide-react';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [name, setName] = useState(isEdit ? 'Golden Bone Chew 🦴' : '');
  const [category, setCategory] = useState(isEdit ? 'Dogs' : 'Dogs');
  const [price, setPrice] = useState(isEdit ? '14.99' : '');
  const [stock, setStock] = useState(isEdit ? '120' : '');
  const [desc, setDesc] = useState(isEdit ? 'An extremely robust chew toy coated with sweet organic honey scent to keep your golden retrieve busy for hours!' : '');
  
  // Drag & drop states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(isEdit ? 'golden_chew.jpg' : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessSaved(true);
      
      setTimeout(() => {
        setSuccessSaved(false);
        navigate('/products');
      }, 2000);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12 max-w-4xl mx-auto"
    >
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3">
        <NavLink 
          to="/products"
          className="p-3 bg-white hover:bg-violet-50 text-[#705e8c] border border-violet-100 rounded-full flex items-center justify-center shadow-soft"
        >
          <ArrowLeft size={16} />
        </NavLink>
        <div>
          <h2 className="text-2xl font-extrabold text-[#3d2c54]">
            {isEdit ? 'Edit Product Details' : 'Add New Pet Accessory'}
          </h2>
          <p className="text-xs text-[#705e8c]">Define specs, inventory units, and media assets</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: DRAG & DROP MEDIA UPLOADER */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-4">
            <h3 className="font-extrabold text-sm text-[#3d2c54] flex items-center gap-2">
              <ImageIcon size={16} className="text-orange-400" />
              Product Photo
            </h3>

            {/* DRAG AND DROP ZONE */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-[24px] p-6 text-center cursor-pointer transition-all duration-300 min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden
                ${isDragging ? 'border-violet-600 bg-violet-50/50 scale-102' : 'border-violet-200 hover:border-violet-400 bg-white/40'}
              `}
            >
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*"
              />

              <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                {uploadedFile ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center mx-auto shadow-sm">
                      <Sparkles className="text-violet-500 animate-pulse" size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-[#3d2c54] block truncate max-w-[150px] mx-auto">
                        {uploadedFile}
                      </span>
                      <span className="text-[10px] text-green-500 font-extrabold mt-0.5 inline-block">
                        File uploaded successfully!
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#9f8fb3] underline hover:text-[#705e8c]">
                      Change file
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-violet-100/50 rounded-2xl w-fit mx-auto text-violet-500">
                      <Upload size={22} className="animate-bounce" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-[#3d2c54] block">
                        Drag & Drop Product Image
                      </span>
                      <span className="text-[10px] text-[#9f8fb3] block mt-1">
                        or click to browse local folders
                      </span>
                    </div>
                    <span className="text-[9px] text-[#9f8fb3] bg-violet-50 px-2 py-0.5 rounded-full inline-block mt-2">
                      PNG, JPG up to 5MB
                    </span>
                  </div>
                )}
              </label>
            </div>
            
            <div className="p-3.5 bg-[#ffd8be]/20 rounded-2xl border border-[#ffd8be]/30 flex items-start gap-2.5">
              <Star size={16} className="text-orange-400 shrink-0 mt-0.5 fill-orange-400" />
              <p className="text-[10px] text-[#705e8c] font-medium leading-relaxed">
                <strong>Curator Tip:</strong> Playful 3D clay illustrations with soft backgrounds yield 25% higher product details click-through rates.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED INFO INPUTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-[32px] border border-white/60 shadow-soft space-y-5">
            <h3 className="font-extrabold text-sm text-[#3d2c54] border-b border-violet-100/60 pb-3">
              Technical Details
            </h3>

            <div className="space-y-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#705e8c] ml-1">Product Title</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Honey Chew Toy"
                  className="clay-input w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#705e8c] ml-1">Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="clay-input w-full font-bold"
                  >
                    <option>Dogs</option>
                    <option>Cats</option>
                    <option>Birds</option>
                    <option>Small Pets</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#705e8c] ml-1">Unit Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="12.99"
                    className="clay-input w-full"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#705e8c] ml-1">Stock Units</label>
                  <input 
                    type="number" 
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    placeholder="100"
                    className="clay-input w-full"
                    required
                  />
                </div>

              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <label className="text-xs font-bold text-[#705e8c] ml-1">Description</label>
                  <HelpCircle size={12} className="text-violet-400" />
                </div>
                <textarea 
                  rows={4}
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Tell our pet owners what makes this item special!"
                  className="clay-input w-full resize-none"
                  required
                />
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <NavLink 
              to="/products"
              className="px-6 py-3 bg-white text-[#705e8c] hover:bg-violet-50 rounded-full font-extrabold text-xs border border-violet-100"
            >
              Cancel Changes
            </NavLink>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full font-extrabold text-xs shadow-[0_8px_20px_-4px_rgba(138,92,245,0.3)] hover:shadow-[0_12px_25px_-4px_rgba(138,92,245,0.4)] disabled:opacity-50 cursor-pointer duration-200"
            >
              {isSubmitting ? 'Saving Specs...' : isEdit ? 'Update Details' : 'Curate Listing'}
            </button>
          </div>

        </div>

      </form>

      {/* Dynamic Success Notifications Pop */}
      <AnimatePresence>
        {successSaved && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            className="fixed bottom-6 right-6 p-4 bg-white border border-green-200 text-[#3d2c54] rounded-[24px] shadow-2xl flex items-center gap-3 z-[999]"
          >
            <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center text-green-500">
              <Check size={18} strokeWidth={3} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold">Changes saved! 🐾</h4>
              <p className="text-[10px] text-[#705e8c] mt-0.5">Redirecting to catalog catalog.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
