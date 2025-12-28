import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import api from '../../services/apiConfig';
import AlertModal from '../shared/AlertModal';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory2 as InventoryIcon,
  WarningAmber as WarningIcon,
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
  Refresh as RefreshIcon,
  CurrencyRupee as RupeeIcon
} from '@mui/icons-material';

// Helper to download files from API
const downloadFile = async (endpoint, filename, onError) => {
  try {
    const token = localStorage.getItem('token');
    const fullUrl = `${api}${endpoint}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
        
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download error:', err);
    if (onError) {
      onError();
    }
  }
};

const Reports = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onConfirm: null,
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dashboardAPI.getOverview();
      setOverview(res.data.data); // Access the nested data object
    } catch (err) {
      setError('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onConfirm={alertModal.onConfirm}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Generate comprehensive reports and view business analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2"
              onClick={fetchData}
            >
              <RefreshIcon className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
      )}

      {/* KPIs Row */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Sales</div>
                <div className="mt-1 text-2xl font-bold text-gray-900 flex items-center gap-1">
                  <RupeeIcon className="w-5 h-5 text-green-600" /> {overview.totalSales || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">All time</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <TrendingUpIcon />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Monthly Sales</div>
                <div className="mt-1 text-2xl font-bold text-gray-900 flex items-center gap-1">
                  <RupeeIcon className="w-5 h-5 text-green-600" /> {overview.monthlySales || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">This month</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <TrendingUpIcon />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="mt-1 text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {overview.totalOrders || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">All time</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <ShoppingCartIcon />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Monthly Orders</div>
                <div className="mt-1 text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {overview.monthlyOrders || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">This month</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <ShoppingCartIcon />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Report Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <TrendingUpIcon className="text-green-600" /> Sales Report
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => downloadFile('/dashboard/sales-report/export?format=pdf', 'sales-report.pdf', () => setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to download file. Please try again.', type: 'error', onConfirm: null }))}> 
              <PdfIcon className="w-4 h-4" /> Export PDF
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" onClick={() => downloadFile('/dashboard/sales-report/export?format=excel', 'sales-report.xlsx', () => setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to download file. Please try again.', type: 'error', onConfirm: null }))}> 
              <ExcelIcon className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>
        <div className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
          ) : !overview ? (
            <div className="text-gray-600">No data to display.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Total Sales</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 flex items-center gap-1">
                  <RupeeIcon className="w-5 h-5 text-green-600" /> {overview.totalSales || 0}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Monthly Sales</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 flex items-center gap-1">
                  <RupeeIcon className="w-5 h-5 text-green-600" /> {overview.monthlySales || 0}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{overview.totalOrders || 0}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Monthly Orders</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{overview.monthlyOrders || 0}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Report Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <InventoryIcon className="text-blue-600" /> Inventory Report
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={() => downloadFile('/dashboard/inventory-report/export?format=pdf', 'inventory-report.pdf', () => setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to download file. Please try again.', type: 'error', onConfirm: null }))}> 
              <PdfIcon className="w-4 h-4" /> Export PDF
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" onClick={() => downloadFile('/dashboard/inventory-report/export?format=excel', 'inventory-report.xlsx', () => setAlertModal({ isOpen: true, title: 'Error', message: 'Failed to download file. Please try again.', type: 'error', onConfirm: null }))}> 
              <ExcelIcon className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>
        <div className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
          ) : !overview ? (
            <div className="text-gray-600">No data to display.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Total Products</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{overview.totalProducts || 0}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Active Products</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{overview.activeProducts || 0}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Low Stock</div>
                <div className="mt-1 text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <WarningIcon className="w-5 h-5 text-amber-600" /> {overview.lowStockCount || 0}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Pending Orders</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">{overview.pendingOrders || 0}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports; 