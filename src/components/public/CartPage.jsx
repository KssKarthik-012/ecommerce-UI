import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart, toggleItemSelection, selectAllItems } from '../../cartSlice';
import PublicHeader from '../shared/PublicHeader';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../services/apiConfig';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate cart totals
  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + ((item.discount_price || item.price) * (item.quantity || 1)), 0);
  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 0 ? 50 : 0; // Flat rate shipping
  const total = subtotal + tax + shipping;
  const selectedCount = selectedItems.length;
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'customer') {
          setCustomerName(user.name || 'User');
        }
      } catch { }
    }
  }, []);

  const handleQuantityChange = (id, change) => {
    const item = cartItems.find(item => item._id === id);
    const newQuantity = (item.quantity || 1) + change;
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className=" mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-600 hover:text-green-700 transition-colors mr-4"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Shop
          </button>
          <div className='flex items-center mb-4'>
            <h1 className="text-3xl font-bold text-gray-900 mb-0">Your Shopping Cart</h1>
            <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products yet</p>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="lg:flex gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => dispatch(selectAllItems({ selected: e.target.checked }))}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Select all items ({selectedCount}/{cartItems.length})
                    </span>
                  </label>
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="text-sm text-gray-500 hover:text-red-600 flex items-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${!item.selected ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start sm:items-start">
                        <div className="flex items-center mr-4">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => dispatch(toggleItemSelection({ id: item._id }))}
                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
                          <div className="sm:col-span-2">
                            <div className="w-full h-[5rem] bg-gray-100 rounded-lg overflow-hidden">
                              {item.image_url && (
                                <img
                                  src={`${API_BASE_URL}${item.image_url}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          </div>

                          <div className="sm:col-span-4">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>

                          </div>

                          {/* <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-500 mb-1">Price</p>
                            <p className="text-gray-900 font-medium">₹{item.price.toFixed(2)}</p>
                          </div> */}

                          <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-500 mb-2">Quantity</p>
                            <div className="flex items-center border border-gray-300 rounded-md w-fit">
                              <button
                                onClick={() => handleQuantityChange(item._id, -1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity || 1}
                                onChange={(e) => dispatch(updateQuantity({
                                  id: item._id,
                                  quantity: Math.max(1, parseInt(e.target.value) || 1)
                                }))}
                                className="w-8 text-center border-0 focus:ring-0"
                              />
                              <button
                                onClick={() => handleQuantityChange(item._id, 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="sm:col-span-2 text-right">
                            <p className="text-sm font-medium text-gray-500 mb-1">Unit Price</p>
                            {item.discount_price && item.discount_price > 0 ? (
                              <div className="flex flex-col items-end">
                                <p className="text-gray-500 line-through text-sm">₹{item.price.toFixed(2)}</p>
                                <p className="text-red-600 font-semibold">₹{item.discount_price.toFixed(2)}</p>
                              </div>
                            ) : (
                              <p className="text-gray-900 font-medium">₹{item.price.toFixed(2)}</p>
                            )}
                          </div>

                          <div className="sm:col-span-2 text-right">
                            <p className="text-sm font-medium text-gray-500 mb-1">Total</p>
                            <p className="text-green-600 font-semibold">
                              ₹{((item.discount_price || item.price) * (item.quantity || 1)).toFixed(2)}
                            </p>
                            <button
                              onClick={() => dispatch(removeFromCart(item._id))}
                              className="mt-2 ml-auto text-sm text-red-600 hover:text-red-700 flex items-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary - Sticky on larger screens */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-[6rem]">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({selectedCount} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shipping > 0 ? `₹${shipping.toFixed(2)}` : 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-3"></div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate('/checkout', { state: { selectedItems } })}
                    disabled={selectedCount === 0}
                    className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${selectedCount > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
                  >
                    Proceed to Checkout
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">or</p>
                  </div>

                  <button
                    onClick={() => navigate('/shop')}
                    className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">We accept</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Credit Cards
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Debit Cards
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      UPI
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Net Banking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;