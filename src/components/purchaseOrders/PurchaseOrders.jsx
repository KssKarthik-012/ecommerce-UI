import React, { useState, useEffect } from 'react';
import { purchaseOrdersAPI } from '../../services/api';
import AlertModal from '../shared/AlertModal';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    supplier_name: '',
    purchase_date: '',
    status: 'Pending',
    notes: '',
    items: [
      { product_id: '', product_name: '', quantity: 1, purchase_price: 0 }
    ]
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'view', 'edit'
  const [selectedPO, setSelectedPO] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onConfirm: null,
  });

  // Calculate total cost from items
  const totalCost = form.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.purchase_price)), 0);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await purchaseOrdersAPI.getAll();
      setPurchaseOrders(res.data.purchaseOrders || res.data.orders || []);
    } catch (err) {
      setError('Failed to fetch purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = purchaseOrders.filter(po =>
    po.supplier_name?.toLowerCase().includes(search.toLowerCase()) ||
    po._id?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (mode = 'create', po = null) => {
    setModalMode(mode);
    if (mode === 'create') {
      setForm({ supplier_name: '', purchase_date: '', status: 'Pending', notes: '', items: [{ product_id: '', product_name: '', quantity: 1, purchase_price: 0 }] });
      setSelectedPO(null);
    } else if (po) {
      setForm({
        supplier_name: po.supplier_name || '',
        purchase_date: po.purchase_date ? po.purchase_date.slice(0, 10) : '',
        status: po.status || 'Pending',
        notes: po.notes || '',
        items: po.items?.map(item => ({
          product_id: item.product_id || '',
          product_name: item.product_name || '',
          quantity: item.quantity || 1,
          purchase_price: item.purchase_price || 0
        })) || [{ product_id: '', product_name: '', quantity: 1, purchase_price: 0 }]
      });
      setSelectedPO(po);
    }
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedPO(null);
    setModalMode('create');
  };

  const handleView = (po) => openModal('view', po);
  const handleEdit = (po) => openModal('edit', po);

  const handleDelete = async (po) => {
    if (!window.confirm('Are you sure you want to delete this purchase order?')) return;
    try {
      await purchaseOrdersAPI.delete(po._id);
      fetchPurchaseOrders();
      closeModal();
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to delete purchase order',
        type: 'error',
        onConfirm: null,
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleItemChange = (idx, e) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      items: f.items.map((item, i) => i === idx ? { ...item, [name]: value } : item)
    }));
  };

  const addItem = () => {
    setForm(f => ({
      ...f,
      items: [...f.items, { product_id: '', product_name: '', quantity: 1, purchase_price: 0 }]
    }));
  };

  const removeItem = (idx) => {
    setForm(f => ({
      ...f,
      items: f.items.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const poData = {
        supplier_name: form.supplier_name,
        purchase_date: form.purchase_date,
        status: form.status,
        notes: form.notes,
        items: form.items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: Number(item.quantity),
          purchase_price: Number(item.purchase_price)
        })),
        total_cost: totalCost
      };
      if (modalMode === 'edit' && selectedPO) {
        await purchaseOrdersAPI.update(selectedPO._id, poData);
      } else {
        await purchaseOrdersAPI.create(poData);
      }
      closeModal();
      fetchPurchaseOrders();
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to save purchase order',
        type: 'error',
        onConfirm: null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading purchase orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onConfirm={alertModal.onConfirm}
      />
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Purchase Orders</h1>
              <p className="text-gray-600">Manage supplier purchase orders and track inventory</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-sm font-medium">
                {filteredOrders.length} Purchase Orders
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                onClick={() => openModal('create')}
              >
                <AddIcon className="w-4 h-4" />
                Create PO
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Search by supplier or PO number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-5 h-5 text-red-500">⚠️</div>
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PO #</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">No purchase orders found.</td>
                  </tr>
                ) : (
                  filteredOrders.map((po) => (
                    <tr key={po._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{po.po_number || po._id?.slice(-8)}</div>
                        <div className="text-sm text-gray-600">ID: {po._id?.slice(-8)}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{po.supplier_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="text-sm">{po.purchase_date ? new Date(po.purchase_date).toLocaleDateString() : '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{po.items?.length || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <MoneyIcon className="w-4 h-4" />
                          ₹{po.total_cost || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          (po.status || '').toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                          (po.status || '').toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {po.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View" onClick={() => handleView(po)}>
                            <ViewIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit" onClick={() => handleEdit(po)}>
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={() => handleDelete(po)}>
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{purchaseOrders.length}</span> purchase orders
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed" disabled>
                ← Previous
              </button>
              <button className="px-3 py-1 bg-green-600 text-white rounded-lg">1</button>
              <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed" disabled>
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <form className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden" onSubmit={modalMode === 'view' ? (e) => { e.preventDefault(); closeModal(); } : handleSubmit}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' && 'Create Purchase Order'}
                {modalMode === 'edit' && 'Edit Purchase Order'}
                {modalMode === 'view' && 'View Purchase Order'}
              </h2>
              <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={closeModal}>
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name</label>
                <input name="supplier_name" value={form.supplier_name} onChange={handleFormChange} required disabled={modalMode === 'view'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                  <input name="purchase_date" type="date" value={form.purchase_date} onChange={handleFormChange} required disabled={modalMode === 'view'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select name="status" value={form.status} onChange={handleFormChange} required disabled={modalMode === 'view'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors">
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost</label>
                  <div className="relative">
                    <MoneyIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5" />
                    <input name="total_cost" value={totalCost} readOnly tabIndex={-1} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-green-600 font-semibold" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={2} disabled={modalMode === 'view'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                <div className="space-y-3">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                      <input name="product_name" placeholder="Product Name" value={item.product_name} onChange={(e) => handleItemChange(idx, e)} required disabled={modalMode === 'view'} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors md:col-span-2" />
                      <input name="product_id" placeholder="Product ID" value={item.product_id} onChange={(e) => handleItemChange(idx, e)} disabled={modalMode === 'view'} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                      <input name="quantity" type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(idx, e)} required disabled={modalMode === 'view'} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                      <input name="purchase_price" type="number" min="0" placeholder="Price" value={item.purchase_price} onChange={(e) => handleItemChange(idx, e)} required disabled={modalMode === 'view'} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
                      {modalMode !== 'view' && (
                        <button type="button" className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium" onClick={() => removeItem(idx)} disabled={form.items.length === 1}>Remove</button>
                      )}
                    </div>
                  ))}
                  {modalMode !== 'view' && (
                    <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" onClick={addItem}>+ Add Item</button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button type="button" className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium" onClick={closeModal} disabled={submitting}>
                Cancel
              </button>
              {modalMode === 'edit' && (
                <button type="submit" className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2" disabled={submitting}>
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SaveIcon className="w-4 h-4" />}
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              )}
              {modalMode === 'create' && (
                <button type="submit" className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2" disabled={submitting}>
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SaveIcon className="w-4 h-4" />}
                  {submitting ? 'Creating...' : 'Create PO'}
                </button>
              )}
              {modalMode === 'view' && selectedPO && (
                <button type="button" className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium" onClick={() => handleEdit(selectedPO)}>
                  Edit
                </button>
              )}
              {modalMode !== 'create' && selectedPO && (
                <button type="button" className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium" onClick={() => handleDelete(selectedPO)}>
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default PurchaseOrders; 