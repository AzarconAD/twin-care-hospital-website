import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, ShieldCheck, Edit, Plus, Trash2, Calendar, Star } from 'lucide-react'
import { checkAdminSession, adminLogout, getNews, createNews, updateNews, deleteNews } from '../api/index.js'

export default function AdminNews() {
  const navigate = useNavigate()
  const location = useLocation()

  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '', tag: '', tagColor: 'primary', date: '', excerpt: '', image: '', featured: false
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    checkAdminSession()
      .then(({ authenticated }) => {
        if (!authenticated) {
          navigate('/admin/login', { replace: true })
          return Promise.reject('Not authenticated')
        }
        return getNews()
      })
      .then((data) => {
        setNews(data)
      })
      .catch((err) => {
        if (err !== 'Not authenticated') {
          setError(err.message)
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const handleLogout = async () => {
    try {
      await adminLogout()
    } catch {}
    navigate('/admin/login', { replace: true })
  }

  const openCreateModal = () => {
    setEditingItem(null)
    const today = new Date().toISOString().split('T')[0]
    setFormData({
      title: '', tag: 'Announcement', tagColor: 'primary', date: today, excerpt: '', image: '', featured: false
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    // Convert ISO date string to YYYY-MM-DD for input[type="date"]
    const dateStr = new Date(item.date).toISOString().split('T')[0]
    setFormData({
      title: item.title || '',
      tag: item.tag || '',
      tagColor: item.tagColor || 'primary',
      date: dateStr,
      excerpt: item.excerpt || '',
      image: item.image || '',
      featured: item.featured || false
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)
    
    try {
      // If we are setting this article to featured, we should optimistically un-feature others locally,
      // but the server also handles this.
      let result;
      if (editingItem) {
        result = await updateNews(editingItem._id, formData)
        setNews(prev => prev.map(n => n._id === result._id ? result : (formData.featured ? { ...n, featured: false } : n)))
      } else {
        result = await createNews(formData)
        setNews(prev => {
          const updatedList = formData.featured ? prev.map(n => ({ ...n, featured: false })) : prev;
          return [result, ...updatedList].sort((a, b) => new Date(b.date) - new Date(a.date));
        })
      }
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news article? This cannot be undone.")) {
      return
    }
    
    try {
      await deleteNews(id)
      setNews(prev => prev.filter(n => n._id !== id))
    } catch (err) {
      alert(`Failed to delete: ${err.message}`)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck size={18} color="white" />
            </div>
            <div>
              <h1 className="font-display text-lg text-primary leading-none">Admin Dashboard</h1>
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary/50 mt-0.5">
                Twin Care Hospital
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center bg-cream rounded-lg p-1 border border-border">
            <Link 
              to="/admin/dashboard" 
              className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/dashboard' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
            >
              Submissions
            </Link>
            <Link 
              to="/admin/doctors" 
              className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/doctors' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
            >
              Doctors
            </Link>
            <Link 
              to="/admin/news" 
              className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/news' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
            >
              News
            </Link>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-body text-sm text-primary/60 hover:text-accent transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-display text-2xl text-primary mb-1">News &amp; Updates</h2>
            <p className="font-body text-sm text-primary/60">
              Manage articles displayed on the public home page.
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={openCreateModal}
            className="main-button px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Article
          </motion.button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 text-primary/40">
              <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-secondary animate-spin" />
              <p className="font-mono text-xs uppercase tracking-widest">Loading…</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl px-5 py-4 text-accent font-body text-sm">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-primary/40" size={24} />
            </div>
            <h3 className="font-display text-lg text-ink mb-2">No news articles yet</h3>
            <p className="font-body text-sm text-ink/60 mb-6 max-w-sm mx-auto">
              Create your first announcement or update to display it on the home page.
            </p>
            <button onClick={openCreateModal} className="secondary-button px-4 py-2 rounded-lg text-sm font-semibold">
              Create Article
            </button>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-cream/60">
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3 w-16">Image</th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">Title &amp; Tag</th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">Date</th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">Status</th>
                    <th className="text-right font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item, i) => (
                    <tr
                      key={item._id}
                      className={`border-b border-border last:border-b-0 hover:bg-cream/40 transition-colors ${i % 2 === 0 ? '' : 'bg-cream/20'}`}
                    >
                      <td className="px-5 py-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-cream border border-border shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-body text-ink font-medium leading-snug mb-1">{item.title}</p>
                        <span className="inline-block font-mono text-[9px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-cream border border-border/60 text-ink/70">
                          {item.tag}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-body text-primary/70 whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-5 py-4">
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                            <Star size={10} className="fill-accent" /> Featured
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded text-primary/60 hover:text-secondary hover:bg-secondary/10 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 rounded text-primary/60 hover:text-accent hover:bg-accent/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      {/* Modal Form */}
      {isModalOpen && (
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
                <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Image URL *</label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <input required name="image" value={formData.image} onChange={handleFormChange} className="w-full sm:flex-1 p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="https://..." />
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-border shrink-0 bg-cream flex items-center justify-center relative shadow-inner">
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
      )}
    </div>
  )
}
