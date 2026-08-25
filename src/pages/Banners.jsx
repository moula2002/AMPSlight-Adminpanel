import React, { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import api from '../api/axiosInstance';

export default function Banners() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [image, setImage] = useState(null);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editItem, setEditItem] = useState(null);

  const fetchBanners = async () => {
    try {
      const { data } = await api.get('/banners');
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setTitle('');
    setLinkUrl('');
    setImage(null);
    setDisplayOrder(0);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditItem(banner);
    setTitle(banner.title);
    setLinkUrl(banner.linkUrl || '');
    setDisplayOrder(banner.displayOrder || 0);
    setIsActive(banner.isActive !== undefined ? banner.isActive : true);
    setImage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await api.delete(`/banners/${id}`);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Failed to delete banner.');
      }
    }
  };

  const handleSave = async () => {
    if (!title) return alert('Banner Title is required.');
    if (!editItem && !image) return alert('Banner Image is required.');
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('linkUrl', linkUrl);
    formData.append('displayOrder', displayOrder);
    formData.append('isActive', isActive);
    
    if (image) formData.append('image', image);
    
    try {
      if (editItem) {
        await api.put(`/banners/${editItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/banners', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert(error.response?.data?.message || 'Error saving banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format image URL (assuming server is running on localhost:5000 in dev or same host)
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseURL = api.defaults.baseURL || 'http://localhost:5000/api';
    return `${baseURL.replace('/api', '')}${path}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Banners</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage promotional banners and hero images</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-200 flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <img 
                src={getImageUrl(banner.imageUrl)} 
                alt={banner.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-[#4f46e5] hover:bg-white rounded-lg shadow-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-red-500 hover:bg-white rounded-lg shadow-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md ${banner.isActive ? 'bg-emerald-100/90 text-emerald-700' : 'bg-rose-100/90 text-rose-700'}`}>
                {banner.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{banner.title}</h3>
              {banner.linkUrl && (
                <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4f46e5] hover:underline mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  {banner.linkUrl}
                </a>
              )}
              <div className="mt-auto pt-4 flex items-center justify-between text-sm text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                  Order: {banner.displayOrder}
                </span>
                <span>{new Date(banner.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium text-slate-600">No banners found</p>
            <p className="text-sm mt-1">Click "Add Banner" to upload your first banner.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? 'Edit Banner' : 'Add New Banner'} onSave={handleSave}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 bg-slate-50/50"
                placeholder="e.g. Summer Sale 2026"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Banner Image {!editItem && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                accept="image/*"
              />
            </div>
          </div>
      </Modal>
    </div>
  );
}
