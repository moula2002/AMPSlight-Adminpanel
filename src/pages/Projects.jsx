import React, { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import api from '../api/axiosInstance';

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editItem, setEditItem] = useState(null);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setTitle('');
    setCategory('');
    setLocation('');
    setDescription('');
    setImage(null);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditItem(project);
    setTitle(project.title);
    setCategory(project.category || '');
    setLocation(project.location || '');
    setDescription(project.description || '');
    setIsActive(project.isActive !== undefined ? project.isActive : true);
    setImage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project.');
      }
    }
  };

  const handleSave = async () => {
    if (!title || !category || !location || !description) return alert('All text fields are required.');
    if (!editItem && !image) return alert('Project Image is required.');
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('isActive', isActive);
    
    if (image) formData.append('image', image);
    
    try {
      if (editItem) {
        await api.put(`/projects/${editItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.message || 'Error saving project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format image URL
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const baseURL = api.defaults.baseURL || 'http://localhost:5000/api';
    return `${baseURL.replace('/api', '')}${path}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Projects</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage featured projects showcased on your website</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-200 flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <img 
                src={getImageUrl(project.imageUrl)} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => openEditModal(project)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-[#4f46e5] hover:bg-white rounded-lg shadow-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-red-500 hover:bg-white rounded-lg shadow-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="absolute top-3 left-3 flex gap-2">
                <div className="px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md bg-white/90 text-slate-700">
                  {project.category}
                </div>
                <div className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md ${project.isActive ? 'bg-emerald-100/90 text-emerald-700' : 'bg-rose-100/90 text-rose-700'}`}>
                  {project.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{project.title}</h3>
              {project.location && (
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {project.location}
                </p>
              )}
              <p className="text-sm text-slate-600 mt-3 line-clamp-2">{project.description}</p>
              
              <div className="mt-auto pt-4 flex items-center justify-between text-sm text-slate-400">
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-lg font-medium text-slate-600">No projects found</p>
            <p className="text-sm mt-1">Click "Add Project" to upload your first project.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? 'Edit Project' : 'Add New Project'} onSave={handleSave}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 bg-slate-50/50"
                placeholder="e.g. Nexus Tech Hub"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 bg-slate-50/50"
                  placeholder="e.g. Commercial"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 bg-slate-50/50"
                  placeholder="e.g. Silicon Valley, CA"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 bg-slate-50/50"
                placeholder="Brief description of the project..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Project Image {!editItem && <span className="text-red-500">*</span>}
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
