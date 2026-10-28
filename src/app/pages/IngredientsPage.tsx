import { Link } from 'react-router';
import { Leaf, Droplet, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export function IngredientsPage() {
  const ingredients = [
    {
      name: 'Hyaluronic Acid',
      category: 'Hydration',
      description: 'A naturally occurring molecule that holds up to 1000 times its weight in water, deeply hydrating skin and plumping fine lines.',
      benefits: 'Intense moisture retention, improved skin elasticity, visibly plumper skin',
      icon: Droplet
    },
    {
      name: 'Vitamin C (Ascorbic Acid)',
      category: 'Brightening',
      description: 'A powerful antioxidant that brightens skin tone, fades hyperpigmentation, and protects against environmental stressors.',
      benefits: 'Even skin tone, reduced dark spots, enhanced radiance, antioxidant protection',
      icon: Sparkles
    },
    {
      name: 'Niacinamide',
      category: 'Multi-Benefit',
      description: 'A form of Vitamin B3 that strengthens the skin barrier, reduces inflammation, and minimizes the appearance of pores.',
      benefits: 'Reduced redness, improved texture, stronger barrier, balanced oil production',
      icon: Shield
    },
    {
      name: 'Peptide Complex',
      category: 'Anti-Aging',
      description: 'Chains of amino acids that signal skin cells to produce more collagen, improving firmness and reducing visible signs of aging.',
      benefits: 'Enhanced firmness, reduced fine lines, improved elasticity, skin renewal',
      icon: Sparkles
    },
    {
      name: 'Bakuchiol',
      category: 'Renewal',
      description: 'A gentle, plant-based alternative to retinol that boosts cell turnover and improves skin texture without irritation.',
      benefits: 'Smoother texture, improved tone, gentle exfoliation, suitable for sensitive skin',
      icon: Leaf
    },
    {
      name: 'Glycerin',
      category: 'Hydration',
      description: 'A humectant that draws moisture from the air into your skin, maintaining hydration and supporting the skin barrier.',
      benefits: 'Lasting moisture, soft skin, barrier support, suitable for all skin types',
      icon: Droplet
    },
    {
      name: 'Chamomile Extract',
      category: 'Soothing',
      description: 'A natural extract rich in antioxidants that calms irritation, reduces redness, and provides gentle care for sensitive skin.',
      benefits: 'Reduced inflammation, calmed sensitivity, soothing comfort, antioxidant protection',
      icon: Leaf
    },
    {
      name: 'Rosehip Oil',
      category: 'Regeneration',
      description: 'Packed with essential fatty acids and vitamins A and C, this oil regenerates skin cells and improves overall skin health.',
      benefits: 'Skin regeneration, improved texture, reduced scarring, natural glow',
      icon: Sparkles
    }
  ];

  const principles = [
    {
      title: 'Naturally Derived',
      description: 'We prioritize plant-based ingredients that work with your skin\'s biology.'
    },
    {
      title: 'Scientifically Proven',
      description: 'Every ingredient is chosen for its demonstrated efficacy and safety profile.'
    },
    {
      title: 'Safe Concentrations',
      description: 'We use effective yet gentle concentrations suitable for daily use.'
    },
    {
      title: 'No Harsh Additives',
      description: 'Free from synthetic fragrances, parabens, and unnecessary chemicals.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-cream texture-subtle py-20 border-b border-gold/20 shadow-soft">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-brown-dark mb-6">Ingredients Philosophy</h1>
          <p className="text-lg text-brown leading-relaxed">
            Transparency is at the heart of everything we do. We believe you deserve to know exactly 
            what goes into your skincare and why each ingredient matters.
          </p>
        </div>
      </section>

      {/* Our Principles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal>
            <h2 className="text-brown-dark text-center mb-16">How We Choose Ingredients</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white">{index + 1}</span>
                  </div>
                  <h3 className="text-brown-dark mb-3">{principle.title}</h3>
                  <p className="text-sm text-brown leading-relaxed">{principle.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ingredients */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-brown-dark mb-4">Our Key Ingredients</h2>
              <p className="text-brown max-w-2xl mx-auto">
                These are some of the powerful natural ingredients you'll find throughout our collection.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {ingredients.map((ingredient, index) => {
              const Icon = ingredient.icon;
              return (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-white p-8 border border-gold/20 shadow-soft card-hover">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-brown-dark flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-brown-dark mb-1">{ingredient.name}</h3>
                        <p className="text-sm text-gold">{ingredient.category}</p>
                      </div>
                    </div>
                    <p className="text-brown mb-4 leading-relaxed">
                      {ingredient.description}
                    </p>
                    <div className="pt-4 border-t border-gold/20">
                      <p className="text-sm text-brown">
                        <span className="text-brown-dark">Benefits: </span>
                        {ingredient.benefits}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Avoid */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-brown-dark mb-4">What We Don't Use</h2>
            <p className="text-brown max-w-2xl mx-auto">
              Just as important as what we include is what we leave out. Our formulas are free from ingredients 
              that can harm your skin or the environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-cream p-6 border border-sand text-center">
              <h4 className="text-brown-dark mb-2">Parabens</h4>
              <p className="text-sm text-brown">
                No preservatives that can disrupt hormones
              </p>
            </div>
            <div className="bg-cream p-6 border border-sand text-center">
              <h4 className="text-brown-dark mb-2">Synthetic Fragrances</h4>
              <p className="text-sm text-brown">
                Only natural scents from plant extracts
              </p>
            </div>
            <div className="bg-cream p-6 border border-sand text-center">
              <h4 className="text-brown-dark mb-2">Sulfates</h4>
              <p className="text-sm text-brown">
                Gentle cleansing without harsh detergents
              </p>
            </div>
            <div className="bg-cream p-6 border border-sand text-center">
              <h4 className="text-brown-dark mb-2">Phthalates</h4>
              <p className="text-sm text-brown">
                No harmful plasticizers in our formulas
              </p>
            </div>
            <div className="bg-cream p-6 border border-sand text-center">
              <h4 className="text-brown-dark mb-2">Mineral Oil</h4>
              <p className="text-sm text-brown">
                Only natural, skin-nourishing oils
              </p>
            </div>
            <div className="bg-cream p-6 border border-sand text-center">
              <h4 className="text-brown-dark mb-2">Animal Testing</h4>
              <p className="text-sm text-brown">
                Cruelty-free, always
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredient Sourcing */}
      <section className="py-20 bg-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1758614312118-4f7cd900ab26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhcm1pbmclMjBib3RhbmljYWwlMjBwbGFudHN8ZW58MXx8fHwxNzY2MDg1Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Sustainably sourced botanicals"
                className="w-full h-[400px] object-cover shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-brown-dark mb-6">Responsibly Sourced</h2>
              <p className="text-brown mb-6 leading-relaxed">
                We work closely with trusted suppliers who share our commitment to sustainability and ethical practices. 
                Every ingredient is traced from source to formula, ensuring quality and integrity at every step.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brown-dark mt-2"></div>
                  <p className="text-brown">
                    <span className="text-brown-dark">Sustainable harvesting</span> that protects ecosystems
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brown-dark mt-2"></div>
                  <p className="text-brown">
                    <span className="text-brown-dark">Fair trade practices</span> supporting farming communities
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brown-dark mt-2"></div>
                  <p className="text-brown">
                    <span className="text-brown-dark">Quality testing</span> to ensure purity and potency
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Standards */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-brown-dark mb-6">Safety & Quality Standards</h2>
          <p className="text-brown text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
            All VSkin products are formulated to meet rigorous European Union cosmetic safety regulations. 
            We prioritize your safety with careful ingredient selection and thorough quality control.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-cream p-8 border border-sand">
              <h3 className="text-brown-dark mb-3">EU Union Approved</h3>
              <p className="text-sm text-brown leading-relaxed">
                Every product meets or exceeds European Union safety standards for cosmetic products, 
                ensuring safe and effective formulations.
              </p>
            </div>
            <div className="bg-cream p-8 border border-sand">
              <h3 className="text-brown-dark mb-3">Safe to Use</h3>
              <p className="text-sm text-brown leading-relaxed">
                Formulated for daily use on all skin types, including sensitive skin. 
                Gentle yet effective concentrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream border-t border-sand">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-brown-dark mb-6">Experience the Difference</h2>
          <p className="text-brown mb-8 max-w-2xl mx-auto">
            Now that you know what goes into our products, discover how they can transform your skincare routine.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-brown-dark text-white px-8 py-4 hover:bg-brown transition-colors"
          >
            Shop Our Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}