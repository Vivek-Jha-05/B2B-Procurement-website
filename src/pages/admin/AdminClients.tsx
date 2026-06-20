import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X, Search, Image, Handshake } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Client } from '../../types';
import { uploadClientLogo } from '../../api/clients';
import { useDebounce } from '../../hooks/useDebounce';

const EMPTY_CLIENT = {
  name: '',
  logoUrl: '',
  order: 0,
  isActive: true,
};

const AdminClients: React.FC = () => {
  const { clients_list, addClient, updateClient, deleteClient, refreshClients } = useAdmin();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(EMPTY_CLIENT);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_CLIENT>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(
    () =>
      clients_list.filter(
        c =>
          c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [clients_list, debouncedSearch]
  );

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_CLIENT);
    setErrors({});
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setForm({
      name: client.name,
      logoUrl: client.logoUrl,
      order: client.order,
      isActive: client.isActive,
    });
    setErrors({});
    setImageFile(null);
    setImagePreview(client.logoUrl || '');
    setShowModal(true);
  };

  const validate = () => {
    const e: Partial<typeof EMPTY_CLIENT> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      let savedClient;
      if (editing) {
        savedClient = await updateClient(editing.id, form);
      } else {
        savedClient = await addClient(form);
      }

      if (imageFile) {
        await uploadClientLogo(savedClient.id, imageFile);
        await refreshClients();
      }

      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save client');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClient(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete client');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <AdminLayout title="Clients" subtitle="Manage clients and partners displayed on the homepage marquee">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#e0d8c8] rounded-sm focus:border-[#578E7E] focus:ring-2 focus:ring-[#578E7E]/20 outline-none bg-white"
          />
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          <Plus size={14} />
          Add Client
        </Button>
      </div>

      {/* Clients Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(client => (
          <div
            key={client.id}
            className="bg-white rounded-sm border border-[#e0d8c8] overflow-hidden group hover:shadow-md hover:border-[#578E7E]/30 transition-all flex flex-col justify-between"
          >
            {/* Image / Logo preview */}
            <div className="h-36 bg-[#F5ECD5]/40 overflow-hidden relative flex items-center justify-center border-b border-[#F5ECD5]/60">
              {client.logoUrl ? (
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className="max-h-20 max-w-[80%] object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-center p-4">
                  <span className="w-10 h-10 rounded-md bg-[#578E7E]/10 text-[#578E7E] flex items-center justify-center font-serif text-lg font-extrabold mx-auto mb-2">
                    {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                  </span>
                  <span className="text-xs font-semibold text-[#8a8a8a] tracking-wider uppercase">{client.name}</span>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className="text-[10px] px-2 py-0.5 bg-[#578E7E] text-white rounded-sm font-medium">
                  Order: {client.order}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${client.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {client.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-[#3D3D3D] text-sm mb-3 leading-snug line-clamp-1">
                {client.name}
              </h3>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(client)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-sm bg-[#FFFAEC] text-[#578E7E] border border-[#e0d8c8] hover:border-[#578E7E] transition-all"
                >
                  <Pencil size={11} />
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(client.id)}
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
          <Handshake size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No clients found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#e0d8c8] flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-bold text-[#3D3D3D]">{editing ? 'Edit Client' : 'Add New Client'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-sm hover:bg-[#F5ECD5] transition-colors text-[#8a8a8a]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Client / Partner Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                error={errors.name}
                placeholder="e.g., Adani Group"
                required
              />
              
              <Input
                label="Display Order"
                type="number"
                value={String(form.order)}
                onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />

              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 text-[#578E7E] border-[#e0d8c8] rounded-sm focus:ring-2 focus:ring-[#578E7E]/20 accent-[#578E7E] cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-[#3D3D3D] cursor-pointer select-none">
                  Display on Homepage Marquee (Active)
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#3D3D3D]">Client Logo</label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp, image/avif, image/svg+xml"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full text-sm text-[#5a5a5a] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-[#F5ECD5] file:text-[#578E7E] hover:file:bg-[#e0d8c8] transition-all cursor-pointer"
                />
                <p className="text-xs text-[#8a8a8a]">Recommended: Landscape format (e.g. 300x100px) with transparent background. Max 5MB.</p>
              </div>

              {imagePreview && (
                <div className="h-28 rounded-sm overflow-hidden border border-[#e0d8c8] bg-[#F5ECD5]/40 flex items-center justify-center p-4">
                  <img src={imagePreview} alt="Preview" className="max-h-20 max-w-[80%] object-contain" />
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[#e0d8c8] flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
                {editing ? 'Save Changes' : 'Add Client'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-[#3D3D3D] mb-2">Delete Client?</h3>
            <p className="text-sm text-[#7a7a7a] mb-5">
              This will permanently remove the client. The logo asset will also be deleted.
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

export default AdminClients;
