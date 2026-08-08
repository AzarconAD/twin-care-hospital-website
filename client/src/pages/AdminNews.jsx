import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit, ShieldCheck, Calendar, Star } from 'lucide-react'
import AdminHeader from '../components/admin/AdminHeader.jsx'
import NewsEditModal from '../components/admin/NewsEditModal.jsx'
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
  // 'url' = text input, 'upload' = local file picker
  const [photoMode, setPhotoMode] = useState('url')

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
    setPhotoMode('url')
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
    setPhotoMode('url')
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
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <AdminHeader handleLogout={handleLogout} />

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
          <div className="flex flex-col items-center justify-center py-24 bg-white/40 border-2 border-dashed border-primary/20 rounded-2xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Calendar size={28} className="text-primary/40" />
            </div>
            <p className="font-display text-xl text-primary/80 mb-1">No news articles yet</p>
            <p className="font-body text-sm text-primary/50 text-center max-w-sm mb-6">
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
            className="bg-white border border-border rounded-2xl shadow-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-primary/5">
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
                      className="border-b border-border last:border-b-0 hover:bg-slate-50 transition-colors bg-white"
                    >
                      <td className="px-5 py-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-slate-200 border border-border shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-body text-ink font-medium leading-snug mb-1">{item.title}</p>
                        <span className="inline-block font-mono text-[9px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-slate-200 border border-border/60 text-ink/70">
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

            <div className="px-5 py-4 border-t border-border bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/10 text-primary font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                  {news.length}
                </span>
                <p className="font-mono text-xs uppercase tracking-wider text-primary/70 font-semibold">
                  {news.length === 1 ? 'Article Total' : 'Articles Total'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <NewsEditModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        formLoading={formLoading}
        photoMode={photoMode}
        setPhotoMode={setPhotoMode}
        handleFormChange={handleFormChange}
        handleSave={handleSave}
      />
    </div>
  )
}
