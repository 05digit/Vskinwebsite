import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export function ReturnsPage() {
  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-brown hover:text-brown-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <section className="py-12 border-b border-sand">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h1 className="text-brown-dark mb-4">Refund and Return Policy</h1>
          <p className="text-brown">Last updated: 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="prose prose-brown max-w-none">
            <p className="text-brown text-lg leading-relaxed mb-12">
              Thank you for shopping with VSkin. We want you to love your purchase, but if something isn't right, 
              we are here to help. This refund and return policy outlines your rights and our process for returns, 
              refunds and replacements.
            </p>

            <div className="space-y-10">
              {/* Section 1 */}
              <div>
                <h3 className="text-brown-dark mb-4">1. Order Cancellations</h3>
                <p className="text-brown leading-relaxed mb-4">
                  If you change your mind, you may cancel your order before it has been shipped. Once your order 
                  has been processed or dispatched, it cannot be canceled.
                </p>
                <p className="text-brown leading-relaxed">
                  To request a cancellation, contact us immediately at: <a href="mailto:info@byvskin.com" className="text-brown-dark hover:underline">info@byvskin.com</a>
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-brown-dark mb-4">2. Returns</h3>
                <p className="text-brown leading-relaxed mb-4">
                  Due to hygiene and safety regulations, we can only accept returns if the following conditions are met:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 mb-4 ml-4">
                  <li>The product is unopened, unused, and in its original packaging.</li>
                  <li>You contact us within 14 days of receiving your order.</li>
                  <li>You provide proof of purchase (your order number or receipt).</li>
                </ul>
                <p className="text-brown leading-relaxed">
                  If your item meets these conditions, we will provide return instructions by email. Return shipping costs 
                  are the responsibility of the customer, unless the product arrived damaged or incorrect.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-brown-dark mb-4">3. Damaged or Defective Products</h3>
                <p className="text-brown leading-relaxed mb-4">
                  If your order arrived damaged, defective or incorrect, please contact us within 7 days of receiving it. 
                  Include photos of the product and packaging so we can review and resolve the issue quickly.
                </p>
                <p className="text-brown leading-relaxed">
                  In these cases, we will replace the product free of charge or issue a full refund, including shipping costs.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-brown-dark mb-4">4. Refunds</h3>
                <p className="text-brown leading-relaxed mb-4">
                  Once we receive and inspect your return, we will notify you about the status of your refund. 
                  If approved, your refund will be issued to your original payment method within 5-10 business days.
                </p>
                <p className="text-brown leading-relaxed">
                  Shipping fees are non-refundable, except when the return is due to an error on our part 
                  (for example, sending the wrong item).
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-brown-dark mb-4">5. Non-Returnable Items</h3>
                <p className="text-brown leading-relaxed mb-4">
                  For hygiene and safety reasons, the following items cannot be returned:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 ml-4">
                  <li>Opened skincare products</li>
                  <li>Items without original packaging</li>
                  <li>Products purchased through third-party retailers</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-brown-dark mb-4">6. Exchanges</h3>
                <p className="text-brown leading-relaxed">
                  We currently do not offer direct exchanges. If you wish to replace a product, please request a refund 
                  and place a new order.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h3 className="text-brown-dark mb-4">7. Consumer Rights</h3>
                <p className="text-brown leading-relaxed mb-4">
                  This return policy does not limit your rights under EU consumer protection law.
                </p>
                <p className="text-brown leading-relaxed">
                  Customers must return products to the return address provided in the email. We do not accept returns 
                  sent without prior authorization.
                </p>
              </div>

              {/* Section 8 */}
              <div className="bg-cream p-8 border border-sand">
                <h3 className="text-brown-dark mb-4">8. Contact Us</h3>
                <p className="text-brown leading-relaxed mb-4">
                  If you have any questions about returns or refunds, please contact us at:
                </p>
                <div className="text-brown space-y-1">
                  <p><a href="mailto:info@byvskin.com" className="text-brown-dark hover:underline">info@byvskin.com</a></p>
                  <p>J. Kazlausko g. 6, LT08314</p>
                  <p>Vilnius, Lithuania</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}