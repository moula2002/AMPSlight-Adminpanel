import React, { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import api from '../api/axiosInstance';

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [icon, setIcon] = useState(null);
  
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState('Active');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editItem, setEditItem] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setName('');
    setDescription('');
    setImage(null);
    setBanner(null);
    setIcon(null);
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords('');
    setDisplayOrder(0);
    setIsFeatured(false);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditItem(category);
    setName(category.name);
    setDescription(category.description || '');
    setMetaTitle(category.metaTitle || '');
    setMetaDescription(category.metaDescription || '');
    setMetaKeywords(category.metaKeywords || '');
    setDisplayOrder(category.displayOrder || 0);
    setIsFeatured(category.isFeatured || false);
    setStatus(category.status || 'Active');
    
    setImage(null);
    setBanner(null);
    setIcon(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category.');
      }
    }
  };

  const handleSave = async () => {
    if (!name) return alert('Category Name is required.');
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('metaTitle', metaTitle);
    formData.append('metaDescription', metaDescription);
    formData.append('metaKeywords', metaKeywords);
    formData.append('displayOrder', displayOrder);
    formData.append('isFeatured', isFeatured);
    formData.append('status', status);
    
    if (image) formData.append('image', image);
    if (banner) formData.append('banner', banner);
    if (icon) formData.append('icon', icon);

    try {
      if (editItem) {
        await api.put(`/categories/${editItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      setEditItem(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">Categories</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your product categories</p>
          </div>
          <button onClick={openAddModal} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-md flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
            Add Category
          </button>
        </div>
        
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden p-6">
           <div className="mb-6">
              <div className="relative w-80">
                <svg className="w-5 h-5 absolute left-4 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" placeholder="Search categories..." className="pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm w-full focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all font-medium placeholder-slate-400" />
              </div>
           </div>
           
           <div className="overflow-x-auto -mx-6 px-6">
             <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Image</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item) => (
                <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    {item.imageUrl ? (
                      <img src={`https://ampslight-server.onrender.com${item.imageUrl}`} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-slate-100" />
                    ) : (
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400 font-bold">No Img</div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">/{item.slug}</p>
                    {item.isFeatured && <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded mt-1">Featured</span>}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-600">{item.displayOrder}</td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button onClick={() => openEditModal(item)} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#4f46e5] hover:border-[#4f46e5]/30 transition-all shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm ml-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? "Edit Category" : "Add New Category"} onSave={handleSave}>
        <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar space-y-8">
          
          {/* Basic Information */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category Description *</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all resize-none" />
              </div>
            </div>
          </section>

          {/* Media */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">Media</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category Image *</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category Banner Image</label>
                <input type="file" onChange={(e) => setBanner(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category Icon</label>
                <input type="file" onChange={(e) => setIcon(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer" />
              </div>
            </div>
          </section>

          {/* SEO */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Title</label>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Description</label>
                <textarea rows="2" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Keywords</label>
                <input type="text" placeholder="Comma separated..." value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
            </div>
          </section>

          {/* Settings */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Display Order</label>
                <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="col-span-2 pt-2 flex items-center gap-3">
                <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-5 h-5 text-[#4f46e5] rounded border-slate-300 focus:ring-[#4f46e5]" />
                <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700 cursor-pointer">Featured Category (Yes)</label>
              </div>
            </div>
          </section>

        </div>
        
        {isSubmitting && <div className="text-sm text-blue-500 font-semibold mt-4 text-center">Saving Changes...</div>}
      </Modal>
    </>
  );
}
