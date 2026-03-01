import { Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoBlack from "figma:asset/eb1b823065c7209cd7e29aee6f33bbb5b174be44.png";

export function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -2 }
  };

  const underlineVariants = {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`bg-white border-b border-gold/20 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-soft'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Desktop Navigation - Left */}
          <div className="hidden md:flex items-center gap-10 flex-1">
            <motion.div
              variants={navLinkVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.1 }}
            >
              <Link
                to="/"
                className={`transition-colors relative group ${ 
                  isActive('/') ? 'text-brown-dark' : 'text-brown hover:text-brown-dark'
                }`}
              >
                Home
                <AnimatePresence>
                  {isActive('/') && (
                    <motion.span 
                      variants={underlineVariants}
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-gold origin-left"
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
            <motion.div
              variants={navLinkVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/shop"
                className={`transition-colors relative group ${
                  isActive('/shop') ? 'text-brown-dark' : 'text-brown hover:text-brown-dark'
                }`}
              >
                Shop
                <AnimatePresence>
                  {isActive('/shop') && (
                    <motion.span 
                      variants={underlineVariants}
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-gold origin-left"
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          </div>

          {/* Logo - Centered */}
          <Link to="/" className="flex items-center absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              src={logoBlack} 
              alt="VSkin" 
              className="h-12 md:h-16" 
            />
          </Link>

          {/* Desktop Navigation - Right */}
          <div className="hidden md:flex items-center gap-10 flex-1 justify-end">
            <motion.div
              variants={navLinkVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/about"
                className={`transition-colors relative group ${
                  isActive('/about') ? 'text-brown-dark' : 'text-brown hover:text-brown-dark'
                }`}
              >
                About
                <AnimatePresence>
                  {isActive('/about') && (
                    <motion.span 
                      variants={underlineVariants}
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-gold origin-left"
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
            <motion.div
              variants={navLinkVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/ingredients"
                className={`transition-colors relative group ${
                  isActive('/ingredients') ? 'text-brown-dark' : 'text-brown hover:text-brown-dark'
                }`}
              >
                Ingredients
                <AnimatePresence>
                  {isActive('/ingredients') && (
                    <motion.span 
                      variants={underlineVariants}
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-gold origin-left"
                    />
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span 
                animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-brown-dark origin-center"
              />
              <motion.span 
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full h-0.5 bg-brown-dark"
              />
              <motion.span 
                animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-brown-dark origin-center"
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden overflow-hidden border-t border-sand"
            >
              <div className="py-6 flex flex-col gap-4">
                <motion.div variants={mobileItemVariants}>
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`py-2 block ${isActive('/') ? 'text-brown-dark' : 'text-brown'}`}
                  >
                    Home
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    to="/shop"
                    onClick={() => setIsOpen(false)}
                    className={`py-2 block ${isActive('/shop') ? 'text-brown-dark' : 'text-brown'}`}
                  >
                    Shop
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    to="/about"
                    onClick={() => setIsOpen(false)}
                    className={`py-2 block ${isActive('/about') ? 'text-brown-dark' : 'text-brown'}`}
                  >
                    About
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    to="/ingredients"
                    onClick={() => setIsOpen(false)}
                    className={`py-2 block ${isActive('/ingredients') ? 'text-brown-dark' : 'text-brown'}`}
                  >
                    Ingredients
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}