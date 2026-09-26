import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Search, Check, X } from 'lucide-react';
import { adminApi, categoryApi } from '../../services/api';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    basePrice: 2999,
    salePrice: '',
    categoryId: 1,
    sku: '',
    material: 'Silk Blend',
    careInstructions: 'Dry clean only',
    badge: 'New',
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  });

  const { showToast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pData, cData] = await Promise.all([adminApi.getProducts(), categoryApi.getCategories()]);
      setProducts(pData);
      setCategories(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      basePrice: 2999,
      salePrice: '',
      categoryId: categories[0]?.id || 1,
      sku: `MB-${Math.floor(100 + Math.random() * 900)}`,
      material: '100% Satin Silk',
      careInstructions: 'Dry clean only',
      badge: 'New',
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: any) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      basePrice: p.basePrice,
      salePrice: p.salePrice || '',
      categoryId: p.categoryId || 1,
      sku: p.sku || '',
      material: p.material || '',
      careInstructions: p.careInstructions || '',
      badge: p.badge || '',
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      imageUrl: p.primaryImageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await adminApi.uploadImage(data);
      setFormData((prev) => ({ ...prev, imageUrl: res.imageUrl }));
      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      showToast('Image upload failed.', 'error');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...formData,
        basePrice: Number(formData.basePrice),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        images: [{ imageUrl: formData.imageUrl, isPrimary: true, displayOrder: 1 }],
        variants: [
          { size: 'S', colorName: 'Blush Pink', colorHex: '#F4E3DF', stockQuantity: 10, sku: `${formData.sku}-S` },
          { size: 'M', colorName: 'Blush Pink', colorHex: '#F4E3DF', stockQuantity: 12, sku: `${formData.sku}-M` },
        ],
      };

      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await adminApi.createProduct(payload);
        showToast('New product created!', 'success');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to save product.', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this product?')) {
      try {
        await adminApi.deleteProduct(id);
        showToast('Product deactivated.', 'info');
        loadData();
      } catch (err) {
        showToast('Failed to deactivate.', 'error');
      }
    }
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D2325]">Products & Inventory</h1>
          <p className="text-xs text-[#6B5B5E]">Manage boutique catalog, variant stock levels, and pricing.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-6 py-3 bg-[#8C5353] hover:bg-[#6E3C3D] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-boutique flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Table & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#F4E3DF] shadow-soft space-y-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A8B]" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl pl-10 pr-4 py-2 text-xs text-[#2D2325] focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF5F3] font-semibold text-[#2D2325] uppercase tracking-wider">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Base Price</th>
                <th className="p-3">Sale Price</th>
                <th className="p-3">Badge</th>
                <th className="p-3">Total Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF5F3]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF5F3]/50 transition-colors">
                  <td className="p-3 font-semibold text-[#2D2325] flex items-center gap-3">
                    <img src={p.primaryImageUrl} alt={p.name} className="w-10 h-12 object-cover rounded-lg bg-[#FAF5F3]" />
                    <span>{p.name}</span>
                  </td>
                  <td className="p-3 text-[#C49A8B]">{p.categoryName}</td>
                  <td className="p-3 font-bold">₹{p.basePrice.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-bold text-[#8C5353]">{p.salePrice ? `₹${p.salePrice.toLocaleString('en-IN')}` : '-'}</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-[#FAF5F3] border border-[#E8C4C0] rounded text-[10px]">{p.badge || 'None'}</span></td>
                  <td className="p-3 font-bold">{p.totalStock}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEditModal(p)} className="p-1.5 text-stone-600 hover:text-[#8C5353]">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-stone-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#FAF5F3]">
              <h3 className="font-serif text-xl font-bold text-[#2D2325]">
                {editingProduct ? 'Edit Boutique Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#2D2325] mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D2325] mb-1">Base Price (INR) *</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D2325] mb-1">Sale Discount Price (Optional)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D2325] mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2D2325] mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. New, Bestseller, Sale"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D2325] mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D2325] mb-1">Product Image URL / Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 bg-[#FAF5F3] border border-[#E8C4C0] rounded-xl px-3 py-2"
                  />
                  <label className="px-3 py-2 bg-[#2D2325] text-white rounded-xl cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#FAF5F3] flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#8C5353] text-white font-bold rounded-xl">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
