import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sand">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brown-dark" />
                <h2 className="text-brown-dark">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cream rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-brown" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <ShoppingBag className="w-16 h-16 text-sand mx-auto mb-4" />
                  <p className="text-brown mb-6">Your cart is empty</p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="inline-block bg-brown-dark text-white px-6 py-3 hover:bg-brown transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 pb-4 border-b border-sand last:border-0"
                      >
                        {/* Image */}
                        <Link
                          to={`/product/${item.id}`}
                          onClick={onClose}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover bg-cream"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.id}`}
                            onClick={onClose}
                            className="text-brown-dark hover:text-brown transition-colors block mb-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-brown-dark mb-3">€{item.price}</p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 border border-sand hover:bg-cream transition-colors flex items-center justify-center text-brown"
                            >
                              −
                            </button>
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-8 text-center text-brown-dark"
                              >
                                {item.quantity}
                              </motion.span>
                            </AnimatePresence>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 border border-sand hover:bg-cream transition-colors flex items-center justify-center text-brown"
                            >
                              +
                            </button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto p-2 hover:bg-cream rounded transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4 text-brown" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="border-t border-sand p-6 space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-brown">Subtotal ({totalItems} items)</span>
                  <motion.span
                    key={totalPrice}
                    initial={{ scale: 1.2, color: '#B89968' }}
                    animate={{ scale: 1, color: '#5C4033' }}
                    transition={{ duration: 0.3 }}
                    className="text-brown-dark"
                  >
                    €{totalPrice.toFixed(2)}
                  </motion.span>
                </div>
                
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="btn-primary block w-full bg-brown-dark text-white py-4 text-center hover:bg-brown transition-colors"
                >
                  Proceed to Checkout
                </Link>
                
                <button
                  onClick={onClose}
                  className="w-full border border-sand text-brown-dark py-3 hover:bg-cream transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}