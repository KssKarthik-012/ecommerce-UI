import React, { useEffect, useState } from 'react';
import { customersAPI } from '../../services/api';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll();
      setCustomers(response.data.customers || []);
    } catch (err) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({ name: '', email: '', phone: '', address: '' });
    setShowAddModal(true);
  };

  const openEditModal = (customer) => {
    setEditCustomer(customer);
    setForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setShowEditModal(true);
  };

  const handleFormChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleAddSubmit = async (e) => {
    e && e.preventDefault();
    try {
      setSaving(true);
      const res = await customersAPI.create(form);
      setPopup({ show: true, message: 'Customer created', type: 'success' });
      setShowAddModal(false);
      fetchCustomers();
    } catch (err) {
      console.error('Create customer error', err);
      setPopup({ show: true, message: err.response?.data?.message || 'Failed to create customer', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e && e.preventDefault();
    if (!editCustomer) return;
    try {
      setSaving(true);
      await customersAPI.update(editCustomer._id, form);
      setPopup({ show: true, message: 'Customer updated', type: 'success' });
      setShowEditModal(false);
      setEditCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error('Update customer error', err);
      setPopup({ show: true, message: err.response?.data?.message || 'Failed to update customer', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (popup.show) {
      const t = setTimeout(() => setPopup({ ...popup, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [popup]);

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer? This cannot be undone.')) return;
    try {
      setDeleteLoading(true);
      await customersAPI.delete(customerId);
      setPopup({ show: true, message: 'Customer deleted', type: 'success' });
      fetchCustomers();
    } catch (err) {
      console.error('Delete customer error', err);
      setPopup({ show: true, message: err.response?.data?.message || 'Failed to delete customer', type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toString().toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
            <p className="text-gray-600">Manage customer information and track their orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-sm font-medium">
              {filteredCustomers.length} Customers
            </div>
            <button
              onClick={openAddModal}
              className=" inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700"
            >
              + Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-600">No customers found.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{customer.name || '-'}</div>
                      <div className="text-sm text-gray-600">ID: {customer._id?.slice(-8)}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{customer.email || '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{customer.phone || '-'}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{customer.total_orders ?? 0}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">₹{customer.total_spent ?? 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                          <ViewIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditModal(customer)} className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                          disabled={deleteLoading}
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredCustomers.length}</span> of <span className="font-semibold">{customers.length}</span> customers
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed" disabled>
              ← Previous
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed" disabled>
              Next →
            </button>
          </div>
        </div>
      </div>
      {/* Add / Edit Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Customer</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input value={form.name} onChange={e => handleFormChange('name', e.target.value)} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={e => handleFormChange('email', e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <textarea value={form.address} onChange={e => handleFormChange('address', e.target.value)} className="w-full border px-3 py-2 rounded" rows={3} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-2 rounded border">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-green-600 text-white">{saving ? 'Saving...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Customer</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input value={form.name} onChange={e => handleFormChange('name', e.target.value)} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={e => handleFormChange('email', e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <textarea value={form.address} onChange={e => handleFormChange('address', e.target.value)} className="w-full border px-3 py-2 rounded" rows={3} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditCustomer(null); }} className="px-3 py-2 rounded border">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-green-600 text-white">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* popup */}
      {popup.show && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 60 }}>
          <div className={`px-4 py-2 rounded shadow text-white ${popup.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {popup.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers; 