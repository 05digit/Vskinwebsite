import { Link } from 'react-router';
import { Instagram, Facebook, Mail } from 'lucide-react';

const logoBlack = "https://bgsmbgofghygwbuevxpo.supabase.co/storage/v1/object/public/images/VSkin%20logo%20black.png";

export function Footer() {
  return (
    <footer className="bg-gradient-cream texture-subtle border-t-2 border-gold/30 shadow-soft-lg relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h4 className="text-gold mb-3 tracking-widest uppercase text-sm">VSkin</h4>
            <p className="text-brown text-sm leading-relaxed">
              Confidence through natural ingredients. Premium skincare crafted with care.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-gold mb-3 tracking-widest uppercase text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="text-brown-dark hover:text-brown transition-colors underline-offset-2 hover:underline">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/product/foaming-cleanser" className="text-brown-dark hover:text-brown transition-colors underline-offset-2 hover:underline">
                  Cleansing Foam
                </Link>
              </li>
              <li>
                <Link to="/product/toner" className="text-brown-dark hover:text-brown transition-colors underline-offset-2 hover:underline">
                  Hydrating Toner
                </Link>
              </li>
              <li>
                <Link to="/product/moisturizer" className="text-brown-dark hover:text-brown transition-colors underline-offset-2 hover:underline">
                  Moisturising Day Cream
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-gold mb-3 tracking-widest uppercase text-sm">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-brown-dark hover:text-brown transition-colors underline-offset-2 hover:underline">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/ingredients" className="text-brown-dark hover:text-brown transition-colors underline-offset-2 hover:underline">
                  Ingredients Philosophy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-brown-dark hover:text-brown transition-colors underline-offset-2 hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-brown-dark hover:text-brown transition-colors underline-offset-2 hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-brown-dark hover:text-brown transition-colors underline-offset-2 hover:underline">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-gold mb-3 tracking-widest uppercase text-sm">Stay Connected</h4>
            <p className="text-brown text-sm mb-3 leading-relaxed">
              Join our community for skincare tips and exclusive offers.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-sand flex items-center justify-center hover:bg-sand transition-[background-color] duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-brown" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-sand flex items-center justify-center hover:bg-sand transition-[background-color] duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-brown" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-sand flex items-center justify-center hover:bg-sand transition-[background-color] duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 text-brown" />
              </a>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="border-t border-sand pt-6 mb-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-brown">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brown/50"></div>
              <span>EU Union Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brown/50"></div>
              <span>Safe to Use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brown/50"></div>
              <span>Natural Ingredients</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brown/50"></div>
              <span>Cruelty Free</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-2">
            <img src={logoBlack} alt="VSkin" className="h-8 mx-auto opacity-70 hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-sm text-brown">&copy; {new Date().getFullYear()} VSkin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}