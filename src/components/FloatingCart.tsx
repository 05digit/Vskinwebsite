import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCartProps {
  onClick: () => void;
}

export function FloatingCart({ onClick }: FloatingCartProps) {
  const { totalItems } = useCart();

  // Only render when there are items in cart
  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={onClick}
        className="fixed bottom-6 right-6 z-40 bg-brown-dark text-white p-4 rounded-full shadow-lg hover:bg-brown transition-colors group"
        aria-label="Shopping cart"
      >
        <ShoppingBag className="w-6 h-6" />
        <AnimatePresence mode="wait">
          <motion.span
            key={totalItems}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute -top-1 -right-1 bg-white text-brown-dark text-xs min-w-6 h-6 px-1.5 rounded-full flex items-center justify-center font-medium border-2 border-brown-dark"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </motion.span>
        </AnimatePresence>
        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-brown-dark text-white px-3 py-1.5 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          View Cart
        </span>
      </motion.button>
    </AnimatePresence>
  );
}