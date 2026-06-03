import React, { useEffect, useState } from 'react';
import { Award, Plus, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  fetchCertifications,
  createCertification,
  deleteCertificationApi,
} from '../../api/certifications';
import type { Certification } from '../../types';

const EMPTY_CERT = { title: '', issuer: '', year: '', imageUrl: '' };

const AdminCertifications: React.FC = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_CERT);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_CERT>>({});

  useEffect(() => {
    fetchCertifications()
      .then(data => {
        setCerts(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const validate = () => {
    const e: Partial<typeof EMPTY_CERT> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const newCert = await createCertification(form);
      setCerts(prev => [newCert, ...prev]);
      setShowModal(false);
      setForm(EMPTY_CERT);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCertificationApi(id);
      setCerts(prev => prev.filter(c => c.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <AdminLayout
      title="Certifications"
      subtitle="Manage company certifications and registrations"
    >
      <div className="flex justify-end mb-5">
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setForm(EMPTY_CERT);
            setErrors({});
            setShowModal(true);
          }}
        >
          <Plus size={14} /> Add Certification
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="w-6 h-6 border-2 border-[#578E7E] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : certs.length === 0 ? (
        <div className="p-16 text-center text-[#8a8a8a]">
          <Award size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No certifications added yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {certs.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-sm border border-[#e0d8c8] p-5 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-sm bg-[#578E7E]/10 flex items-center justify-center mb-4">
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Award size={20} className="text-[#578E7E]" />
                )}
              </div>
              <h3 className="font-semibold text-[#3D3D3D] text-sm mb-1">{cert.title}</h3>
              {cert.issuer && <p className="text-xs text-[#8a8a8a]">{cert.issuer}</p>}
              {cert.year && (
                <p className="text-xs text-[#578E7E] font-medium mt-1">{cert.year}</p>
              )}
              <div className="mt-4 pt-3 border-t border-[#F5ECD5]">
                <button
                  onClick={() => setConfirmDelete(cert.id)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-sm bg-red-50 text-red-500 border border-red-100 hover:border-red-300 transition-all"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-[#e0d8c8] flex items-center justify-between">
              <h2 className="font-bold text-[#3D3D3D]">Add Certification</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-sm hover:bg-[#F5ECD5] text-[#8a8a8a]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Certificate Title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                error={errors.title}
                placeholder="e.g., ISO 9001:2015"
                required
              />
              <Input
                label="Issuing Authority"
                value={form.issuer}
                onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))}
                placeholder="e.g., Bureau Veritas"
              />
              <Input
                label="Year"
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                placeholder="e.g., 2023"
              />
              <Input
                label="Certificate Image URL"
                value={form.imageUrl}
                onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="px-6 py-4 border-t border-[#e0d8c8] flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
                Save Certification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-[#3D3D3D] mb-2">Delete Certification?</h3>
            <p className="text-sm text-[#7a7a7a] mb-5">
              This will permanently remove this certification.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCertifications;
