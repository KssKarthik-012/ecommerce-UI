import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from './services/apiConfig';

// Async thunks for backend sync
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.cart || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const saveCart = createAsyncThunk('cart/saveCart', async (items, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${API_BASE_URL}/cart`, { items }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return items;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to save cart');
  }
});

export const clearCartBackend = createAsyncThunk('cart/clearCartBackend', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i._id === item._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1, selected: true });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item) item.quantity = quantity;
    },
    toggleItemSelection: (state, action) => {
      const { id } = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item) item.selected = !item.selected;
    },
    selectAllItems: (state, action) => {
      const { selected } = action.payload;
      state.items.forEach(item => {
        item.selected = selected;
      });
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(saveCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.items = [];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(clearCartBackend.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, toggleItemSelection, selectAllItems, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer; 