import React, { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import api from '../api/axiosInstance';

export default function Subcategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubcategories = async () => {
    try {
      const { data } = await api.get('/subcategories');
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!name || !selectedCategory) return alert('Name and Category are required.');
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', selectedCategory);
    if (image) formData.append('image', image);

    try {
      await api.post('/subcategories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      setSelectedCategory('');
      setImage(null);
      fetchSubcategories();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      alert('Failed to save subcategory.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">Subcategories</h2>
            <p className="text-sm text-slate-500 mt-1">Manage product subcategories</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-md flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
            Add Subcategory
          </button>
        </div>
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden p-6">
           <div className="mb-6">
              <div className="relative w-80">
                <svg className="w-5 h-5 absolute left-4 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" placeholder="Search subcategories..." className="pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm w-full focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all font-medium placeholder-slate-400" />
              </div>
           </div>
           <div className="overflow-x-auto -mx-6 px-6">
             <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Image</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Parent Category</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((item) => (
                <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 align-top">
                    {item.imageUrl ? (
                      <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-slate-100 mt-1" />
                    ) : (
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400 font-bold mt-1">No Img</div>
                    )}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800 align-top pt-6">{item.name}</td>
                  <td className="py-4 px-4 text-sm text-slate-500 font-medium align-top pt-6">{item.category?.name || 'Unknown'}</td>
                  <td className="py-4 px-4 text-sm text-slate-500 font-medium align-top pt-6 max-w-sm">{item.description}</td>
                  <td className="py-4 px-4 text-right whitespace-nowrap align-top pt-4">
                    <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#4f46e5] hover:border-[#4f46e5]/30 transition-all shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm ml-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Subcategory" onSave={handleSave}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Subcategory Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Parent Category</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all appearance-none"
          >
            <option value="">Select a category...</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
          <textarea 
            rows="3" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Subcategory Image</label>
          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center">
            <label className="px-4 py-3 bg-slate-100 border-r border-slate-200 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors">
              Choose File
              <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])}/>
            </label>
            <span className="px-4 text-sm text-slate-500">{image ? image.name : 'No file chosen'}</span>
          </div>
        </div>

        {isSubmitting && <div className="text-sm text-blue-500 font-semibold mt-2">Saving...</div>}
      </Modal>
    </>
  );
}
