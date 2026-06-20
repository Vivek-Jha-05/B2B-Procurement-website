import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X, Search, Image, Layers } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import type { Category } from '../../types';
import { uploadCategoryImage } from '../../api/categories';
import { useDebounce } from '../../hooks/useDebounce';

const EMPTY_CATEGORY = {
  name: '',
  description: '',
  imageUrl: '',
  order: 0,
};

const AdminCategories: React.FC = () => {
  const { categories_list, addCategory, updateCategory, deleteCategory, refreshCategories } = useAdmin();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY_CATEGORY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_CATEGORY>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(
    () =>
      categories_list.filter(
        c =>
          c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          c.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [categories_list, debouncedSearch]
  );

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_CATEGORY);
    setErrors({});
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      order: category.order,
    });
    setErrors({});
    setImageFile(null);
    setImagePreview(category.imageUrl || '');
    setShowModal(true);
  };

  const validate = () => {
    const e: Partial<typeof EMPTY_CATEGORY> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      let savedCategory;
      if (editing) {
        savedCategory = await updateCategory(editing.id, form);
      } else {
        savedCategory = await addCategory(form);
      }

      if (imageFile) {
        await uploadCategoryImage(savedCategory.id, imageFile);
        await refreshCategories();
      }

      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <AdminLayout title="Categories" subtitle="Manage product categories displayed on the website">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#e0d8c8] rounded-sm focus:border-[#578E7E] focus:ring-2 focus:ring-[#578E7E]/20 outline-none bg-white"
          />
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <Plus size={14} />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(category => (
          <div
            key={category.id}
            className="bg-white rounded-sm border border-[#e0d8c8] overflow-hidden group hover:shadow-md hover:border-[#578E7E]/30 transition-all"
          >
            {/* Image */}
            <div className="h-36 bg-[#F5ECD5] overflow-hidden relative">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image size={28} className="text-[#578E7E]/30" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="text-xs px-2 py-0.5 bg-[#578E7E] text-white rounded-sm font-medium">
                  Order: {category.order}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-[#3D3D3D] text-sm mb-1 leading-snug line-clamp-2">
                {category.name}
              </h3>
              <p className="text-xs text-[#7a7a7a] line-clamp-2 mb-3">{category.description}</p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(category)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-sm bg-[#FFFAEC] text-[#578E7E] border border-[#e0d8c8] hover:border-[#578E7E] transition-all"
                >
                  <Pencil size={11} />
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(category.id)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-sm bg-red-50 text-red-500 border border-red-100 hover:border-red-300 transition-all"
                >
                  <Trash2 size={11} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#8a8a8a]">
          <Layers size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No categories found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#e0d8c8] flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-[#3D3D3D]">{editing ? 'Edit Category' : 'Add New Category'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-sm hover:bg-[#F5ECD5] transition-colors text-[#8a8a8a]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Category Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                error={errors.name}
                placeholder="e.g., Adhesives"
                required
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                error={errors.description}
                placeholder="Describe the category..."
                rows={3}
                required
              />
              <Input
                label="Display Order"
                type="number"
                value={String(form.order)}
                onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#3D3D3D]">Category Image</label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp, image/avif"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full text-sm text-[#5a5a5a] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-[#F5ECD5] file:text-[#578E7E] hover:file:bg-[#e0d8c8] transition-all cursor-pointer"
                />
                <p className="text-xs text-[#8a8a8a]">Recommended: 800x600px. Max 5MB (JPG, PNG, WebP).</p>
              </div>

              {imagePreview && (
                <div className="h-40 rounded-sm overflow-hidden border border-[#e0d8c8] bg-[#F5ECD5]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[#e0d8c8] flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
                {editing ? 'Save Changes' : 'Add Category'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-[#3D3D3D] mb-2">Delete Category?</h3>
            <p className="text-sm text-[#7a7a7a] mb-5">
              This will permanently remove the category. Products using this category will not be affected.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(confirmDelete)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
