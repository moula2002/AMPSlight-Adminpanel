import React, { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import api from '../api/axiosInstance';

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategoriesAndSubcategories = async () => {
    try {
      const [catRes, subcatRes] = await Promise.all([
        api.get('/categories'),
        api.get('/subcategories')
      ]);
      setCategories(catRes.data);
      setSubcategories(subcatRes.data);
    } catch (error) {
      console.error('Error fetching categories/subcategories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndSubcategories();
  }, []);

  const handleSave = async () => {
    if (!title || !selectedCategory) return alert('Title and Category are required.');
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', selectedCategory);
    if (selectedSubcategory) formData.append('subcategory', selectedSubcategory);
    if (image) formData.append('image', image);

    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setSelectedSubcategory('');
      setImage(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category?._id === selectedCategory
  );

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">Products</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your product catalog</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-md flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
            Add Product
          </button>
        </div>
        <div className="bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden p-6">
           <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <svg className="w-5 h-5 absolute left-4 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" placeholder="Search products..." className="pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm w-full focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all font-medium placeholder-slate-400" />
              </div>
              <select className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-[#4f46e5]/20 outline-none">
                <option>All Categories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
           </div>
           <div className="overflow-x-auto -mx-6 px-6">
             <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Image</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    {item.imageUrl ? (
                      <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title} className="w-10 h-14 object-cover rounded-md border border-slate-200" />
                    ) : (
                      <div className="w-10 h-14 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center text-[10px] text-slate-400 font-bold">Img</div>
                    )}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">{item.title}</td>
                  <td className="py-4 px-4 text-sm font-medium">
                    <span className="text-slate-800 font-bold">{item.category?.name || 'Unknown'}</span>
                    <span className="text-slate-400"> / {item.subcategory?.name || 'None'}</span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product" onSave={handleSave}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Product Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('');
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all appearance-none"
            >
              <option value="">Select Category...</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subcategory (Optional)</label>
            <select 
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all appearance-none disabled:opacity-50"
            >
              <option value="">Select Subcategory...</option>
              {filteredSubcategories.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
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
          <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
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
