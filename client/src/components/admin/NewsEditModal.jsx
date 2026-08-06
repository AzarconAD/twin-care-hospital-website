import React from 'react'
import { motion } from 'framer-motion'

export default function NewsEditModal({
  isModalOpen,
  setIsModalOpen,
  editingItem,
  formData,
  setFormData,
  formError,
  formLoading,
  photoMode,
  setPhotoMode,
  handleFormChange,
  handleSave
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
            {editingItem ? 'Edit Article' : 'Create Article'}
          </h3>
          <button onClick={() => setIsModalOpen(false)} className="text-primary/50 hover:text-primary transition-colors text-2xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
          {formError && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-accent font-body text-sm">
              {formError}
            </div>
          )}
          
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Headline / Title *</label>
            <input required name="title" value={formData.title} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="e.g. New Wing Opens" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Tag Name *</label>
              <input required name="tag" value={formData.tag} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="e.g. Announcement" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Tag Color *</label>
              <select required name="tagColor" value={formData.tagColor} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary bg-white">
                <option value="primary">Primary (Blue)</option>
                <option value="secondary">Secondary (Green)</option>
                <option value="accent">Accent (Red)</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Publish Date *</label>
              <input required type="date" name="date" value={formData.date} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Excerpt *</label>
            <textarea required name="excerpt" value={formData.excerpt} onChange={handleFormChange} rows={3} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary resize-none" placeholder="Short summary for the card..." />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Image *</label>

            {/* Mode toggle */}
            <div className="flex items-center bg-cream rounded-lg p-0.5 border border-border w-fit mb-3">
              <button
                type="button"
                onClick={() => setPhotoMode('url')}
                className={`px-3 py-1.5 rounded-md font-body text-xs font-medium transition-colors ${
                  photoMode === 'url' ? 'bg-white shadow-sm text-primary' : 'text-primary/50 hover:text-primary'
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setPhotoMode('upload')}
                className={`px-3 py-1.5 rounded-md font-body text-xs font-medium transition-colors ${
                  photoMode === 'upload' ? 'bg-white shadow-sm text-primary' : 'text-primary/50 hover:text-primary'
                }`}
              >
                Upload file
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {photoMode === 'url' ? (
                <input
                  required
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  className="w-full sm:flex-1 p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary"
                  placeholder="https://example.com/image.jpg"
                />
              ) : (
                <div className="w-full sm:flex-1">
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
                        setFormData(prev => ({ ...prev, image: ev.target.result }))
                      }
                      reader.readAsDataURL(file)
                    }}
                  />
                  <p className="font-body text-[11px] text-primary/40 mt-1.5">
                    Image stored as a data URL. Swap for a hosted URL before production.
                  </p>
                </div>
              )}

              {/* Live preview — same for both modes */}
              <div className="w-32 h-20 rounded-lg overflow-hidden border border-border shrink-0 bg-cream flex items-center justify-center shadow-inner">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                ) : (
                  <span className="font-mono text-[10px] text-primary/40 uppercase tracking-widest">Preview</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-cream/40 rounded-lg border border-border/60">
            <input 
              type="checkbox" 
              id="featured-checkbox" 
              name="featured" 
              checked={formData.featured} 
              onChange={handleFormChange}
              className="w-4 h-4 text-secondary rounded focus:ring-secondary border-border"
            />
            <label htmlFor="featured-checkbox" className="font-body text-sm text-ink cursor-pointer select-none">
              <span className="font-medium block">Set as Featured Article</span>
              <span className="text-xs text-ink/60">This will appear largest on the home page. (Only one article can be featured at a time)</span>
            </label>
          </div>
          
          <div className="mt-4 pt-5 border-t border-border flex items-center justify-end">
            <div className="flex gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-body text-sm text-primary/60 hover:text-primary transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={formLoading} className="main-button px-5 py-2 rounded-lg font-body text-sm font-semibold disabled:opacity-50">
                {formLoading ? 'Saving...' : 'Save Article'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
