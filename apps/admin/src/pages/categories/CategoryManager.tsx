import React, { useState, useEffect } from 'react';
import {
  FolderPlus,
  Trash2,
  Edit2,
  Check,
  X,
  Globe,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import CustomSelect from '../../components/common/CustomSelect';
import { apiClient } from '../../api/apiClient';
import { useToast } from '../../components/common/Toast';

// ── Types ──────────────────────────────────────────────────────────────────────
interface CategoryDB {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  petCategory: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  metaTitle?: string;
  metaDescription?: string;
  image?: { url: string };
  banner?: { url: string };
}

// ── Theme map ──────────────────────────────────────────────────────────────────
const petCategoryThemes: Record<string, { emoji: string; color: string; textColor: string }> = {
  dogs:       { emoji: '🐕', color: 'bg-[#fff2cc]', textColor: 'text-[#8c6723]' },
  cats:       { emoji: '🐈', color: 'bg-[#e2d9ff]', textColor: 'text-[#3b238c]' },
  fish:       { emoji: '🐟', color: 'bg-[#d0e8ff]', textColor: 'text-[#23508c]' },
  birds:      { emoji: '🐦', color: 'bg-[#d9f7be]', textColor: 'text-[#389e0d]' },
  small_pets: { emoji: '🐹', color: 'bg-[#ffdce0]', textColor: 'text-[#8c233c]' },
};

const petCategoryOptions = [
  { value: 'dogs',       label: 'Dogs 🐕',       emoji: '🐕' },
  { value: 'cats',       label: 'Cats 🐈',       emoji: '🐈' },
  { value: 'fish',       label: 'Fish 🐟',       emoji: '🐟' },
  { value: 'birds',      label: 'Birds 🐦',      emoji: '🐦' },
  { value: 'small_pets', label: 'Small Pets 🐹', emoji: '🐹' },
];

const blankForm = {
  name: '',
  petCategory: 'dogs',
  description: '',
  sortOrder: '0',
  isActive: true,
  metaTitle: '',
  metaDescription: '',
  imageUrl: '',
  bannerUrl: '',
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryDB[]>([]);
  const [form, setForm] = useState({ ...blankForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(true);

  // Confirm delete modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const { success, error: toastError, info } = useToast();

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => { loadCategories(); }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/categories');
      if (res?.data && Array.isArray(res.data)) setCategories(res.data);
    } catch {
      toastError('Failed to load categories', 'Check your server connection and refresh.');
    } finally {
      setLoading(false);
    }
  }

  // ── Form helpers ───────────────────────────────────────────────────────────
  const setField = (key: keyof typeof form, val: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const resetForm = () => {
    setForm({ ...blankForm });
    setEditId(null);
    setShowAdvanced(false);
    setFormError('');
  };

  const startEdit = (cat: CategoryDB) => {
    setForm({
      name:            cat.name,
      petCategory:     cat.petCategory,
      description:     cat.description || '',
      sortOrder:       cat.sortOrder?.toString() || '0',
      isActive:        cat.isActive,
      metaTitle:       cat.metaTitle || '',
      metaDescription: cat.metaDescription || '',
      imageUrl:        cat.image?.url || '',
      bannerUrl:       cat.banner?.url || '',
    });
    setEditId(cat._id);
    setShowAdvanced(!!(cat.metaTitle || cat.metaDescription || cat.image?.url || cat.banner?.url));
    setFormError('');
    // Scroll form into view on mobile
    document.getElementById('category-form-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) {
      setFormError('Category name is required.');
      toastError('Missing field', 'Category name is required.');
      return;
    }

    const body: Record<string, unknown> = {
      name:            form.name.trim(),
      petCategory:     form.petCategory,
      description:     form.description || undefined,
      sortOrder:       parseInt(form.sortOrder) || 0,
      isActive:        form.isActive,
      metaTitle:       form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
      image:           form.imageUrl ? { url: form.imageUrl, publicId: form.imageUrl } : undefined,
      banner:          form.bannerUrl ? { url: form.bannerUrl, publicId: form.bannerUrl } : undefined,
    };

    setIsSubmitting(true);
    try {
      if (editId) {
        const res = await apiClient.patch(`/admin/categories/${editId}`, body);
        if (res?.data) setCategories(prev => prev.map(c => c._id === editId ? res.data : c));
        success('Category Updated ✅', `"${form.name}" has been updated.`);
      } else {
        const res = await apiClient.post('/admin/categories', body);
        if (res?.data) setCategories(prev => [...prev, res.data]);
        success('Category Created 📂', `"${form.name}" is now live.`);
      }
      resetForm();
    } catch (err: any) {
      const msg = err?.message || 'Failed to save category. Try again.';
      setFormError(msg);
      toastError('Save failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteTrigger = (id: string) => { setCategoryToDelete(id); setIsConfirmOpen(true); };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    const cat = categories.find(c => c._id === categoryToDelete);
    try {
      await apiClient.delete(`/admin/categories/${categoryToDelete}`);
      setCategories(prev => prev.filter(c => c._id !== categoryToDelete));
      if (editId === categoryToDelete) resetForm();
      success('Category Deleted 🗑️', `"${cat?.name}" has been removed.`);
    } catch {
      toastError('Delete failed', 'Could not remove the category. Try again.');
    } finally {
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  // ── Toggle active ──────────────────────────────────────────────────────────
  const handleToggleActive = async (cat: CategoryDB) => {
    const newState = !cat.isActive;
    // Optimistic
    setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isActive: newState } : c));
    try {
      const res = await apiClient.patch(`/admin/categories/${cat._id}`, { isActive: newState });
      if (res?.data) setCategories(prev => prev.map(c => c._id === cat._id ? res.data : c));
      info(
        newState ? 'Category Activated' : 'Category Deactivated',
        `"${cat.name}" is now ${newState ? 'visible' : 'hidden'} on the storefront.`
      );
    } catch {
      // Revert
      setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isActive: !newState } : c));
      toastError('Status sync failed', 'Could not update status. Please try again.');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/*
        KEY LAYOUT:
        - Left column (lg:col-span-2): scrollable category list
        - Right column: STICKY form panel using `sticky top-6`
        - Wrap both in items-start so the sticky works correctly
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Category List (scrollable) ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-3">

          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400 font-semibold">
              {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} ·{' '}
              {categories.filter(c => c.isActive).length} active
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="clay-white-card rounded-[28px] p-8 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-semibold">
                <div className="w-4 h-4 rounded-full border-2 border-[#8e78f5] border-t-transparent animate-spin" />
                Loading categories…
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && categories.length === 0 && (
            <div className="clay-white-card rounded-[28px] p-8 text-center text-slate-400 text-sm font-semibold">
              No categories yet. Use the form on the right to create your first one! 🐾
            </div>
          )}

          {/* Category cards */}
          {!loading && categories.map((cat, idx) => {
            const theme = petCategoryThemes[cat.petCategory] || {
              emoji: '🐾', color: 'bg-slate-100', textColor: 'text-slate-700',
            };
            const isEditing = editId === cat._id;

            return (
              <div
                key={cat._id}
                className={`p-4 rounded-[28px] border-[3px] shadow-clay-card flex items-center gap-4 transition-all hover:translate-y-[-2px] ${theme.color} ${
                  isEditing ? 'border-[#8e78f5] ring-2 ring-[#8e78f5]/30' : 'border-white'
                }`}
              >
                {/* S.No. badge */}
                <div className="shrink-0 w-7 h-7 rounded-xl bg-white/70 border border-white flex items-center justify-center">
                  <span className={`text-[11px] font-black ${theme.textColor}`}>{idx + 1}</span>
                </div>

                {/* Emoji */}
                <span className="text-2xl filter drop-shadow-sm select-none shrink-0">{theme.emoji}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-black text-sm ${theme.textColor} truncate`}>{cat.name}</h3>
                    {!cat.isActive && (
                      <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Inactive
                      </span>
                    )}
                    {isEditing && (
                      <span className="text-[9px] font-black bg-[#8e78f5] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                        ✏️ Editing
                      </span>
                    )}
                  </div>
                  <p className={`text-xs opacity-70 font-semibold mt-0.5 ${theme.textColor} truncate`}>
                    {cat.description || cat.petCategory}
                  </p>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Product count */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black bg-white/60 ${theme.textColor} whitespace-nowrap`}>
                    {cat.productCount} {cat.productCount === 1 ? 'product' : 'products'}
                  </span>

                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggleActive(cat)}
                    title={cat.isActive ? 'Click to deactivate' : 'Click to activate'}
                    className={`w-9 h-5 rounded-full p-0.5 transition-all ${cat.isActive ? 'bg-emerald-400' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${cat.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => isEditing ? resetForm() : startEdit(cat)}
                    className={`p-2 rounded-xl transition-all active:scale-90 shadow-sm ${
                      isEditing
                        ? 'bg-[#8e78f5] text-white'
                        : 'bg-white/40 hover:bg-[#e2d9ff] hover:text-[#8e78f5] text-slate-500'
                    }`}
                    title={isEditing ? 'Cancel edit' : 'Edit'}
                  >
                    {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteTrigger(cat._id)}
                    className="p-2 rounded-xl bg-white/40 hover:bg-rose-50 hover:text-rose-600 text-slate-500 active:scale-90 transition-all shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Sticky Form Panel ───────────────────────────────────────────── */}
        <div
          id="category-form-panel"
          className="sticky top-6 clay-white-card rounded-[32px] p-6 space-y-4 self-start"
        >
          {/* Form header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">
                {editId ? '✏️ Edit Category' : '➕ New Category'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {editId ? 'Update fields below and save' : 'Fill in details and create'}
              </p>
            </div>
            {editId && (
              <button
                onClick={resetForm}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors active:scale-90"
                title="Cancel edit"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Error banner */}
          {formError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl px-3 py-2.5 text-rose-700 text-xs font-black flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0" /> {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pet Category */}
            <CustomSelect
              value={form.petCategory}
              onChange={val => setField('petCategory', val as string)}
              options={petCategoryOptions}
              label="Pet Category *"
            />

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Category Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Dog Food"
                className="w-full clay-input"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Short category description..."
                className="w-full clay-input resize-none py-2.5 text-xs"
                value={form.description}
                onChange={e => setField('description', e.target.value)}
              />
            </div>

            {/* Sort Order + Active */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Sort Order
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full clay-input"
                  value={form.sortOrder}
                  onChange={e => setField('sortOrder', e.target.value)}
                />
              </div>
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Status
                </label>
                <button
                  type="button"
                  onClick={() => setField('isActive', !form.isActive)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-black border-2 transition-all active:scale-95 ${
                    form.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}
                >
                  <div className={`w-7 h-4 rounded-full p-0.5 transition-all ${form.isActive ? 'bg-emerald-400' : 'bg-rose-300'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-all shadow-sm ${form.isActive ? 'translate-x-3' : 'translate-x-0'}`} />
                  </div>
                  {form.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            {/* Advanced (SEO + Images) — collapsible */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-[11px] font-black text-[#8e78f5] hover:opacity-75 transition-opacity w-full"
            >
              <Globe className="w-3.5 h-3.5" />
              Advanced (SEO + Images)
              {showAdvanced
                ? <ChevronUp className="w-3.5 h-3.5 ml-auto" />
                : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
            </button>

            {showAdvanced && (
              <div className="space-y-3 bg-slate-50/60 rounded-2xl p-3.5 border border-slate-100">
                {[
                  { key: 'metaTitle', label: 'Meta Title', placeholder: 'SEO page title', type: 'input' },
                  { key: 'metaDescription', label: 'Meta Description', placeholder: 'Short SEO description…', type: 'textarea' },
                  { key: 'imageUrl', label: 'Image URL', placeholder: 'https://…/img.jpg', type: 'input' },
                  { key: 'bannerUrl', label: 'Banner URL', placeholder: 'https://…/banner.jpg', type: 'input' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      {label}
                    </label>
                    {type === 'textarea' ? (
                      <textarea
                        rows={2}
                        placeholder={placeholder}
                        className="w-full clay-input resize-none py-2 text-xs"
                        value={(form as any)[key]}
                        onChange={e => setField(key as keyof typeof form, e.target.value)}
                        maxLength={160}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={placeholder}
                        className="w-full clay-input text-xs"
                        value={(form as any)[key]}
                        onChange={e => setField(key as keyof typeof form, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full clay-btn clay-btn-purple py-3.5 text-xs gap-1.5 shadow-md"
            >
              {editId
                ? <Check className="w-4 h-4 stroke-[2.5]" />
                : <FolderPlus className="w-4 h-4 stroke-[2.5]" />}
              {isSubmitting ? 'Saving…' : editId ? 'Update Category' : 'Create Category'}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full clay-btn clay-btn-light py-2.5 text-xs"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Category 📂"
        message={`Are you sure you want to delete "${categories.find(c => c._id === categoryToDelete)?.name}"? Products in this category may need to be re-assigned.`}
        confirmText="Delete"
        cancelText="Cancel"
        emoji="📂"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsConfirmOpen(false); setCategoryToDelete(null); }}
      />
    </div>
  );
}
