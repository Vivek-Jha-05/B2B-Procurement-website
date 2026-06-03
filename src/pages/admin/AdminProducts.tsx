import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X, Search, Image, Package } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import type { Product } from '../../types';
import { productCategories } from '../../data/mockData';
import { uploadProductImage } from '../../api/products';

const categoryOptions = productCategories
  .filter(c => c !== 'All')
  .map(c => ({ value: c, label: c }));

const EMPTY_PRODUCT = {
  name: '',
  category: categoryOptions[0].value,
  description: '',
  imageUrl: '',
};

const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, refreshProducts } = useAdmin();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_PRODUCT>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const filtered = useMemo(
    () =>
      products.filter(
        p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setErrors({});
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
    });
    setErrors({});
    setImageFile(null);
    setImagePreview(product.imageUrl || '');
    setShowModal(true);
  };

  const validate = () => {
    const e: Partial<typeof EMPTY_PRODUCT> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      let savedProduct;
      if (editing) {
        savedProduct = await updateProduct(editing.id, form);
      } else {
        savedProduct = await addProduct(form);
      }
      
      if (imageFile) {
        await uploadProductImage(savedProduct.id, imageFile);
        await refreshProducts();
      }

      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <AdminLayout title="Products" subtitle="Manage your product catalogue">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#e0d8c8] rounded-sm focus:border-[#578E7E] focus:ring-2 focus:ring-[#578E7E]/20 outline-none bg-white"
          />
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <Plus size={14} />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-sm border border-[#e0d8c8] overflow-hidden group hover:shadow-md hover:border-[#578E7E]/30 transition-all"
          >
            {/* Image */}
            <div className="h-36 bg-[#F5ECD5] overflow-hidden relative">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image size={28} className="text-[#578E7E]/30" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="text-xs px-2 py-0.5 bg-[#578E7E] text-white rounded-sm font-medium">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-[#3D3D3D] text-sm mb-1 leading-snug line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-[#7a7a7a] line-clamp-2 mb-3">{product.description}</p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(product)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-sm bg-[#FFFAEC] text-[#578E7E] border border-[#e0d8c8] hover:border-[#578E7E] transition-all"
                >
                  <Pencil size={11} />
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(product.id)}
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
          <Package size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No products found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#e0d8c8] flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-[#3D3D3D]">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-sm hover:bg-[#F5ECD5] transition-colors text-[#8a8a8a]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Product Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                error={errors.name}
                placeholder="e.g., Industrial Safety Helmets"
                required
              />
              <Select
                label="Category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                options={categoryOptions}
                required
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                error={errors.description}
                placeholder="Describe the product..."
                rows={3}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#3D3D3D]">Product Image</label>
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
                {editing ? 'Save Changes' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-[#3D3D3D] mb-2">Delete Product?</h3>
            <p className="text-sm text-[#7a7a7a] mb-5">
              This will permanently remove the product. This action cannot be undone.
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

export default AdminProducts;
