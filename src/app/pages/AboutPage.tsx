import { Link } from 'react-router';
import { Heart, Leaf, Users, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-cream texture-subtle py-16 sm:py-20 md:py-24 border-b border-sand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <p className="text-gold mb-3 sm:mb-4 tracking-widest uppercase text-xs sm:text-sm">Our Mission</p>
          <h1 className="text-brown-dark pt-[0px] pr-[0px] pb-[24px] pl-[0px]">Confidence looks good on you</h1>
          <p className="text-brown leading-relaxed max-w-3xl mx-auto">
            VSkin is a Lithuanian skincare brand built on the belief that confidence starts with self-care. 
            Our mission is to create gentle, effective products that enhance your natural glow and help you 
            feel confident in your skin every single day.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-12 sm:py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
            <div className="relative image-overlay order-2 md:order-1 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1728852884040-9e8f96184b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBsZWF2ZXMlMjBuYXR1cmFsJTIwdGV4dHVyZXxlbnwxfHx8fDE3NjYwODYwNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Natural botanical textures"
                className="w-full h-[500px] object-cover shadow-elevated"
              />
            </div>
            <div className="bg-white p-6 sm:p-8 shadow-soft-lg order-1 md:order-2">
              <h2 className="text-brown-dark">Our Story</h2>
              <p className="text-brown mb-4 leading-relaxed">
                Rooted in simplicity and elegance, every VSkin formula is made with care and designed to fit 
                beautifully into your daily routine.
              </p>
              <p className="text-brown leading-relaxed">
                From our home in Lithuania, we craft each product with meticulous attention to detail, combining 
                natural ingredients with modern skincare science.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-brown-dark text-center mb-10 sm:mb-16">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-brown-dark mx-auto mb-6 flex items-center justify-center">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-brown-dark mb-4">Natural First</h3>
              <p className="text-brown leading-relaxed">
                We believe nature provides the most effective ingredients for healthy skin. 
                Every formula is crafted with plant-based actives that work in harmony with your skin's natural processes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-brown-dark mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-brown-dark mb-4">Honest & Transparent</h3>
              <p className="text-brown leading-relaxed">
                No hidden ingredients. No inflated claims. We tell you exactly what's in each product 
                and why it's there. Transparency builds trust, and trust builds confidence.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-brown-dark mx-auto mb-6 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-brown-dark mb-4">Safe for All</h3>
              <p className="text-brown leading-relaxed">
                Our formulas are designed for all skin types, including sensitive skin. 
                EU approved and rigorously tested to ensure safety and efficacy without compromise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-brown-dark">Our Approach to Skincare</h2>
              <p className="text-brown mb-6 leading-relaxed">
                Great skincare doesn't need to be complicated. We focus on five essential products, 
                each carefully formulated to address specific skin needs while working together as a complete system.
              </p>
              <div className="space-y-5 mb-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center flex-shrink-0">
                    <span className="text-brown-dark">1</span>
                  </div>
                  <div>
                    <h4 className="text-brown-dark mb-1">Quality Over Quantity</h4>
                    <p className="text-brown">
                      Five essential products, each perfected through careful development and testing.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center flex-shrink-0">
                    <span className="text-brown-dark">2</span>
                  </div>
                  <div>
                    <h4 className="text-brown-dark mb-1">Ingredients That Matter</h4>
                    <p className="text-brown">
                      Every ingredient serves a purpose. No fillers, no unnecessary additives.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center flex-shrink-0">
                    <span className="text-brown-dark">3</span>
                  </div>
                  <div>
                    <h4 className="text-brown-dark mb-1">Designed to Work Together</h4>
                    <p className="text-brown">
                      Our products are formulated as a system, each enhancing the benefits of the others.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/ingredients"
                className="inline-flex items-center gap-2 text-brown-dark hover:text-brown transition-colors"
              >
                Explore Our Ingredients
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1725034246182-0bb08e80d7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdsb3dpbmclMjBza2luJTIwbmF0dXJhbHxlbnwxfHx8fDE3NjYwNzkzNDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Confident woman"
                className="w-full h-[350px] sm:h-[450px] md:h-[500px] object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-12 sm:py-16 md:py-20 bg-sand">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="text-brown-dark">Our Commitment to You</h2>
          <p className="text-brown leading-relaxed mb-8 max-w-3xl mx-auto">
            When you choose VSkin, you're choosing skincare that respects your intelligence, 
            honors your skin, and delivers on its promises. We're committed to continuous improvement, 
            sustainable practices, and always putting your skin's health first.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 border border-taupe">
              <h4 className="text-brown-dark mb-3">Sustainably Sourced</h4>
              <p className="text-sm text-brown">
                We partner with suppliers who share our commitment to ethical, sustainable ingredient sourcing.
              </p>
            </div>
            <div className="bg-white p-6 border border-taupe">
              <h4 className="text-brown-dark mb-3">Cruelty Free</h4>
              <p className="text-sm text-brown">
                Never tested on animals. Beautiful skin shouldn't come at the cost of animal welfare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="text-brown-dark">Ready to Experience VSkin?</h2>
          <p className="text-brown mb-8 max-w-2xl mx-auto">
            Discover our collection of five essential products, each crafted to reveal your skin's natural radiance.
          </p>
          <Link
            to="/shop"
            className="btn-primary inline-flex items-center gap-2 bg-brown-dark text-white px-6 sm:px-8 py-3 sm:py-4 shadow-soft-lg"
          >
            Explore Our Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}