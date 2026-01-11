import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../services/apiConfig';

const STATUS_OPTIONS = ['open', 'inprogress', 'onhold', 'closed'];

const Enquiries = () => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/static-pages/contacts`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const open = (c) => setSelected(c);
  const close = () => setSelected(null);

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/static-pages/contacts/${selected._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ status: selected.status, admin_description: selected.admin_description })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // refresh list
        await fetchContacts();
        close();
      } else {
        alert(data.message || 'Failed to update');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const onChangeSelected = (field, value) => setSelected(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Enquiries</h1>
            <p className="text-gray-600">Organize and check enquiries for better management</p>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading enquiries...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.length === 0 && <div className="text-sm text-gray-600 flex items-center justify-center w-full h-[300px]">No enquiries yet.</div>}
          {contacts.map(c => (
            <div key={c._id} className="p-4 border rounded-lg bg-white flex justify-between items-start">
              <div>
                <div className="font-semibold">{c.subject}</div>
                <div className="text-sm text-gray-600">{c.name} • {c.email} • {c.phone || '—'}</div>
                <div className="mt-2 text-sm">{c.message}</div>
              </div>
              <div className="ml-4 text-right">
                <div className="mb-2 text-sm">Status: <strong>{c.status}</strong></div>
                <button onClick={() => open(c)} className="px-3 py-1 bg-green-600 text-white rounded">Open</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-2xl w-full">
            <h3 className="text-xl font-semibold">{selected.subject}</h3>
            <div className="text-sm text-gray-600">From: {selected.name} • {selected.email} • {selected.phone || '—'}</div>
            <div className="mt-4 whitespace-pre-wrap">{selected.message}</div>
            <div className="mt-4 ">
              <label className="block text-sm font-medium">Status</label>
              <select value={selected.status} onChange={e => onChangeSelected('status', e.target.value)} className="mt-1 p-2 border rounded w-100">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Admin description</label>
              <textarea value={selected.admin_description || ''} onChange={e => onChangeSelected('admin_description', e.target.value)} className="mt-1 w-full border rounded p-2" rows={4} />
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={close} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
