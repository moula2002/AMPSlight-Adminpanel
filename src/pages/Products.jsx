import React, { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import api from '../api/axiosInstance';

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // Basic Information
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [brandName, setBrandName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  
  // Media & Documents
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState(null); // FileList
  const [datasheet, setDatasheet] = useState(null);
  const [brochure, setBrochure] = useState(null);
  
  // Pricing
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [taxPercentage, setTaxPercentage] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  
  // Inventory
  const [stockQuantity, setStockQuantity] = useState('');
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState('1');
  const [stockStatus, setStockStatus] = useState('In Stock'); // In Stock, Out Of Stock, Pre Order
  
  // Dynamic Arrays
  const [technicalSpecifications, setTechnicalSpecifications] = useState([{ name: '', value: '' }]);
  const [features, setFeatures] = useState(['']);
  const [applications, setApplications] = useState(['']);
  
  // SEO & Status
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [status, setStatus] = useState('Active');

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editItem, setEditItem] = useState(null);

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

  const openAddModal = () => {
    setEditItem(null);
    setTitle(''); setSku(''); setSelectedCategory(''); setSelectedSubcategory('');
    setBrandName(''); setModelNumber(''); setShortDescription(''); setFullDescription('');
    setMainImage(null); setGalleryImages(null); setDatasheet(null); setBrochure(null);
    setRegularPrice(''); setSalePrice(''); setTaxPercentage(''); setDiscountPercentage('');
    setStockQuantity(''); setMinimumOrderQuantity('1'); setStockStatus('In Stock');
    setTechnicalSpecifications([{ name: '', value: '' }]);
    setFeatures(['']); setApplications(['']);
    setMetaTitle(''); setMetaDescription(''); setMetaKeywords('');
    setIsFeatured(false); setIsNewArrival(false); setIsBestSeller(false); setIsTrending(false); setStatus('Active');
    
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditItem(product);
    setTitle(product.title); setSku(product.sku); 
    setSelectedCategory(product.category?._id || ''); setSelectedSubcategory(product.subcategory?._id || '');
    setBrandName(product.brandName || ''); setModelNumber(product.modelNumber || ''); 
    setShortDescription(product.shortDescription || ''); setFullDescription(product.fullDescription || '');
    
    setRegularPrice(product.regularPrice || ''); setSalePrice(product.salePrice || ''); 
    setTaxPercentage(product.taxPercentage || ''); setDiscountPercentage(product.discountPercentage || '');
    setStockQuantity(product.stockQuantity || ''); setMinimumOrderQuantity(product.minimumOrderQuantity || '1'); 
    setStockStatus(product.stockStatus || 'In Stock');
    
    setTechnicalSpecifications(product.technicalSpecifications?.length ? product.technicalSpecifications : [{ name: '', value: '' }]);
    setFeatures(product.features?.length ? product.features : ['']);
    setApplications(product.applications?.length ? product.applications : ['']);
    
    setMetaTitle(product.metaTitle || ''); setMetaDescription(product.metaDescription || ''); setMetaKeywords(product.metaKeywords || '');
    setIsFeatured(product.isFeatured || false); setIsNewArrival(product.isNewArrival || false); 
    setIsBestSeller(product.isBestSeller || false); setIsTrending(product.isTrending || false); setStatus(product.status || 'Active');
    
    setMainImage(null); setGalleryImages(null); setDatasheet(null); setBrochure(null);
    
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleSave = async () => {
    if (!title || !sku || !selectedCategory || !regularPrice || !stockQuantity) {
      return alert('Title, SKU, Category, Regular Price, and Stock Quantity are required.');
    }
    setIsSubmitting(true);
    
    const formData = new FormData();
    // Basic Info
    formData.append('title', title);
    formData.append('sku', sku);
    formData.append('category', selectedCategory);
    if (selectedSubcategory) formData.append('subcategory', selectedSubcategory);
    formData.append('brandName', brandName);
    formData.append('modelNumber', modelNumber);
    formData.append('shortDescription', shortDescription);
    formData.append('fullDescription', fullDescription);
    
    // Pricing
    formData.append('regularPrice', regularPrice);
    if (salePrice) formData.append('salePrice', salePrice);
    if (taxPercentage) formData.append('taxPercentage', taxPercentage);
    if (discountPercentage) formData.append('discountPercentage', discountPercentage);
    
    // Inventory
    formData.append('stockQuantity', stockQuantity);
    formData.append('minimumOrderQuantity', minimumOrderQuantity);
    formData.append('stockStatus', stockStatus);
    
    // SEO & Status
    formData.append('metaTitle', metaTitle);
    formData.append('metaDescription', metaDescription);
    formData.append('metaKeywords', metaKeywords);
    formData.append('isFeatured', isFeatured);
    formData.append('isNewArrival', isNewArrival);
    formData.append('isBestSeller', isBestSeller);
    formData.append('isTrending', isTrending);
    formData.append('status', status);
    
    // Clean up dynamic arrays before saving
    const cleanSpecs = technicalSpecifications.filter(s => s.name.trim() !== '' && s.value.trim() !== '');
    const cleanFeatures = features.filter(f => f.trim() !== '');
    const cleanApps = applications.filter(a => a.trim() !== '');
    
    formData.append('technicalSpecifications', JSON.stringify(cleanSpecs));
    formData.append('features', JSON.stringify(cleanFeatures));
    formData.append('applications', JSON.stringify(cleanApps));

    // Media
    if (mainImage) formData.append('mainImage', mainImage);
    if (datasheet) formData.append('datasheet', datasheet);
    if (brochure) formData.append('brochure', brochure);
    
    if (galleryImages && galleryImages.length > 0) {
      for (let i = 0; i < galleryImages.length; i++) {
        formData.append('galleryImages', galleryImages[i]);
      }
    }

    try {
      if (editItem) {
        await api.put(`/products/${editItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      setEditItem(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSubcategories = subcategories.filter(sub => sub.category?._id === selectedCategory);

  // Dynamic Array Handlers
  const handleSpecChange = (index, field, val) => {
    const newSpecs = [...technicalSpecifications];
    newSpecs[index][field] = val;
    setTechnicalSpecifications(newSpecs);
  };
  const handleFeatureChange = (index, val) => {
    const newF = [...features];
    newF[index] = val;
    setFeatures(newF);
  };
  const handleAppChange = (index, val) => {
    const newA = [...applications];
    newA[index] = val;
    setApplications(newA);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">Products</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your complete product catalog</p>
          </div>
          <button onClick={openAddModal} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-md flex items-center gap-2">
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
           </div>
           <div className="overflow-x-auto -mx-6 px-6">
             <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Image</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Info</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price / Stock</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 align-top pt-6">
                    {item.imageUrl ? (
                      <img src={`https://ampslight-server.onrender.com${item.imageUrl}`} alt={item.title} className="w-12 h-12 object-cover rounded-md border border-slate-200" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center text-[10px] text-slate-400 font-bold">Img</div>
                    )}
                  </td>
                  <td className="py-4 px-4 align-top pt-6">
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">SKU: {item.sku}</p>
                  </td>
                  <td className="py-4 px-4 align-top pt-6 text-sm font-medium">
                    <span className="text-slate-800 font-bold">{item.category?.name || 'Unknown'}</span>
                    <br/><span className="text-slate-400 text-xs">{item.subcategory?.name || 'No Subcategory'}</span>
                  </td>
                  <td className="py-4 px-4 align-top pt-6">
                    <p className="font-bold text-slate-800">₹{item.regularPrice}</p>
                    <p className={`text-xs font-bold mt-1 ${item.stockQuantity > 0 ? 'text-emerald-500' : 'text-red-500'}`}>Qty: {item.stockQuantity}</p>
                  </td>
                  <td className="py-4 px-4 align-top pt-6">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {item.status}
                    </span>
                    <div className="flex gap-1 mt-2">
                      {item.isFeatured && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">F</span>}
                      {item.isNewArrival && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded">N</span>}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap align-top pt-5">
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

      {/* OVERHAULED PRODUCT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? "Edit Product" : "Add New Product"} onSave={handleSave}>
        
        <div className="max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar space-y-8">
          
          {/* Section 1: Basic Information */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Code / SKU *</label>
                <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(''); }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all appearance-none">
                  <option value="">Select Category...</option>
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subcategory</label>
                <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} disabled={!selectedCategory} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all appearance-none disabled:opacity-50">
                  <option value="">Select Subcategory...</option>
                  {filteredSubcategories.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Name</label>
                <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Model Number</label>
                <input type="text" value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
                <textarea rows="2" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Description</label>
                <textarea rows="4" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all resize-none" />
              </div>
            </div>
          </section>

          {/* Section 2: Media & Documents */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</span>
              Media & Documents
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Main Product Image *</label>
                <input type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-[#4f46e5] hover:file:bg-indigo-100 cursor-pointer" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Gallery Images (Multiple)</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setGalleryImages(e.target.files)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-[#4f46e5] hover:file:bg-indigo-100 cursor-pointer" />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Datasheet (PDF)</label>
                <input type="file" accept=".pdf" onChange={(e) => setDatasheet(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Brochure (PDF)</label>
                <input type="file" accept=".pdf" onChange={(e) => setBrochure(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer" />
              </div>
            </div>
          </section>

          {/* Section 3: Pricing & Inventory */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">3</span>
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Regular Price *</label>
                <input type="number" value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sale Price</label>
                <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tax Percentage (GST %)</label>
                <input type="number" value={taxPercentage} onChange={(e) => setTaxPercentage(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Discount Percentage</label>
                <input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              
              <div className="col-span-2 md:col-span-1 mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity *</label>
                <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div className="col-span-2 md:col-span-1 mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Order Quantity</label>
                <input type="number" value={minimumOrderQuantity} onChange={(e) => setMinimumOrderQuantity(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Status</label>
                <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all appearance-none">
                  <option value="In Stock">In Stock</option>
                  <option value="Out Of Stock">Out Of Stock</option>
                  <option value="Pre Order">Pre Order</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 4: Specifications, Features, Applications */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">4</span>
              Technical Specifications & Highlights
            </h3>
            
            <div className="space-y-6">
              {/* Dynamic Specs */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Technical Specifications</label>
                <div className="space-y-2">
                  {technicalSpecifications.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" placeholder="Spec Name (e.g. Wattage)" value={spec.name} onChange={(e) => handleSpecChange(i, 'name', e.target.value)} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4f46e5]/20 outline-none" />
                      <input type="text" placeholder="Value (e.g. 18W)" value={spec.value} onChange={(e) => handleSpecChange(i, 'value', e.target.value)} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4f46e5]/20 outline-none" />
                      <button type="button" onClick={() => setTechnicalSpecifications(technicalSpecifications.filter((_, idx) => idx !== i))} className="p-2 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setTechnicalSpecifications([...technicalSpecifications, { name: '', value: '' }])} className="text-sm font-bold text-[#4f46e5] hover:text-[#4338ca] flex items-center gap-1 mt-2">
                    + Add More Specifications
                  </button>
                </div>
              </div>

              {/* Dynamic Features */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Product Features</label>
                <div className="space-y-2">
                  {features.map((feature, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" placeholder="e.g. Energy Efficient" value={feature} onChange={(e) => handleFeatureChange(i, e.target.value)} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4f46e5]/20 outline-none" />
                      <button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="p-2 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setFeatures([...features, ''])} className="text-sm font-bold text-[#4f46e5] hover:text-[#4338ca] flex items-center gap-1 mt-2">
                    + Add Feature Option
                  </button>
                </div>
              </div>

              {/* Dynamic Applications */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Product Applications</label>
                <div className="space-y-2">
                  {applications.map((app, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" placeholder="e.g. Commercial Building" value={app} onChange={(e) => handleAppChange(i, e.target.value)} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4f46e5]/20 outline-none" />
                      <button type="button" onClick={() => setApplications(applications.filter((_, idx) => idx !== i))} className="p-2 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setApplications([...applications, ''])} className="text-sm font-bold text-[#4f46e5] hover:text-[#4338ca] flex items-center gap-1 mt-2">
                    + Add Application Option
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: SEO & Status */}
          <section>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">5</span>
              SEO & Visibility Flags
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Title</label>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Description</label>
                <textarea rows="2" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Keywords</label>
                <input type="text" placeholder="Comma separated..." value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all" />
              </div>
              
              <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="f1" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 text-[#4f46e5] rounded border-slate-300" />
                  <label htmlFor="f1" className="text-xs font-bold text-slate-700 cursor-pointer">Featured</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="f2" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="w-4 h-4 text-[#4f46e5] rounded border-slate-300" />
                  <label htmlFor="f2" className="text-xs font-bold text-slate-700 cursor-pointer">New Arrival</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="f3" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="w-4 h-4 text-[#4f46e5] rounded border-slate-300" />
                  <label htmlFor="f3" className="text-xs font-bold text-slate-700 cursor-pointer">Best Seller</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="f4" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="w-4 h-4 text-[#4f46e5] rounded border-slate-300" />
                  <label htmlFor="f4" className="text-xs font-bold text-slate-700 cursor-pointer">Trending</label>
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]/50 outline-none transition-all appearance-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </section>

        </div>
        
        {isSubmitting && <div className="text-sm text-blue-500 font-semibold mt-4 text-center">Saving Changes...</div>}
      </Modal>
    </>
  );
}
