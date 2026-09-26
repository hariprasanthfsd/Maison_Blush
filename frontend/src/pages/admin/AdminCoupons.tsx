import React, { useState, useEffect } from 'react';
import { Tag, Plus } from 'lucide-react';
import { adminApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('Percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrder, setMinOrder] = useState(1000);

  const { showToast } = useToast();

  const loadCoupons = async () => {
    try {
      const data = await adminApi.getCoupons();
      setCoupons(data);
    } catch (err) { }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    try {
      await adminApi.createCoupon({
        code,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrder),
        isActive: true,
      });
      showToast('Coupon code created successfully!', 'success');
      setCode('');
      loadCoupons();
    } catch (err) {
      showToast('Failed to create coupon.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2D2325]">Promotional Coupon Manager</h1>
        <p className="text-xs text-[#6B5B5E]">Create and manage discount codes for marketing campaigns.</p>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2D2325]">Create New Promo Code</h3>
        
        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Coupon Code</label>
            <input
              type="text"
              placeholder="e.g. LUXE20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2 uppercase"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Discount Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
            >
              <option value="Percentage">Percentage (%)</option>
              <option value="Fixed">Fixed Amount (INR)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Discount Value</label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Min Order Value</label>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(Number(e.target.value))}
              className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
              required
            />
          </div>

          <div className="sm:col-span-4 flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-[#8C5353] text-white font-bold rounded-xl flex items-center gap-1">
              <Plus className="w-4 h-4" /> Create Coupon
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF5F3] font-semibold text-[#2D2325]">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Min Order</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF5F3]">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="p-3 font-bold text-[#8C5353]">{c.code}</td>
                <td className="p-3">{c.discountType}</td>
                <td className="p-3 font-bold">{c.discountType === 'Percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                <td className="p-3">₹{c.minOrderAmount}</td>
                <td className="p-3 font-semibold text-emerald-700">Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
