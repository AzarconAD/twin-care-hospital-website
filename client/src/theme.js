// Single source of truth for hex values needed in inline styles — specifically
// for colors chosen dynamically per data item (e.g. category tabs), which
// Tailwind's JIT compiler can't turn into class names at runtime.
// These values MUST stay in sync with tailwind.config.js — if you change a
// color there, change it here too.
export const THEME_COLORS = {
  primary: '#0544AB',
  secondary: '#10B981',
  accent: '#E63946',
  cream: '#F7FAF6',
  ink: '#1A2E2E',
  border: '#E7E7E5',
  white: '#FFFFFF',
};
