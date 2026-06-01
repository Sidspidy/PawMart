import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  UploadCloud,
  Check,
  Plus,
  X,
  Tag,
  Globe,
  Info,
  Trash2,
  Image as ImageIcon,
  Package2,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
} from 'lucide-react';
import CustomSelect from '../../components/common/CustomSelect';
import { apiClient } from '../../api/apiClient';
import { useToast } from '../../components/common/Toast';

// ── Types ──────────────────────────────────────────────────────────────────────
interface CategoryOption {
  _id: string;
  name: string;
  petCategory: string;
}

interface ImageEntry {
  url: string;
  publicId: string;
  alt: string;
  isPrimary: boolean;
}

interface VariantEntry {
  id: number; // local key only
  sku: string;
  label: string;
  price: string;
  comparePrice: string;
  stock: string;
  weight: string;
}

interface ProductFormProps {
  product?: any | null;
  onSave: () => void;
  onCancel: () => void;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const petCategoryOptions = [
  { value: 'dogs', label: 'Dogs 🐕', emoji: '🐕' },
  { value: 'cats', label: 'Cats 🐈', emoji: '🐈' },
  { value: 'fish', label: 'Fish 🐟', emoji: '🐟' },
  { value: 'birds', label: 'Birds 🐦', emoji: '🐦' },
  { value: 'small_pets', label: 'Small Pets 🐹', emoji: '🐹' },
];

const petEmojiMap: Record<string, string> = {
  dogs: '🐕', cats: '🐈', fish: '🐟', birds: '🐦', small_pets: '🐹',
};

let variantIdCounter = 1;
const nextVid = () => variantIdCounter++;

// ── Helper: map product API images → ImageEntry[] ─────────────────────────────
function mapImages(raw?: any[]): ImageEntry[] {
  if (!raw || raw.length === 0) return [];
  return raw.map(img => ({
    url: img.url || '',
    publicId: img.publicId || img.url || '',
    alt: img.alt || '',
    isPrimary: img.isPrimary ?? false,
  }));
}

// ── Helper: map product API variants → VariantEntry[] ─────────────────────────
function mapVariants(raw?: any[]): VariantEntry[] {
  if (!raw || raw.length === 0) return [];
  return raw.map(v => ({
    id: nextVid(),
    sku: v.sku || '',
    label: v.label || '',
    price: v.price?.toString() || '',
    comparePrice: v.comparePrice?.toString() || '',
    stock: v.stock?.toString() || '',
    weight: v.weight?.toString() || '',
  }));
}

// ── Subcomponent: Single image card ───────────────────────────────────────────
function ImageCard({
  img,
  index,
  onSetPrimary,
  onAltChange,
  onRemove,
}: {
  img: ImageEntry;
  index: number;
  onSetPrimary: () => void;
  onAltChange: (val: string) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`relative rounded-2xl border-2 overflow-hidden transition-all ${
        img.isPrimary
          ? 'border-[#8e78f5] shadow-md'
          : 'border-slate-200 hover:border-[#c4b8ff]'
      }`}
    >
      {/* Image preview */}
      <div className="w-full h-28 bg-slate-100 flex items-center justify-center overflow-hidden">
        {img.url ? (
          <img
            src={img.url}
            alt={img.alt || 'Product'}
            className="w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).src = ''; }}
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-300" />
        )}
      </div>

      {/* Controls */}
      <div className="p-2 space-y-1.5 bg-white">
        <input
          type="text"
          placeholder="Alt text"
          value={img.alt}
          onChange={e => onAltChange(e.target.value)}
          className="w-full text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 outline-none focus:border-[#8e78f5]"
        />
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onSetPrimary}
            title="Set as primary image"
            className={`flex-1 text-[10px] font-black rounded-lg py-1 transition-all ${
              img.isPrimary
                ? 'bg-[#8e78f5] text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-purple-50 hover:text-[#8e78f5]'
            }`}
          >
            {img.isPrimary ? '★ Primary' : 'Set Primary'}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {img.isPrimary && (
        <div className="absolute top-1.5 left-1.5 bg-[#8e78f5] text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg shadow">
          PRIMARY
        </div>
      )}
    </div>
  );
}

// ── Subcomponent: Variant row ──────────────────────────────────────────────────
function VariantRow({
  v,
  index,
  onChange,
  onRemove,
}: {
  v: VariantEntry;
  index: number;
  onChange: (field: keyof VariantEntry, val: string) => void;
  onRemove: () => void;
}) {
  const cell = (field: keyof VariantEntry, placeholder: string, type = 'text') => (
    <input
      type={type}
      step={type === 'number' ? '0.01' : undefined}
      placeholder={placeholder}
      value={v[field] as string}
      onChange={e => onChange(field, e.target.value)}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#8e78f5] focus:bg-white transition-all"
    />
  );

  return (
    <tr className="group hover:bg-purple-50/20 transition-colors">
      <td className="py-2 pl-2 pr-1 text-xs font-black text-[#8e78f5] w-6">{index + 1}</td>
      <td className="py-2 px-1">{cell('label', 'e.g. 500g / Large / Red')}</td>
      <td className="py-2 px-1">{cell('sku', 'VAR-SKU-001')}</td>
      <td className="py-2 px-1">{cell('price', '299', 'number')}</td>
      <td className="py-2 px-1">{cell('comparePrice', '399', 'number')}</td>
      <td className="py-2 px-1">{cell('stock', '50', 'number')}</td>
      <td className="py-2 px-1">{cell('weight', '250', 'number')}</td>
      <td className="py-2 pl-1 pr-2">
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-all active:scale-90"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {

  // ── Core fields ────────────────────────────────────────────────────────────
  const [name, setName] = useState(product?.name || '');
  const [petCategory, setPetCategory] = useState(product?.petCategory || 'dogs');
  const [category, setCategory] = useState(product?.category?._id || product?.category || '');
  const [brand, setBrand] = useState(product?.brand || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [description, setDescription] = useState(product?.description || '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() || '');
  const [comparePrice, setComparePrice] = useState(product?.comparePrice?.toString() || '');
  const [stock, setStock] = useState(product?.stock?.toString() || '');
  const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold?.toString() || '5');
  const [weight, setWeight] = useState(product?.weight?.toString() || '');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>(product?.tags || []);

  // ── Flags ──────────────────────────────────────────────────────────────────
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isBestseller, setIsBestseller] = useState(product?.isBestseller || false);

  // ── SEO ────────────────────────────────────────────────────────────────────
  const [metaTitle, setMetaTitle] = useState(product?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(product?.metaDescription || '');
  const [showSeo, setShowSeo] = useState(false);

  // ── Images ─────────────────────────────────────────────────────────────────
  const [images, setImages] = useState<ImageEntry[]>(mapImages(product?.images));
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Variants ───────────────────────────────────────────────────────────────
  const [variants, setVariants] = useState<VariantEntry[]>(mapVariants(product?.variants));
  const [showVariants, setShowVariants] = useState(variants.length > 0);

  // ── Categories from API ────────────────────────────────────────────────────
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await apiClient.get('/admin/categories');
        if (res?.data && Array.isArray(res.data)) {
          setCategories(res.data);
          if (!product && res.data.length > 0 && !category) {
            setCategory(res.data[0]._id);
          }
        }
      } catch (err) {
        console.warn('Could not load categories', err);
      }
    }
    loadCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoryOptions = categories.map(c => ({
    value: c._id,
    label: c.name,
    emoji: petEmojiMap[c.petCategory] || '🐾',
  }));

  // ── Tag helpers ────────────────────────────────────────────────────────────
  const addTag = () => {
    const t = tagsInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagsInput('');
  };

  // ── Image helpers ──────────────────────────────────────────────────────────
  const addImageByUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || images.find(i => i.url === trimmed)) return;
    const isPrimary = images.length === 0;
    setImages(prev => [...prev, { url: trimmed, publicId: trimmed, alt: '', isPrimary }]);
    setImageUrlInput('');
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;
        const isPrimary = images.length === 0;
        setImages(prev => [...prev, { url: dataUrl, publicId: `local-${Date.now()}`, alt: file.name, isPrimary }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    } else {
      const url = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
      if (url) addImageByUrl(url);
    }
  };

  const updateImage = (index: number, patch: Partial<ImageEntry>) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, ...patch } : img));
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const next = prev.filter((_, i) => i !== index);
      // ensure at least one is primary
      if (next.length > 0 && !next.some(i => i.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  // ── Variant helpers ────────────────────────────────────────────────────────
  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      { id: nextVid(), sku: '', label: '', price: '', comparePrice: '', stock: '', weight: '' },
    ]);
  };

  const updateVariant = (id: number, field: keyof VariantEntry, val: string) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: val } : v));
  };

  const removeVariant = (id: number) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const { success: toastSuccess, error: toastError } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !basePrice || !stock || !sku || !description || !category) {
      const msg = 'Name, SKU, Category, Base Price, Stock, and Description are required.';
      setError(msg);
      toastError('Missing required fields', msg);
      return;
    }

    const cleanVariants = variants
      .filter(v => v.sku && v.label && v.price && v.stock)
      .map(v => ({
        sku: v.sku,
        label: v.label,
        price: parseFloat(v.price),
        comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : undefined,
        stock: parseInt(v.stock),
        weight: v.weight ? parseFloat(v.weight) : undefined,
      }));

    const cleanImages = images.map(img => ({
      url: img.url,
      publicId: img.publicId || img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
    }));

    const payload: Record<string, unknown> = {
      name,
      petCategory,
      category,
      brand: brand || undefined,
      sku,
      description,
      shortDescription: shortDescription || undefined,
      basePrice: parseFloat(basePrice),
      comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
      stock: parseInt(stock),
      lowStockThreshold: parseInt(lowStockThreshold) || 5,
      weight: weight ? parseFloat(weight) : undefined,
      tags,
      isFeatured,
      isActive,
      isBestseller,
      images: cleanImages,
      variants: cleanVariants,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
    };

    setIsSubmitting(true);
    try {
      if (product?._id) {
        await apiClient.patch(`/admin/products/${product._id}`, payload);
        toastSuccess('Product Updated ✅', `"${name}" has been saved successfully.`);
      } else {
        await apiClient.post('/admin/products', payload);
        toastSuccess('Product Published 🎉', `"${name}" is now live in the storefront.`);
      }
      onSave();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save product. Check all fields.';
      setError(msg);
      toastError('Save failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Toggle chip ────────────────────────────────────────────────────────────
  const ToggleChip = ({
    label, emoji, checked, onChange,
  }: { label: string; emoji: string; checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-black border-2 transition-all active:scale-95 select-none ${
        checked
          ? 'bg-[#8e78f5] text-white border-[#8e78f5] shadow-md'
          : 'bg-white text-slate-500 border-slate-200 hover:border-[#c4b8ff]'
      }`}
    >
      <span>{emoji}</span> {label}
    </button>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="p-2.5 bg-white border-2 border-white rounded-2xl text-[#8e78f5] hover:bg-slate-50 shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-800">
            {product ? '✏️ Edit Product' : '🐕 Add New Product'}
          </h2>
          <p className="text-xs text-slate-400 font-semibold">Fill all required fields to publish to the storefront</p>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-rose-700 text-xs font-black flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ══ SECTION 1: Core Details + Images ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Core Details */}
          <div className="lg:col-span-2 clay-white-card rounded-[32px] p-6 md:p-8 space-y-5">
            <p className="text-[11px] font-black text-[#8e78f5] uppercase tracking-widest">Core Details</p>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Sunset Premium Chew Toy"
                className="w-full clay-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelect
                value={petCategory}
                onChange={val => setPetCategory(val as string)}
                options={petCategoryOptions}
                label="Pet Category *"
              />
              {categoryOptions.length > 0 ? (
                <CustomSelect
                  value={category}
                  onChange={val => setCategory(val as string)}
                  options={categoryOptions}
                  label="Product Category *"
                />
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Product Category *</label>
                  <div className="clay-input text-slate-400 text-xs">Loading categories…</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Brand</label>
                <input type="text" placeholder="e.g. Royal Canin" className="w-full clay-input" value={brand} onChange={e => setBrand(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">SKU *</label>
                <input type="text" placeholder="e.g. TOY-DOG-001" className="w-full clay-input" value={sku} onChange={e => setSku(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Short Description</label>
              <input
                type="text"
                placeholder="One-liner for product cards (max 300 chars)"
                className="w-full clay-input"
                value={shortDescription}
                onChange={e => setShortDescription(e.target.value)}
                maxLength={300}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Full Description *</label>
              <textarea
                rows={4}
                placeholder="Detailed description with benefits, ingredients, care instructions…"
                className="w-full clay-input resize-none py-3"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Right: Image Manager */}
          <div className="clay-white-card rounded-[32px] p-6 space-y-4 flex flex-col">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#8e78f5]" /> Product Images
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Upload files or paste URLs · First image = primary
              </p>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-[3px] border-dashed rounded-3xl p-5 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[110px] ${
                isDragOver
                  ? 'border-[#8e78f5] bg-purple-50/40 scale-[1.01]'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#c4b8ff]'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-[#8e78f5]">
                <UploadCloud className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-black text-[#8e78f5]">Click to Browse or Drag & Drop</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">PNG, JPG, WebP up to 5MB each</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleFileSelect(e.target.files)}
            />

            {/* URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Or paste image URL…"
                className="flex-1 clay-input text-xs py-2.5"
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageByUrl(imageUrlInput))}
              />
              <button
                type="button"
                onClick={() => addImageByUrl(imageUrlInput)}
                className="clay-btn clay-btn-purple px-3 py-2.5 text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Image grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-0.5">
                {images.map((img, idx) => (
                  <ImageCard
                    key={idx}
                    img={img}
                    index={idx}
                    onSetPrimary={() => setPrimaryImage(idx)}
                    onAltChange={val => updateImage(idx, { alt: val })}
                    onRemove={() => removeImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ SECTION 2: Pricing & Inventory ══ */}
        <div className="clay-white-card rounded-[32px] p-6 md:p-8 space-y-5">
          <p className="text-[11px] font-black text-[#8e78f5] uppercase tracking-widest">Pricing & Inventory</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Base Price (₹) *</label>
              <input type="number" step="0.01" placeholder="299.00" className="w-full clay-input" value={basePrice} onChange={e => setBasePrice(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Compare Price (₹)</label>
              <input type="number" step="0.01" placeholder="399.00" className="w-full clay-input" value={comparePrice} onChange={e => setComparePrice(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Stock Qty *</label>
              <input type="number" placeholder="50" className="w-full clay-input" value={stock} onChange={e => setStock(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Low Stock Alert</label>
              <input type="number" placeholder="5" className="w-full clay-input" value={lowStockThreshold} onChange={e => setLowStockThreshold(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Weight (grams)</label>
              <input type="number" placeholder="250" className="w-full clay-input" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>
          </div>
        </div>

        {/* ══ SECTION 3: Product Variants ══ */}
        <div className="clay-white-card rounded-[32px] p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-[#8e78f5] uppercase tracking-widest flex items-center gap-1.5">
                <Package2 className="w-3.5 h-3.5" /> Product Variants
              </p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Size, colour, weight packs — each variant can have its own price &amp; stock
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowVariants(!showVariants)}
              className="flex items-center gap-1.5 text-[11px] font-black text-[#8e78f5] hover:opacity-75 transition-opacity"
            >
              {showVariants ? <><ChevronUp className="w-4 h-4" /> Hide</> : <><ChevronDown className="w-4 h-4" /> {variants.length > 0 ? `${variants.length} Variant${variants.length > 1 ? 's' : ''}` : 'Add Variants'}</>}
            </button>
          </div>

          {showVariants && (
            <div className="space-y-3">
              {variants.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/40">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {['#', 'Label *', 'SKU *', 'Price (₹) *', 'Compare ₹', 'Stock *', 'Weight (g)', ''].map(h => (
                          <th key={h} className="py-2.5 px-2 text-[10px] font-black text-slate-400 uppercase tracking-wider text-left">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v, idx) => (
                        <VariantRow
                          key={v.id}
                          v={v}
                          index={idx}
                          onChange={(field, val) => updateVariant(v.id, field, val)}
                          onRemove={() => removeVariant(v.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                  No variants yet. Click "Add Variant" to create size/colour options.
                </div>
              )}

              <button
                type="button"
                onClick={addVariant}
                className="clay-btn clay-btn-light px-5 py-2.5 text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Add Variant
              </button>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-[10px] text-amber-700 font-bold leading-snug flex gap-2">
                <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Variants override the base price/stock for each option. Fields marked * are required per variant row. Incomplete rows are skipped on save.</span>
              </div>
            </div>
          )}
        </div>

        {/* ══ SECTION 4: Tags ══ */}
        <div className="clay-white-card rounded-[32px] p-6 md:p-8 space-y-4">
          <p className="text-[11px] font-black text-[#8e78f5] uppercase tracking-widest">Tags</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a tag, press Enter (e.g. organic, premium)"
              className="flex-1 clay-input"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            />
            <button type="button" onClick={addTag} className="clay-btn clay-btn-purple px-4 py-2.5 text-xs gap-1">
              <Plus className="w-4 h-4 stroke-[2.5]" /> Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e2d9ff] text-[#523d85] rounded-xl text-xs font-black">
                  <Tag className="w-3 h-3" /> {tag}
                  <button type="button" onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="ml-1 hover:text-rose-600 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ══ SECTION 5: Flags ══ */}
        <div className="clay-white-card rounded-[32px] p-6 md:p-8 space-y-4">
          <p className="text-[11px] font-black text-[#8e78f5] uppercase tracking-widest">Product Flags</p>
          <div className="flex flex-wrap gap-3">
            <ToggleChip label="Active (Visible)" emoji="✅" checked={isActive} onChange={() => setIsActive(!isActive)} />
            <ToggleChip label="Featured" emoji="⭐" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
            <ToggleChip label="Bestseller" emoji="🔥" checked={isBestseller} onChange={() => setIsBestseller(!isBestseller)} />
          </div>
        </div>

        {/* ══ SECTION 6: SEO (collapsible) ══ */}
        <div className="clay-white-card rounded-[32px] p-6 md:p-8 space-y-4">
          <button
            type="button"
            onClick={() => setShowSeo(!showSeo)}
            className="flex items-center gap-1.5 text-[11px] font-black text-[#8e78f5] hover:opacity-75 transition-opacity w-full"
          >
            <Globe className="w-3.5 h-3.5" />
            SEO Meta Fields
            {showSeo ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
          </button>
          {showSeo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Meta Title</label>
                <input type="text" placeholder="SEO-friendly product title" className="w-full clay-input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Meta Description</label>
                <input type="text" placeholder="Short SEO description (max 160 chars)" className="w-full clay-input" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} maxLength={160} />
              </div>
            </div>
          )}
        </div>

        {/* ══ Actions ══ */}
        <div className="flex items-center gap-3.5 pb-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="clay-btn clay-btn-purple px-8 py-3.5 text-xs gap-1.5 shadow-md"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            {isSubmitting ? 'Saving…' : product ? 'Update Product' : 'Publish Product'}
          </button>
          <button type="button" onClick={onCancel} className="clay-btn clay-btn-light px-6 py-3.5 text-xs">
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
