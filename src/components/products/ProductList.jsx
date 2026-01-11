import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import { categoriesAPI } from '../../services/api';
import API_BASE_URL from '../../services/apiConfig';
import AlertModal from '../shared/AlertModal';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// Helper function to format weight from grams to readable format
const formatWeight = (weightInGrams) => {
  if (!weightInGrams || weightInGrams === 0) return 'Not specified';

  if (weightInGrams >= 1000) {
    const kg = weightInGrams / 1000;
    return `${kg} kg`;
  } else {
    return `${weightInGrams} g`;
  }
};

const initialProductState = {
  name: '',
  description: '',
  price: '',
  discount_price: '',
  stock_quantity: '',
  unit: 'gram',
  weight: '',
  category: '',
  image: '',
  isActive: true,
  hsn_number: '',
  // gst_number: '',
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(initialProductState);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(initialProductState);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editProductId, setEditProductId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [categories, setCategories] = useState([]);
  // Add state for product details modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onConfirm: null,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      // Map visible to isActive for each product
      const products = (response.data.products || []).map(p => ({
        ...p,
        isActive: p.visible !== false // treat undefined as true
      }));
      setProducts(products);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleSearch = () => {
    // Filter products based on search term and category
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category_id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    return filtered;
  };

  const filteredProducts = handleSearch();

  // Add Product
  const handleAddProduct = () => {
    setAddForm(initialProductState);
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
      if (!addForm.name || !addForm.price || !addForm.stock_quantity || !addForm.category) {
        setAddError('Name, price, stock, and category are required.');
        setAddLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('description', addForm.description);
      formData.append('price', addForm.price);
      formData.append('discount_price', addForm.discount_price || 0);
      formData.append('stock_quantity', addForm.stock_quantity);
      formData.append('unit', addForm.unit);
      formData.append('weight', addForm.weight);
      formData.append('category_id', addForm.category);
      formData.append('product_type', 'Online');
      formData.append('visible', addForm.isActive);
      formData.append('hsn_number', addForm.hsn_number);
      // formData.append('gst_number', addForm.gst_number);
      if (addForm.image) formData.append('image', addForm.image);
      if (editProductId) {
        await productsAPI.update(editProductId, formData);
        setAddForm(initialProductState)
        setEditForm(initialProductState);
        setShowEditModal(false);
        setAlertModal({
          isOpen: true,
          title: 'Success',
          message: 'Product updated successfully',
          type: 'success',
          onConfirm: () => {
            setShowAddModal(false);
            fetchProducts();
          }
        });
      } else {
        await productsAPI.create(formData);
        setAddForm(initialProductState)
        setEditForm(initialProductState);
        setShowEditModal(false);
        setAlertModal({
          isOpen: true,
          title: 'Success',
          message: 'Product added successfully',
          type: 'success',
          onConfirm: () => {
            setShowAddModal(false);
            fetchProducts();
          }
        });
      }
    } catch (err) {
      setAddError('Failed to add product');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit Product
  const handleEditProduct = (product) => {
    setEditProductId(product._id);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      discount_price: product.discount_price || '',
      stock_quantity: product.stock_quantity !== undefined ? product.stock_quantity : '',
      unit: product.unit || '',
      weight: product.weight || '',
      category: product.category_id || '',
      image: product.image || '',
      isActive: product.isActive !== false,
      hsn_number: product.hsn_number || '',
    });
    setAddForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      discount_price: product.discount_price || '',
      stock_quantity: product.stock_quantity !== undefined ? product.stock_quantity : '',
      unit: product.unit || '',
      weight: product.weight || '',
      category: product.category_id || '',
      image: product.image || '',
      isActive: product.isActive !== false,
      hsn_number: product.hsn_number || ''
    })
    setEditError('');
    // setShowEditModal(true);
    setShowEditModal(true);
  };
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setAddForm(prev => ({ ...prev, [field]: value }));
  };
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    try {
      if (!editForm.name || !editForm.price || !editForm.stock_quantity || !editForm.category) {
        setEditError('Name, price, stock, and category are required.');
        setEditLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      formData.append('discount_price', editForm.discount_price || 0);
      formData.append('stock_quantity', editForm.stock_quantity);
      formData.append('unit', editForm.unit);
      formData.append('weight', editForm.weight);
      formData.append('category_id', editForm.category);
      formData.append('product_type', 'Online');
      formData.append('visible', editForm.isActive);
      formData.append('hsn_number', editForm.hsn_number);
      // formData.append('gst_number', editForm.gst_number);
      if (editForm.image && typeof editForm.image !== 'string') formData.append('image', editForm.image);
      await productsAPI.update(editProductId, formData);
      setAddForm(initialProductState)
      setEditForm(initialProductState);
      setShowEditModal(false);
      setAlertModal({
        isOpen: true,
        title: 'Success',
        message: 'Product updated successfully',
        type: 'success',
        onConfirm: () => {
          setShowEditModal(false);
          fetchProducts();
        }
      });
    } catch (err) {
      setEditError('Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = (productId) => {
    setDeleteProductId(productId);
    setDeleteError('');
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await productsAPI.delete(deleteProductId);
      setShowDeleteModal(false);
      fetchProducts();
    } catch (err) {
      setDeleteError('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AlertModal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onConfirm={alertModal.onConfirm}
      />
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Manage all products in your inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-sm font-medium">
              {filteredProducts.length} Products
            </div>
            {userRole === 'admin' || userRole === 'staff' ? (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                onClick={handleAddProduct}
              >
                <AddIcon className="w-4 h-4" />
                Add Product
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white min-w-[200px]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-5 h-5 text-red-500">⚠️</div>
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600  uppercase tracking-wider">HSN Code</th>
                {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600  uppercase tracking-wider">GST No</th> */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image_url || product.image ? (
                          <img
                            src={
                              product.image_url
                                ? (product.image_url.startsWith('http')
                                  ? product.image_url
                                  : `${API_BASE_URL.replace(/\/api\/?$/, '')}${product.image_url}`)
                                : product.image
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <InventoryIcon className="w-6 h-6 text-gray-400" />
                            <div className="text-xs text-gray-400 mt-0.5">No img</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600 truncate max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const category = categories.find(cat => cat._id === product.category_id);
                      const categoryName = category?.name || 'Unknown';
                      const categoryLower = categoryName.toLowerCase();

                      // Generate consistent color and icon based on category name
                      const getCategoryStyle = (name) => {
                        const categoryLower = name.toLowerCase();

                        // Define category styles with icons and colors
                        if (categoryLower.includes('snack') || categoryLower.includes('food') || categoryLower.includes('eat')) {
                          return {
                            icon: <span className="text-sm">🍿</span>,
                            bg: 'bg-orange-100',
                            text: 'text-orange-800',
                            border: 'border-orange-300'
                          };
                        } else if (categoryLower.includes('drink') || categoryLower.includes('beverage') || categoryLower.includes('juice')) {
                          return {
                            icon: <span className="text-sm">🥤</span>,
                            bg: 'bg-blue-100',
                            text: 'text-blue-800',
                            border: 'border-blue-300'
                          };
                        } else if (categoryLower.includes('fruit') || categoryLower.includes('vegetable') || categoryLower.includes('fresh')) {
                          return {
                            icon: <span className="text-sm">🥬</span>,
                            bg: 'bg-green-100',
                            text: 'text-green-800',
                            border: 'border-green-300'
                          };
                        } else if (categoryLower.includes('dairy') || categoryLower.includes('milk') || categoryLower.includes('cheese')) {
                          return {
                            icon: <span className="text-sm">🥛</span>,
                            bg: 'bg-yellow-100',
                            text: 'text-yellow-800',
                            border: 'border-yellow-300'
                          };
                        } else if (categoryLower.includes('meat') || categoryLower.includes('chicken') || categoryLower.includes('fish')) {
                          return {
                            icon: <span className="text-sm">🥩</span>,
                            bg: 'bg-red-100',
                            text: 'text-red-800',
                            border: 'border-red-300'
                          };
                        } else if (categoryLower.includes('bakery') || categoryLower.includes('bread') || categoryLower.includes('cake')) {
                          return {
                            icon: <span className="text-sm">🍞</span>,
                            bg: 'bg-amber-100',
                            text: 'text-amber-800',
                            border: 'border-amber-300'
                          };
                        } else if (categoryLower.includes('electronic') || categoryLower.includes('tech') || categoryLower.includes('gadget')) {
                          return {
                            icon: <span className="text-sm">📱</span>,
                            bg: 'bg-purple-100',
                            text: 'text-purple-800',
                            border: 'border-purple-300'
                          };
                        } else if (categoryLower.includes('clothing') || categoryLower.includes('fashion') || categoryLower.includes('wear')) {
                          return {
                            icon: <span className="text-sm">👕</span>,
                            bg: 'bg-pink-100',
                            text: 'text-pink-800',
                            border: 'border-pink-300'
                          };
                        } else if (categoryLower.includes('book') || categoryLower.includes('stationery') || categoryLower.includes('office')) {
                          return {
                            icon: <span className="text-sm">📚</span>,
                            bg: 'bg-indigo-100',
                            text: 'text-indigo-800',
                            border: 'border-indigo-300'
                          };
                        } else {
                          // Default fallback with hash-based color
                          const colors = [
                            { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
                            { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
                            { bg: 'bg-zinc-100', text: 'text-zinc-800', border: 'border-zinc-300' }
                          ];

                          let hash = 0;
                          for (let i = 0; i < name.length; i++) {
                            hash = name.charCodeAt(i) + ((hash << 5) - hash);
                          }
                          const colorScheme = colors[Math.abs(hash) % colors.length];

                          return {
                            icon: <CategoryIcon className="w-4 h-4" />,
                            ...colorScheme
                          };
                        }
                      };

                      const categoryStyle = getCategoryStyle(categoryName);

                      return (
                        <div className="flex items-center gap-3">
                          {/* Category Badge with Icon */}
                          <div className={`w-8 h-8 rounded-full ${categoryStyle.bg} ${categoryStyle.border} border-2 flex items-center justify-center`}>
                            {categoryStyle.icon}
                          </div>

                          {/* Category Name */}
                          <span className={`text-sm font-semibold ${categoryStyle.text} capitalize`}>
                            {categoryName}
                          </span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <MoneyIcon className="w-4 h-4" />
                      ₹{product.price}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.discount_price && product.discount_price > 0 ? (
                      <div className="flex flex-col gap-1">
                        <div className="text-red-600 font-semibold">₹{product.discount_price}</div>
                        <div className="text-xs text-gray-500">Save: ₹{(product.price - product.discount_price).toFixed(2)}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 w-[112px]">
                    {product.hsn_number ? (
                      <div className="text-gray-900 text-sm font-medium">{product.hsn_number}</div> 
                    ) : (<span className="text-gray-400">-</span>)}
                  </td>
                  {/* <td className="px-6 py-4">
                    {product.gst_number ? (
                      <div className="text-gray-900 text-sm font-medium">{product.gst_number}</div> 
                    ) : (<span className="text-gray-400">-</span>)}
                  </td> */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${product.stock_quantity > 10
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      <StorageIcon className="w-3 h-3" />
                      {product.stock_quantity} g
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${product.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {product.isActive ? (
                        <>
                          <CheckCircleIcon className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <CancelIcon className="w-3 h-3" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center ">
                      <button
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                        onClick={() => { setViewProduct(product); setShowViewModal(true); }}
                      >
                        <ViewIcon className="w-4 h-4" />
                      </button>
                      {(userRole === 'admin' || userRole === 'staff') && (
                        <>
                          <button
                            className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                            onClick={() => handleEditProduct(product)}
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <DeleteIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
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

      {/* Add Product Modal - Product View Style */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-0">Add New Product</h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => { setShowAddModal(false); setEditProductId(null); setAddForm(initialProductState); }}
              >
                <CancelIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddFormSubmit} className="px-4 py-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Product Image */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 h-full">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h3>
                    <div className="flex flex-col items-center space-y-4 justify-between">
                      <div className="w-full h-[380px] bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                        {addForm.image && typeof addForm.image !== 'string' ? (
                          <img
                            src={URL.createObjectURL(addForm.image)}
                            alt="Product Preview"
                            className="w-full h-auto object-cover object-center"
                          />
                        ) : (
                          <div className="text-center">
                            <InventoryIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No image selected</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleAddFormChange('image', e.target.files[0])}
                        className="hidden"
                        id="product-image-upload"
                      />
                      <label
                        htmlFor="product-image-upload"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium"
                      >
                        Choose Product Image
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Side - Product Details */}
                <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
                  {/* Product Title */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                        <input
                          type="text"
                          value={addForm.name}
                          onChange={e => handleAddFormChange('name', e.target.value)}
                          required
                          className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">HSN Code *</label>
                        <input
                          type="text"
                          value={addForm.hsn}
                          onChange={e => handleAddFormChange('hsn_number', e.target.value)}
                          required
                          className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter HSN code"
                        />
                      </div>
                      {/*<div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GST No *</label>
                        <input
                          type="text"
                          value={addForm.gst_number}
                          onChange={e => handleAddFormChange('gst_number', e.target.value)}
                          required
                          className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter GST number"
                        />
                      </div> */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={addForm.description}
                          onChange={e => handleAddFormChange('description', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                          placeholder="Enter detailed product description"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Stock */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing & Inventory</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={addForm.price}
                            onChange={e => handleAddFormChange('price', e.target.value)}
                            required
                            className="w-full pl-8 pr-4 py-3 text-xl font-bold text-green-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (Optional)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={addForm.discount_price}
                            onChange={e => handleAddFormChange('discount_price', e.target.value)}
                            className="w-full pl-8 pr-4 py-3 text-xl font-bold text-red-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Leave blank or 0 for no discount</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={addForm.stock_quantity}
                          onChange={e => handleAddFormChange('stock_quantity', e.target.value)}
                          required
                          className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          value={addForm.category}
                          onChange={e => handleAddFormChange('category', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <input
                          type="text"
                          value={addForm.unit}
                          onChange={e => handleAddFormChange('unit', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="e.g., kg, pieces, liters"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                        <input
                          type="text"
                          value={addForm.weight}
                          onChange={e => handleAddFormChange('weight', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="e.g., 500g, 1kg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={addForm.isActive ? 'active' : 'inactive'}
                          onChange={e => handleAddFormChange('isActive', e.target.value === 'active')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Product Preview */}
                  {addForm.name && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">Product Preview</h3>
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-white rounded-lg border border-green-200 flex items-center justify-center">
                          {addForm.image && typeof addForm.image !== 'string' ? (
                            <img
                              src={URL.createObjectURL(addForm.image)}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <InventoryIcon className="w-8 h-8 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900">{addForm.name || 'Product Name'}</h4>
                          <p className="text-sm text-green-700">{addForm.description || 'Product description will appear here'}</p>
                          <div className="flex items-start flex-col gap-4 mt-2">
                            <span className="text-sm text-green-700">Stock: {addForm.stock_quantity || '0'}</span>
                            <span className="text-sm text-green-700">weight:  {addForm.weight || '0'} {addForm.unit || 'units'}</span>
                            <span className="text-xl font-bold text-green-600"><b>Price: ₹</b>{addForm.price || '0.00'}</span>
                            <span className="text-sm text-red-600">{addForm.discount_price && addForm.discount_price > 0 ? `Discount Price: ₹${addForm.discount_price}` : 'No discount applied'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {addError && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-5 h-5 text-red-500">⚠️</div>
                  <span className="text-red-700 font-medium">{addError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 mt-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  onClick={() => { setShowAddModal(false); setEditProductId(null); setAddForm(initialProductState); }}
                >
                  Cancel
                </button>
                {editProductId ? <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2 text-lg"
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Update Product...
                    </>
                  ) : (
                    <>
                      <AddIcon className="w-5 h-5" />
                      Update Product
                    </>
                  )}
                </button> : <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2 text-lg"
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <AddIcon className="w-5 h-5" />
                      Add Product
                    </>
                  )}
                </button>}

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-0">Edit Product</h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                <CancelIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditFormSubmit} className="px-4 py-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Product Image */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 h-full">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h3>
                    <div className="flex flex-col items-center space-y-4 justify-between">
                      <div className="w-full h-[380px] bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                        {editForm.image && typeof editForm.image !== 'string' ? (
                          <img
                            src={URL.createObjectURL(editForm.image)}
                            alt="Product Preview"
                            className="w-full h-auto object-cover object-center"
                          />
                        ) : (
                          <div className="text-center">
                            <InventoryIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No image selected</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleEditFormChange('image', e.target.files[0])}
                        className="hidden"
                        id="product-image-upload"
                      />
                      <label
                        htmlFor="product-image-upload"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium"
                      >
                        Choose Product Image
                      </label>
                    </div>
                  </div>
                </div>
                {/* Right Side - Product Details */}
                <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
                  {/* Product Title */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={e => handleEditFormChange('name', e.target.value)}
                          required
                          className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">HSN Code *</label>
                        <input
                          type="text"
                          value={editForm.hsn}
                          onChange={e => handleEditFormChange('hsn', e.target.value)}
                          required
                          className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter HSN code"
                        />
                      </div>
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GST No *</label>
                        <input
                          type="text"
                          value={editForm.gst_number}
                          onChange={e => handleEditFormChange('gst_number', e.target.value)}
                          required
                          className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter GST number"
                        />
                      </div> */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={addForm.description}
                          onChange={e => handleAddFormChange('description', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                          placeholder="Enter detailed product description"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Stock */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing & Inventory</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.price}
                            onChange={e => handleEditFormChange('price', e.target.value)}
                            required
                            className="w-full pl-8 pr-4 py-3 text-xl font-bold text-green-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-red-600 mb-2">Discount Price (Optional)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.discount_price}
                            onChange={e => handleEditFormChange('discount_price', e.target.value)}
                            className="w-full pl-8 pr-4 py-3 text-xl font-bold text-red-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Leave blank or 0 for no discount</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={editForm.stock_quantity}
                          onChange={e => handleEditFormChange('stock_quantity', e.target.value)}
                          required
                          className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          value={editForm.category}
                          onChange={e => handleEditFormChange('category', e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <input
                          type="text"
                          value={editForm.unit}
                          onChange={e => handleEditFormChange('unit', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="e.g., kg, pieces, liters"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                        <input
                          type="text"
                          value={editForm.weight}
                          onChange={e => handleEditFormChange('weight', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="e.g., 500g, 1kg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={editForm.isActive ? 'active' : 'inactive'}
                          onChange={e => handleEditFormChange('isActive', e.target.value === 'active')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Product Preview */}
                  {editForm.name && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">Product Preview</h3>
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-white rounded-lg border border-green-200 flex items-center justify-center">
                          {editForm.image && typeof editForm.image !== 'string' ? (
                            <img
                              src={URL.createObjectURL(editForm.image)}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <InventoryIcon className="w-8 h-8 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900">{addForm.name || 'Product Name'}</h4>
                          <p className="text-sm text-green-700">{addForm.description || 'Product description will appear here'}</p>
                          <div className="flex items-start flex-col gap-4 mt-2">
                            <span className="text-sm text-green-700">Stock: {addForm.stock_quantity || '0'}</span>
                            <span className="text-sm text-green-700">weight:  {addForm.weight || '0'} {addForm.unit || 'units'}</span>
                            <span className="text-xl font-bold text-green-600"><b>Price: ₹</b>{addForm.price || '0.00'}</span>
                            <span className="text-sm text-red-600">{addForm.discount_price && addForm.discount_price > 0 ? `Discount Price: ₹${addForm.discount_price}` : 'No discount applied'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => handleEditFormChange('name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={e => handleEditFormChange('price', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editForm.stock_quantity}
                    onChange={e => handleEditFormChange('stock_quantity', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    value={editForm.unit}
                    onChange={e => handleEditFormChange('unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Weight</label>
                  <input
                    type="text"
                    value={editForm.weight}
                    onChange={e => handleEditFormChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    value={editForm.category}
                    onChange={e => handleEditFormChange('category', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editForm.isActive ? 'active' : 'inactive'}
                    onChange={e => handleEditFormChange('isActive', e.target.value === 'active')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleEditFormChange('image', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                  {editForm.image && typeof editForm.image !== 'string' && (
                    <img
                      src={URL.createObjectURL(editForm.image)}
                      alt="Preview"
                      className="mt-2 w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={e => handleEditFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div> */}
              {editError && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <div className="w-4 h-4 text-red-500">⚠️</div>
                  <span className="text-red-700 text-sm">{editError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 mt-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2 text-lg"
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <EditIcon className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-0">Delete Product</h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                <CancelIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="px-4 py-3">
              <div className="flex flex-col items-start gap-3 mb-2">
                <p className="text-gray-600 text-md mb-0">Are you sure you want to delete this product?</p>
              </div>
              {deleteError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <div className="w-4 h-4 text-red-500">⚠️</div>
                  <span className="text-red-700 text-sm">{deleteError}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-4 py-3 !pb-6">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <DeleteIcon className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showViewModal && viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowViewModal(false)}
              >
                <CancelIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <img
                  src={viewProduct.image_url || viewProduct.image}
                  alt={viewProduct.name}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 text-center">{viewProduct.name}</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="font-semibold text-green-600">₹{viewProduct.price}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Stock</div>
                    <div className="font-semibold text-gray-900">{viewProduct.stock_quantity} {viewProduct.unit}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Description</div>
                  <div className="text-gray-900">{viewProduct.description || 'No description available'}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Category</div>
                    <div className="font-semibold text-gray-900">{categories.find(cat => cat._id === viewProduct.category_id)?.name || 'Unknown'}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Weight</div>
                    <div className="font-semibold text-gray-900">{formatWeight(viewProduct.weight)}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${viewProduct.visible !== false
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {viewProduct.visible !== false ? (
                      <>
                        <CheckCircleIcon className="w-3 h-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <CancelIcon className="w-3 h-3" />
                        Inactive
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-gray-200">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList; 