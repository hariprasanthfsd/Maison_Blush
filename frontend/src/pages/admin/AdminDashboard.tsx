import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Clock, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { DashboardStats } from '../../types';
import { adminApi } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-[#C49A8B] animate-pulse">Loading Store Analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2D2325]">Dashboard Overview</h1>
        <p className="text-xs text-[#6B5B5E]">Real-time store performance, revenue metrics, and inventory alerts.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A8B]">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-[#8C5353]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#2D2325]">
            ₹{(stats?.totalSales || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Confirmed Paid Sales
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A8B]">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-[#8C5353]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#2D2325]">{stats?.totalOrders || 0}</p>
          <span className="text-[10px] text-stone-500">Across all payment states</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A8B]">Pending Fulfillment</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-amber-600">{stats?.pendingOrders || 0}</p>
          <span className="text-[10px] text-stone-500">Requires processing or courier dispatch</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A8B]">Low Stock Alerts</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-red-600">{stats?.lowStockProductsCount || 0}</p>
          <span className="text-[10px] text-red-600 font-semibold">Variants under 5 units</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#2D2325]">Recent Orders</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF5F3] font-semibold text-[#2D2325] uppercase tracking-wider">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Fulfillment Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF5F3]">
              {stats?.recentOrders?.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAF5F3]/50 transition-colors">
                  <td className="p-3 font-bold text-[#8C5353]">{o.orderNumber}</td>
                  <td className="p-3">{o.customerName}</td>
                  <td className="p-3 font-bold">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      o.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{o.orderStatus}</td>
                  <td className="p-3 text-stone-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
