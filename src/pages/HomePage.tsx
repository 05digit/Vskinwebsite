import { Link } from 'react-router';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { products } from '../data/products';
import { ScrollReveal } from '../components/ScrollReveal';
import { ParallaxBackground } from '../components/ParallaxBackground';
import treeBarkBg from 'figma:asset/05c742d14ee570e5c607da19f74f5e57affe1fce.png';

export function HomePage() {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen md:min-h-0 flex items-center md:bg-gradient-cream md:texture-subtle md:gradient-overlay-warm ambient-gradient-pulse">
        {/* Mobile Background Image with Parallax */}
        <ParallaxBackground 
          imageSrc={treeBarkBg} 
          speed={0.5}
          className="md:hidden"
        />
        {/* Mobile Overlay */}
        <div className="absolute inset-0 bg-brown-dark/70 md:hidden" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-12 py-16 sm:py-24 md:py-32 w-full relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left [&_p]:text-white [&_p]:md:text-brown [&_h1]:text-white [&_h1]:md:text-brown-dark">
              <p className="tracking-widest uppercase text-xs sm:text-sm mb-6 md:mb-4 hero-text-mobile-white hero-text-desktop-brown">Natural Luxury Skincare</p>
              <h1 className="mb-6 md:mb-4 hero-text-mobile-white hero-text-desktop-brown-dark">
                Confidence Looks Good On You!
              </h1>
              <p className="mb-10 md:mb-8 max-w-lg mx-auto md:mx-0 hero-text-mobile-white hero-text-desktop-brown-dark">
                Experience the transformative power of nature with our carefully formulated skincare collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 md:justify-start justify-center">
                <Link
                  to="/shop"
                  className="btn-primary inline-flex items-center justify-center gap-2 bg-gradient-brown-dark text-white px-8 py-4 shadow-soft-lg"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="btn-reactive inline-flex items-center justify-center gap-2 bg-white text-brown-dark px-8 py-4 shadow-soft hidden sm:inline-flex"
                >
                  Our Story
                </Link>
              </div>
            </div>
            <div className="relative image-overlay hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1644222643716-38f3b2828de6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwYmVhdXR5JTIwc2tpbmNhcmUlMjB3b21hbnxlbnwxfHx8fDE3NjYwODQ3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Radiant skin"
                className="w-full h-[500px] object-cover shadow-elevated"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="py-16 sm:py-16 md:py-24 relative shadow-[0_-30px_60px_-5px_rgba(0,0,0,0.12),0_30px_60px_-5px_rgba(0,0,0,0.12)] z-10 overflow-hidden">
        {/* Gradient background showing through cutouts */}
        <div className="absolute inset-0 ambient-gradient-pulse" />
        
        {/* White ribbon layer - with cutouts for cards */}
        <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-12 text-center relative z-10">
          {/* White background for text area */}
          <div className="bg-white relative">
            <ScrollReveal>
              <h2 className="text-brown-dark mb-6">Our Philosophy</h2>
              <p className="text-brown max-w-3xl mx-auto mb-12 sm:mb-16">
                At VSkin, we believe that true beauty comes from nurturing your skin with pure, natural ingredients.
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-8">
            <ScrollReveal delay={100}>
              <div className="h-full flex flex-col p-6 sm:p-8 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] card-hover border-2 border-white/80 min-h-[280px] sm:min-h-[300px] relative backdrop-blur-sm">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gold mx-auto mb-3 sm:mb-4 flex-shrink-0 relative z-10" />
                <h3 className="text-brown-dark mb-2 sm:mb-3 relative z-10">EU Approved</h3>
                <p className="text-brown text-sm sm:text-base flex-grow relative z-10">
                  Meeting strict European Union safety standards.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="h-full flex flex-col p-6 sm:p-8 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] card-hover border-2 border-white/80 min-h-[280px] sm:min-h-[300px] relative backdrop-blur-sm">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gold mx-auto mb-3 sm:mb-4 flex-shrink-0 relative z-10" />
                <h3 className="text-brown-dark mb-2 sm:mb-3 relative z-10">Natural Ingredients</h3>
                <p className="text-brown text-sm sm:text-base flex-grow relative z-10">
                  Carefully selected botanical extracts.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="h-full flex flex-col p-6 sm:p-8 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] card-hover border-2 border-white/80 sm:col-span-2 md:col-span-1 min-h-[280px] sm:min-h-[300px] relative backdrop-blur-sm">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gold mx-auto mb-3 sm:mb-4 flex-shrink-0 relative z-10" />
                <h3 className="text-brown-dark mb-2 sm:mb-3 relative z-10">Safe to Use</h3>
                <p className="text-brown text-sm sm:text-base flex-grow relative z-10">
                  Gentle formulations for daily use.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-16 md:py-24 bg-cream ambient-gradient-pulse-warm shadow-[inset_0_10px_30px_-10px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-brown-dark mb-4">Our Collection</h2>
            <p className="text-brown max-w-2xl mx-auto">
              Five essential products, each crafted to work in harmony with your skin's natural rhythms.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white border border-sand hover:border-brown shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-[3/4] overflow-hidden bg-cream relative image-overlay">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-brown mb-2">{product.category}</p>
                  <h3 className="text-brown-dark mb-3">{product.name}</h3>
                  <p className="text-brown text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-brown-dark">€{product.price}</span>
                    <span className="text-brown text-sm group-hover:text-brown-dark transition-colors">
                      Learn More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="btn-reactive inline-flex items-center justify-center gap-2 bg-white text-brown-dark px-8 py-4 shadow-soft"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ingredient Philosophy */}
      <section className="py-16 sm:py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative image-overlay order-2 md:order-1 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1763027076863-698a6a72c164?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwYm90YW5pY2FsJTIwaW5ncmVkaWVudHMlMjBza2luY2FyZXxlbnwxfHx8fDE3NjYwODQ2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Natural ingredients"
                className="w-full h-[400px] object-cover shadow-elevated"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-brown-dark">Nature's Best, Carefully Chosen</h2>
              <p className="text-brown mb-8 leading-relaxed">
                Every ingredient in our formulas is selected for its proven benefits. We believe in transparency—you should know exactly what you're putting on your skin.
              </p>
              <Link
                to="/ingredients"
                className="btn-reactive inline-flex items-center justify-center gap-2 bg-white text-brown-dark px-6 py-3 shadow-soft"
              >
                Discover Our Ingredients
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-sand texture-subtle relative hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-brown-dark mb-4">Safety & Quality You Can Trust</h3>
              <p className="text-brown leading-relaxed">
                Our products meet the highest European standards for cosmetic safety and efficacy.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-taupe shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
                <h4 className="text-brown-dark mb-2">EU Approved</h4>
                <p className="text-sm text-brown">
                  Fully compliant with European Union cosmetic regulations
                </p>
              </div>
              <div className="bg-white p-6 border border-taupe shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
                <h4 className="text-brown-dark mb-2">Safe to Use</h4>
                <p className="text-sm text-brown">
                  Formulated for daily use on all skin types
                </p>
              </div>
              <div className="bg-white p-6 border border-taupe shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
                <h4 className="text-brown-dark mb-2">Cruelty Free</h4>
                <p className="text-sm text-brown">
                  Never tested on animals, always ethical
                </p>
              </div>
              <div className="bg-white p-6 border border-taupe shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
                <h4 className="text-brown-dark mb-2">Natural First</h4>
                <p className="text-sm text-brown">
                  Powered by nature's most effective ingredients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-brown-dark text-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-white mb-4">Join Our Community</h2>
          <p className="mb-8 text-cream">
            Be the first to know about new products, skincare tips, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 bg-white text-black outline-none focus:ring-2 focus:ring-sand"
            />
            <button
              type="submit"
              className="btn-primary px-8 py-4 bg-sand text-brown-dark shadow-soft-lg"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-cream mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}