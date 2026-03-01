import { useParams, Link } from 'react-router';
import { ArrowLeft, CheckCircle, ShoppingBag } from 'lucide-react';
import { products } from '../data/products';
import { useState } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export function ProductPage() {
  const { productId } = useParams();
  const product = products.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-brown-dark mb-4">Product Not Found</h2>
          <Link to="/shop" className="text-brown hover:text-brown-dark">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 600);
  };

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="bg-cream">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-brown hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      {/* Product Detail */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Image */}
            <div>
              <div className="aspect-[3/4] bg-white overflow-hidden md:sticky md:top-24 shadow-elevated image-overlay">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <p className="text-gold text-sm tracking-widest uppercase mb-3">{product.category}</p>
                <h1 className="text-brown-dark mb-4">{product.name}</h1>
                <p className="text-brown leading-relaxed mb-6">{product.description}</p>
                <div className="text-brown-dark mb-8">€{product.price}</div>

                {/* Add to Cart */}
                <div className="border-t border-b border-gold/20 py-8 mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <label htmlFor="quantity" className="text-brown">Quantity:</label>
                    <div className="flex items-center border border-sand">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-cream transition-colors text-brown"
                      >
                        −
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center py-2 border-l border-r border-sand outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-cream transition-colors text-brown"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <motion.button
                    className="w-full bg-brown-dark text-white py-4 hover:bg-brown transition-colors flex items-center justify-center gap-2 mb-4 relative overflow-hidden"
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.98 }}
                    disabled={isAdding}
                  >
                    <motion.div
                      initial={false}
                      animate={isAdding ? { scale: [1, 1.2, 1], opacity: [1, 0] } : { scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {isAdding ? 'Added!' : `Add to Cart - €${(product.price * quantity).toFixed(2)}`}
                    </motion.div>
                    {isAdding && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.5, 0] }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-brown rounded-full"
                      />
                    )}
                  </motion.button>

                  <div className="flex items-center gap-3 text-sm text-brown">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Safe to use • EU approved • Cruelty free</span>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="mb-8">
                  <h3 className="text-brown-dark mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-brown flex-shrink-0 mt-0.5" />
                        <span className="text-brown">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Ingredients */}
                <div className="bg-cream p-6 border border-sand mb-8">
                  <h3 className="text-brown-dark mb-4">Key Ingredients</h3>
                  <div className="space-y-4">
                    {product.keyIngredients.map((ingredient, index) => (
                      <div key={index}>
                        <h4 className="text-brown-dark mb-1">{ingredient.name}</h4>
                        <p className="text-sm text-brown leading-relaxed">{ingredient.benefit}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/ingredients"
                    className="inline-block mt-6 text-brown-dark hover:text-brown transition-colors text-sm"
                  >
                    Learn more about our ingredients →
                  </Link>
                </div>

                {/* How to Use */}
                <div className="mb-8">
                  <h3 className="text-brown-dark mb-4">How to Use</h3>
                  <ol className="space-y-3">
                    {product.howToUse.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brown-dark text-white flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="text-brown pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-cream border-t border-sand">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2 className="text-brown-dark mb-12 text-center">You May Also Like</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group bg-white border border-sand hover:border-brown transition-all duration-300 overflow-hidden"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-cream">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-brown mb-2">{relatedProduct.category}</p>
                    <h3 className="text-brown-dark mb-3">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-brown-dark">€{relatedProduct.price}</span>
                      <span className="text-brown text-sm group-hover:text-brown-dark transition-colors">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-sand mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-brown" />
              </div>
              <h4 className="text-brown-dark mb-2">EU Approved</h4>
              <p className="text-sm text-brown">
                Meets European Union safety standards
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-sand mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-brown" />
              </div>
              <h4 className="text-brown-dark mb-2">Natural Ingredients</h4>
              <p className="text-sm text-brown">
                Carefully selected from nature
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-sand mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-brown" />
              </div>
              <h4 className="text-brown-dark mb-2">Safe for All Skin</h4>
              <p className="text-sm text-brown">
                Gentle, effective formulas
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}