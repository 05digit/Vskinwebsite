// Import product images using figma:asset scheme
import cleanserImg from "figma:asset/508bf40a2997bacc61b69a4343037f475da8fba9.png";
import tonerImg from "figma:asset/faa3dba1cdbf138361554f818046d140fc86f94a.png";
import moisturizerImg from "figma:asset/2497467ac160ad4c14c681f3cf60d5421672c58b.png";
import pigmentSerumImg from "figma:asset/989420830a3619412b0dd036cb77977e419720a8.png";
import collagenSerumImg from "figma:asset/7ee665250df403023d3439af0a8ce980aac5d5f9.png";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  benefits: string[];
  keyIngredients: {
    name: string;
    benefit: string;
  }[];
  howToUse: string[];
  image: string;
  featured?: boolean;
  badges?: string[];
}

export const products: Product[] = [
  {
    id: 'foaming-cleanser',
    name: 'Cleansing Foam',
    category: 'Cleanse',
    price: 32,
    description: 'This mild and light cleansing foam helps remove make-up and impurities to leave skin looking fresh and supple. Apply the foam to your face, massage gently and rinse off with water.',
    benefits: [
      'Gently removes makeup and impurities',
      'Leaves skin looking fresh and supple',
      'Mild and light formula',
      'Suitable for all skin types'
    ],
    keyIngredients: [
      {
        name: 'Glycerin',
        benefit: 'Draws moisture into the skin, keeping it hydrated and supple throughout cleansing'
      },
      {
        name: 'Chamomile Extract',
        benefit: 'Naturally calms and soothes sensitive skin while reducing redness'
      },
      {
        name: 'Coconut-Derived Surfactants',
        benefit: 'Creates a luxurious foam while gently cleansing without stripping natural oils'
      }
    ],
    howToUse: [
      'Apply the foam to your face',
      'Massage gently in circular motions',
      'Rinse off with water',
      'Use morning and evening for best results'
    ],
    image: cleanserImg,
    featured: true,
    badges: ['Gluten Free', 'Vegan', 'Natural Certified']
  },
  {
    id: 'toner',
    name: 'Hydrating Toner',
    category: 'Tone',
    price: 38,
    description: 'Hydrates and helps to maintain the natural skin pH to leave your skin radiant and feeling comfortable after cleansing. Infused with Rose Water and Hyaluronic Acid for additional moisture. Splash the product into your hands and apply all over the face. Avoid direct contact with the eyes.',
    benefits: [
      'Hydrates and maintains natural skin pH',
      'Leaves skin radiant and comfortable',
      'Infused with Rose Water and Hyaluronic Acid',
      'Provides additional moisture'
    ],
    keyIngredients: [
      {
        name: 'Rose Water',
        benefit: 'Tones and refreshes while delivering antioxidants that protect against environmental stress'
      },
      {
        name: 'Hyaluronic Acid',
        benefit: 'Provides deep hydration and helps maintain moisture balance'
      },
      {
        name: 'Aloe Vera',
        benefit: 'Soothes and hydrates, leaving skin feeling comfortable and calm'
      }
    ],
    howToUse: [
      'Splash the product into your hands',
      'Apply all over the face',
      'Avoid direct contact with the eyes',
      'Use after cleansing, morning and evening'
    ],
    image: tonerImg,
    featured: true,
    badges: ['Gluten Free', 'Vegan', 'Natural Certified', 'Fragrance Free']
  },
  {
    id: 'moisturizer',
    name: 'Moisturising Day Cream',
    category: 'Hydrate',
    price: 48,
    description: 'Silky texture face cream absorbs quickly and provides instant hydration and nourishment. Formulated with multi-molecular-weight Hyaluronic Acid and soothing Bisabolol to make your skin look exceedingly dewy and plump all day long. Anti-oxidant rich Rowanberry Extract helps to protect against environmental aggressors and maintain the skin\'s youthful appearance. Suitable for normal to dry skin. Apply to clean skin.',
    benefits: [
      'Absorbs quickly with silky texture',
      'Provides instant hydration and nourishment',
      'Makes skin look dewy and plump all day',
      'Protects against environmental aggressors',
      'Suitable for normal to dry skin'
    ],
    keyIngredients: [
      {
        name: 'Multi-Molecular-Weight Hyaluronic Acid',
        benefit: 'Provides deep and surface hydration for plump, dewy skin'
      },
      {
        name: 'Bisabolol',
        benefit: 'Soothes and calms skin while reducing redness and irritation'
      },
      {
        name: 'Rowanberry Extract',
        benefit: 'Antioxidant-rich extract that protects against environmental damage and maintains youthful appearance'
      }
    ],
    howToUse: [
      'Apply to clean skin',
      'Take a pearl-sized amount',
      'Gently press into face and neck',
      'Use morning and evening for best results'
    ],
    image: moisturizerImg,
    featured: true,
    badges: ['Gluten Free', 'Vegan', 'Natural Certified']
  },
  {
    id: 'pigment-perfecting-serum',
    name: 'Pigment Perfecting Serum',
    category: 'Target',
    price: 58,
    description: 'Our Pigment Perfecting Serum is designed to reduce the appearance of dark spots and promote an even skin tone. The lightweight formula hydrates and soothes while targeting pigmentation for a brighter complexion. Its scent adds an extra layer of indulgence, with earthy notes of vetiver root and wood, complemented by a soft, sweet almond background. Apply daily to clean skin for best results.',
    benefits: [
      'Reduces appearance of dark spots',
      'Promotes even skin tone',
      'Lightweight formula hydrates and soothes',
      'Targets pigmentation for brighter complexion',
      'Indulgent scent with vetiver and almond notes'
    ],
    keyIngredients: [
      {
        name: 'Vitamin C (Ascorbic Acid)',
        benefit: 'Powerful antioxidant that brightens skin and fades hyperpigmentation over time'
      },
      {
        name: 'Niacinamide',
        benefit: 'Visibly reduces discoloration and strengthens the skin barrier for even texture'
      },
      {
        name: 'Licorice Root Extract',
        benefit: 'Naturally brightens and calms skin while addressing uneven tone'
      }
    ],
    howToUse: [
      'Apply daily to clean skin',
      'Dispense 2-3 drops onto fingertips',
      'Gently pat onto face',
      'Focus on areas of concern',
      'Use morning or evening for best results'
    ],
    image: pigmentSerumImg,
    featured: true,
    badges: ['Gluten Free', 'Vegan', 'Natural Certified']
  },
  {
    id: 'collagen-boost-serum',
    name: 'Collagen Boost Serum',
    category: 'Target',
    price: 62,
    description: 'Gives your skin much needed hydration and a dose of powerful actives that help to support younger looking skin. The skin appears smoother and feels firmer. Light and quick-absorbing texture leaves the skin looking dewy and fresh. Apply to clean skin.',
    benefits: [
      'Provides much needed hydration',
      'Supports younger looking skin',
      'Skin appears smoother and feels firmer',
      'Light and quick-absorbing texture',
      'Leaves skin looking dewy and fresh'
    ],
    keyIngredients: [
      {
        name: 'Peptide Complex',
        benefit: 'Signals skin to produce more collagen, improving firmness and reducing wrinkles'
      },
      {
        name: 'Bakuchiol',
        benefit: 'A natural alternative to retinol that boosts cell turnover without irritation'
      },
      {
        name: 'Rosehip Oil',
        benefit: 'Rich in essential fatty acids and vitamins that regenerate and repair skin'
      }
    ],
    howToUse: [
      'Apply to clean skin',
      'Use 3-4 drops for face and neck',
      'Press gently into skin',
      'Allow to absorb fully',
      'Use morning and evening for optimal results'
    ],
    image: collagenSerumImg,
    featured: true,
    badges: ['Gluten Free', 'Vegan', 'Natural Certified']
  }
];
