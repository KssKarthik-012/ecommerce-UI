import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const initialCategoryState = {
  name: '',
  description: '',
  is_active: true
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(initialCategoryState);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(initialCategoryState);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  // Add state for category details modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Add Category
  const handleAddCategory = () => {
    setAddForm(initialCategoryState);
    setAddError('');
    setShowAddModal(true);
  };
  const handleAddFormChange = (field, value) => {
    setAddForm(prev => ({ ...prev, [field]: value }));
  };
  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      if (!addForm.name) {
        setAddError('Name is required.');
        setAddLoading(false);
        return;
      }
      const payload = {
        name: addForm.name,
        description: addForm.description,
        is_active: addForm.is_active
      };
      await categoriesAPI.create(payload);
      setShowAddModal(false);
      fetchCategories();
    } catch (err) {
      setAddError('Failed to add category');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit Category
  const handleEditCategory = (category) => {
    setEditCategoryId(category._id);
    setEditForm({
      name: category.name || '',
      description: category.description || '',
      is_active: category.is_active !== false
    });
    setEditError('');
    setShowEditModal(true);
  };
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      if (!editForm.name) {
        setEditError('Name is required.');
        setEditLoading(false);
        return;
      }
      const payload = {
        name: editForm.name,
        description: editForm.description,
        is_active: editForm.is_active
      };
      await categoriesAPI.update(editCategoryId, payload);
      setShowEditModal(false);
      fetchCategories();
    } catch (err) {
      setEditError('Failed to update category');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setDeleteError('');
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await categoriesAPI.delete(deleteCategoryId);
      setShowDeleteModal(false);
      fetchCategories();
    } catch (err) {
      setDeleteError('Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Category Management</h1>
            <p className="text-gray-600">Organize products into categories for better management</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-sm font-medium">
              {filteredCategories.length} Categories
            </div>
            {(userRole === 'admin' || userRole === 'staff') && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                onClick={handleAddCategory}
              >
                <AddIcon className="w-4 h-4" />
                Add Category
              </button>
            )}
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
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-600">No categories found.</td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{cat.name || '-'}</div>
                      <div className="text-sm text-gray-600">ID: {cat._id?.slice(-8)}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{cat.description || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {cat.is_active ? <CheckCircleIcon className="w-3 h-3" /> : <CancelIcon className="w-3 h-3" />}
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                          onClick={() => { setViewCategory(cat); setShowViewModal(true); }}
                        >
                          <ViewIcon className="w-4 h-4" />
                        </button>
                        {(userRole === 'admin' || userRole === 'staff') && (
                          <>
                            <button
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                              onClick={() => handleEditCategory(cat)}
                            >
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                              onClick={() => handleDeleteCategory(cat._id)}
                            >
                              <DeleteIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
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
            Showing <span className="font-semibold">{filteredCategories.length}</span> of <span className="font-semibold">{categories.length}</span> categories
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add Category</h2>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowAddModal(false)}>
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFormSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input type="text" value={addForm.name} onChange={e => handleAddFormChange('name', e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={addForm.description} onChange={e => handleAddFormChange('description', e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={addForm.is_active ? 'active' : 'inactive'} onChange={e => handleAddFormChange('is_active', e.target.value === 'active')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {addError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{addError}</div>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2" disabled={addLoading}>
                  {addLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <SaveIcon className="w-4 h-4" />
                  )}
                  {addLoading ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowEditModal(false)}>
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditFormSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input type="text" value={editForm.name} onChange={e => handleEditFormChange('name', e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={editForm.description} onChange={e => handleEditFormChange('description', e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={editForm.is_active ? 'active' : 'inactive'} onChange={e => handleEditFormChange('is_active', e.target.value === 'active')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {editError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{editError}</div>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2" disabled={editLoading}>
                  {editLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <SaveIcon className="w-4 h-4" />
                  )}
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Delete Category</h2>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowDeleteModal(false)}>
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <p className="text-gray-700">Are you sure you want to delete this category?</p>
              {deleteError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{deleteError}</div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium" onClick={handleDeleteConfirm} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && viewCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Category Details</h2>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowViewModal(false)}>
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="text-gray-900"><span className="font-semibold">Name:</span> {viewCategory.name}</div>
              <div className="text-gray-900"><span className="font-semibold">Description:</span> {viewCategory.description || '-'}</div>
              <div className="text-gray-900 inline-flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${viewCategory.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {viewCategory.is_active !== false ? <CheckCircleIcon className="w-3 h-3" /> : <CancelIcon className="w-3 h-3" />}
                  {viewCategory.is_active !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-gray-900"><span className="font-semibold">Sort Order:</span> {viewCategory.sort_order ?? '-'}</div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories; 