import React from 'react'
import { motion } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'

export default function ContactReplyModal({ 
  selectedContact, 
  closeModal, 
  formatDate, 
  adminEmail, 
  replyMessage, 
  setReplyMessage, 
  isReplying, 
  replyStatus, 
  handleReply 
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

        {/* Reply Section */}
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
          
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg font-body text-sm text-primary/60 hover:text-primary transition-colors"
              disabled={isReplying}
            >
              Cancel
            </button>
            <button
              onClick={handleReply}
              disabled={isReplying || !replyMessage.trim() || replyStatus?.type === 'success'}
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
      </motion.div>
    </div>
  )
}
