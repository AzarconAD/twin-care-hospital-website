import React from 'react'
import { motion } from 'framer-motion'
import { X, Loader2, Trash2, ArchiveRestore } from 'lucide-react'

export default function ContactReplyModal({ 
  view,
  selectedContact, 
  closeModal, 
  formatDate, 
  adminEmail, 
  replyMessage, 
  setReplyMessage, 
  isReplying, 
  isDeleting,
  replyStatus, 
  handleReply,
  handleDelete,
  handleRestore,
  handlePermanentDelete
}) {
  if (!selectedContact) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={closeModal}
          className="absolute top-5 right-5 text-primary/40 hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>
        
        <h3 className="font-display text-xl text-primary mb-1">Message from {selectedContact.name}</h3>
        <p className="font-mono text-[10px] text-primary/40 mb-4">{formatDate(selectedContact.submittedAt)} • {selectedContact.email}</p>
        
        <div className="bg-cream/30 border border-border rounded-xl p-4 font-body text-ink/80 text-sm leading-relaxed max-h-[30vh] overflow-y-auto mb-2">
          {selectedContact.message.split('\n').map((para, idx) => (
            <p key={idx} className="mb-2 last:mb-0 break-words whitespace-pre-wrap">{para || '\u00A0'}</p>
          ))}
        </div>

        {/* Action Section */}
        {view === 'inbox' ? (
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-[10px] uppercase tracking-wider text-primary/60">Reply</h4>
              {adminEmail && (
                <span className="font-mono text-[10px] text-primary/50">
                  Replying as: <span className="font-medium text-primary/70">{adminEmail}</span>
                </span>
              )}
            </div>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Write your response here..."
              className="w-full bg-cream/20 border border-border rounded-xl p-3 font-body text-sm text-ink focus:outline-none focus:border-primary/30 transition-colors resize-none h-24"
              disabled={isReplying}
            />
            
            {replyStatus && (
              <div className={`text-xs font-body p-2 rounded-lg ${replyStatus.type === 'error' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                {replyStatus.message}
              </div>
            )}
            
            <div className="flex justify-between items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={isReplying || isDeleting}
                className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Move to trash"
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg font-body text-sm text-primary/60 hover:text-primary transition-colors"
                  disabled={isReplying || isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={isReplying || isDeleting || !replyMessage.trim() || replyStatus?.type === 'success'}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-body text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {isReplying ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </span>
                  ) : replyStatus?.type === 'success' ? (
                    'Sent!'
                  ) : (
                    'Send Reply'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-border">
            {replyStatus && (
              <div className={`text-xs font-body p-2 rounded-lg mb-4 ${replyStatus.type === 'error' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                {replyStatus.message}
              </div>
            )}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
              <button
                onClick={handlePermanentDelete}
                disabled={isReplying || isDeleting}
                className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 rounded-lg font-body text-sm text-accent hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Permanently Delete
              </button>
              
              <div className="w-full sm:w-auto flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-body text-sm text-primary/60 hover:text-primary transition-colors"
                  disabled={isReplying || isDeleting}
                >
                  Close
                </button>
                <button
                  onClick={handleRestore}
                  disabled={isReplying || isDeleting}
                  className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white rounded-lg font-body text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isReplying ? <Loader2 size={16} className="animate-spin" /> : <ArchiveRestore size={16} />}
                  Restore Message
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
