import { Link } from 'react-router';
import { Home, ShoppingBag, Search } from 'lucide-react';
import { motion } from 'motion/react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <h1 className="text-9xl md:text-[12rem] font-display text-gold/20 leading-none mb-4">
            404
          </h1>
          
          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-display text-brown-dark mb-4">
            Page Not Found
          </h2>
          
          <p className="text-brown text-lg mb-12 leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-gold text-white rounded-full hover:shadow-elevated transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-gold text-brown-dark rounded-full hover:bg-sand transition-all duration-300 hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop Products</span>
            </Link>
          </div>

          {/* Decorative Element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 text-brown/30"
          >
            <Search className="w-12 h-12 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
