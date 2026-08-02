import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Lightbox({ src, alt = "Image preview", onClose }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (src) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-ink/50 hover:bg-ink transition-colors rounded-full"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Image Container */}
          <motion.img
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking the image itself
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-ink/50"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
