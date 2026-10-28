import { Link } from 'react-router';
import { useState } from 'react';
import { products } from '../data/products';
import { ScrollReveal } from '../components/ScrollReveal';

export function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Cleanse', 'Tone', 'Hydrate', 'Target'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-cream texture-subtle py-16 sm:py-20 md:py-24 border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <p className="text-gold mb-3 sm:mb-4 tracking-widest uppercase text-xs sm:text-sm">Complete Collection</p>
          <h1 className="text-brown-dark mb-4 sm:mb-6">Discover VSkin</h1>
          <p className="text-brown max-w-2xl mx-auto mb-6 sm:mb-8">
            Five essential products, each formulated to reveal your skin's natural radiance and work in harmony with your daily routine.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-sand sticky top-20 z-40 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 border transition-all shadow-soft hover:shadow-soft-lg ${
                  selectedCategory === category
                    ? 'bg-gradient-brown-dark text-white border-gold shadow-soft-lg gold-shimmer'
                    : 'bg-white text-brown border-sand hover:border-gold'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <Link
                  to={`/product/${product.id}`}
                  className="group bg-white border border-sand hover:border-gold shadow-soft card-hover overflow-hidden block"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-cream relative image-overlay image-zoom">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-brown mb-2">{product.category}</p>
                    <h3 className="text-brown-dark mb-3">{product.name}</h3>
                    <p className="text-brown text-sm mb-4 line-clamp-3">{product.description}</p>
                    
                    {/* Benefits Preview */}
                    <div className="mb-4">
                      <p className="text-xs text-brown mb-2">Key Benefits:</p>
                      <ul className="text-xs text-brown space-y-1">
                        {product.benefits.slice(0, 2).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-brown-dark mt-0.5">•</span>
                            <span className="line-clamp-1">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-sand">
                      <span className="text-brown-dark">€{product.price}</span>
                      <span className="text-brown text-sm group-hover:text-brown-dark transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-brown">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why VSkin Section */}
      <section className="py-20 bg-cream border-t border-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brown-dark mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="text-brown-dark mb-3">Natural Ingredients</h3>
              <p className="text-brown text-sm leading-relaxed">
                Every formula is crafted with carefully selected natural ingredients that work in harmony with your skin.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brown-dark mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="text-brown-dark mb-3">EU Approved</h3>
              <p className="text-brown text-sm leading-relaxed">
                All our products meet rigorous European Union safety and quality standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brown-dark mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="text-brown-dark mb-3">Safe to Use</h3>
              <p className="text-brown text-sm leading-relaxed">
                Formulated for all skin types, including sensitive skin. Gentle yet effective.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}