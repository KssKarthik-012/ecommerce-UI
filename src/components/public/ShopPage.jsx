import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../services/api';
import PublicHeader from '../shared/PublicHeader';
import CustomerTabs from '../shared/CustomerTabs';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, saveCart } from '../../cartSlice';
import Footer from './Footer';
import { lightgreenbox } from '../../classConstat';

// Helper function to format weight from grams to readable format
const formatWeight = (weightInGrams) => {
  if (!weightInGrams || weightInGrams === 0) return null;

  if (weightInGrams >= 1000) {
    const kg = weightInGrams / 1000;
    return `${kg} kg`;
  } else {
    return `${weightInGrams} g`;
  }
};

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [activeTab] = useState('shop');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // Check if logged in as customer
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'customer') {
          setCustomerName(user.name || 'Valued Customer');
        }
      } catch { }
    }
  }, []);

  useEffect(() => {
    if (cartItems && cartItems.length >= 0) {
      dispatch(saveCart(cartItems));
    }
  }, []);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
    } catch (error) {
      setError('Failed to load products');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (err) {
      setCategories([]);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter || product.category_name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleTabChange = (tab) => {
    if (tab === 'overview') navigate('/customer/dashboard');
    else if (tab === 'orders') navigate('/customer/dashboard?tab=orders');
    else if (tab === 'profile') navigate('/customer/dashboard?tab=profile');
    else if (tab === 'shop') navigate('/shop');
  };

  return (
    <div className="public-website">
      {/* Header */}
      <PublicHeader />
      {/* <CustomerTabs activeTab={activeTab} onTabChange={handleTabChange} userName={customerName} /> */}
      {/* Shop Content */}
      <div className="shop-container">
        {/* Shop Section */}
        <section className={`shop-section ${lightgreenbox}`}>
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Our Products
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Discover our premium organic food products and spices
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-5xl mx-auto">
            {/* Search Bar */}
            <div className="w-full md:flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-1/4 relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white pr-10"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-0">
            {/* Products Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                // 🔹 Skeleton Loader
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow overflow-hidden flex flex-col animate-pulse"
                  >
                    {/* Skeleton Image */}
                    <div className="w-full h-60 bg-gray-200"></div>

                    {/* Skeleton Content */}
                    <div className="flex flex-col flex-1 px-5 pt-2 pb-5">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : error ? (

                <div className="col-span-full text-center text-gray-500 h-[300px] flex items-center justify-center">
                  <div className="error-message">{error}</div>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-60 bg-gray-100 flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={process.env.REACT_APP_API_URL + product.image_url}
                          alt={product.name}
                          className="w-full h-auto object-cover object-center"
                          // onError={(e) => {
                          //   e.currentTarget.src = "/images/no-image.png"; // fallback if broken
                          // }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                          No Image
                        </div>
                      )}

                      <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                        {product.category === "Spices" ? "Organic" : "Best Seller"}
                      </span>
                    </div>

                    {/* Product Content */}
                    <div className="flex flex-col flex-1 px-5 pt-2 pb-5">
                      <div className='flex justify-between items-center'>
                        <p className="text-sm text-gray-500 mb-1">
                          {product.category_name || "Unknown"}
                        </p>
                        <p className='text-[12px] mb-1 leading-[20px]'>
                          <b className='text-green-800'>HSN Code:</b> <span className="font-medium">{product.hsn_number || "N/A"}</span>
                        </p>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-0">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description}
                      </p>

                      {product.weight && (
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="font-medium">Weight:</span>{" "}
                          {formatWeight(product.weight)}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                          {product.discount_price && product.discount_price > 0 ? (
                            <div className="flex flex-col gap-1">
                              <div className="text-sm text-gray-500 line-through">₹{product.price}</div>
                              <div className="text-lg font-bold text-red-600">₹{product.discount_price}</div>
                              <div className="text-xs text-green-600 font-semibold">Save ₹{(product.price - product.discount_price).toFixed(2)}</div>
                            </div>
                          ) : (
                            <div className="text-lg font-bold text-green-600">₹{product.price}</div>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition" onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 h-[300px] flex items-center justify-center">
                  No products available
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShopPage; 