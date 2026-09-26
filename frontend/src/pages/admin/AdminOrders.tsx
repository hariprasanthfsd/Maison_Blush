import React, { useState, useEffect } from 'react';
import { ShoppingBag, Edit2, Truck, Check, X, Search } from 'lucide-react';
import { adminApi } from '../../services/api';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('Processing');
  const [trackingNo, setTrackingNo] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Paid');

  const { showToast } = useToast();

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenStatusModal = (o: Order) => {
    setSelectedOrder(o);
    setNewStatus(o.orderStatus);
    setTrackingNo(o.trackingNumber || '');
    setPaymentStatus(o.paymentStatus);
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await adminApi.updateOrderStatus(selectedOrder.id, {
        orderStatus: newStatus,
        trackingNumber: trackingNo,
        paymentStatus: paymentStatus,
      });
      showToast('Order status & fulfillment updated!', 'success');
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2D2325]">Order Fulfillment Management</h1>
        <p className="text-xs text-[#6B5B5E]">Search customer orders, update tracking numbers, and manage dispatch stages.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF5F3] font-semibold text-[#2D2325] uppercase tracking-wider">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Order Status</th>
                <th className="p-3">Tracking #</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF5F3]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAF5F3]/50 transition-colors">
                  <td className="p-3 font-bold text-[#8C5353]">{o.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-semibold">{o.customerName}</p>
                    <p className="text-[10px] text-stone-500">{o.customerEmail}</p>
                  </td>
                  <td className="p-3 font-bold">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      o.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{o.orderStatus}</td>
                  <td className="p-3 font-mono text-[11px]">{o.trackingNumber || '-'}</td>
                  <td className="p-3 text-stone-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleOpenStatusModal(o)}
                      className="px-3 py-1.5 bg-[#FAF5F3] border border-[#E8C4C0] hover:bg-[#8C5353] hover:text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#FAF5F3]">
              <h3 className="font-serif text-lg font-bold text-[#2D2325]">
                Update Status: #{selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2D2325] mb-1">Order Fulfillment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#2D2325] mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#2D2325] mb-1">Courier Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. AWB987654321"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-4 border-t border-[#FAF5F3] flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#8C5353] text-white font-bold rounded-xl">Update Status</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
