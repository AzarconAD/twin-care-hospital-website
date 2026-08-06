import React from 'react'
import { motion } from 'framer-motion'

export default function DoctorEditModal({
  isModalOpen,
  setIsModalOpen,
  editingDoctor,
  formData,
  setFormData,
  formError,
  formLoading,
  handleFormChange,
  handleSaveDoctor,
  handleDeleteDoctor
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white z-10">
          <h3 className="font-display text-xl text-primary">
            {editingDoctor ? 'Edit Doctor' : 'Create New Doctor'}
          </h3>
          <button onClick={() => setIsModalOpen(false)} className="text-primary/50 hover:text-primary transition-colors text-2xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSaveDoctor} className="p-6 flex flex-col gap-5">
          {formError && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-accent font-body text-sm">
              {formError}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Name *</label>
              <input required name="name" value={formData.name} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="e.g. Dr. Carla Mendoza" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Postfix</label>
              <input name="postfix" value={formData.postfix} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="e.g. MD, PhD" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Specialty *</label>
              <input required name="specialty" value={formData.specialty} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="e.g. Cardiology" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Category *</label>
              <select required name="category" value={formData.category} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary bg-white">
                <option value="emergency">Emergency & Urgent Care</option>
                <option value="wellness">Wellness & Preventive Care</option>
                <option value="diagnostic">Diagnostic & Specialty Care</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Bio *</label>
            <textarea required name="bio" value={formData.bio} onChange={handleFormChange} rows={3} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary resize-none" placeholder="Short biography..." />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Photo</label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full font-body text-sm text-primary/70
                    file:mr-3 file:py-2 file:px-4
                    file:rounded-lg file:border file:border-border
                    file:text-xs file:font-semibold file:font-body
                    file:bg-white file:text-primary
                    hover:file:bg-cream cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      setFormData(prev => ({ ...prev, photo: ev.target.result }))
                    }
                    reader.readAsDataURL(file)
                  }}
                />
                <p className="font-body text-[11px] text-primary/40 mt-1.5">
                  Image stored as a data URL. Swap for a hosted URL before production.
                </p>
              </div>

              {/* Live preview */}
              {formData.photo && (
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary/20 shrink-0 bg-cream flex items-center justify-center">
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-5 border-t border-border flex items-center justify-between">
            {editingDoctor ? (
              <button type="button" onClick={handleDeleteDoctor} disabled={formLoading} className="text-accent hover:text-accent/80 font-body text-sm font-semibold transition-colors disabled:opacity-50">
                Delete Doctor
              </button>
            ) : <div></div>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-body text-sm text-primary/60 hover:text-primary transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={formLoading} className="main-button px-5 py-2 rounded-lg font-body text-sm font-semibold disabled:opacity-50">
                {formLoading ? 'Saving...' : 'Save Doctor'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
