import { motion } from 'motion/react';

export function TermsPage() {
  return (
    <div className="py-16 px-6 bg-gradient-cream">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display text-brown-dark mb-4">
            Terms and Conditions
          </h1>
          <p className="text-brown text-lg">
            Last updated: December 5, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
          <div className="prose max-w-none">
            <p className="text-brown leading-relaxed mb-6">
              Welcome to VSkin. These terms and conditions govern your use of our website byvskin.com and any purchases made through it. By accessing or using our website, you agree to these terms. If you do not agree, please do not use our site.
            </p>

            {/* 1. General Information */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">1. General Information</h2>
              <p className="text-brown leading-relaxed mb-3">
                The website byvskin.com is operated by VSkin, registered in Lithuania.
              </p>
              <p className="text-brown leading-relaxed mb-2">
                <strong>Address:</strong> J. Kazlausko g. 6, LT-08314 Vilnius, Lithuania
              </p>
              <p className="text-brown leading-relaxed mb-3">
                <strong>Email:</strong> <a href="mailto:info@byvskin.com" className="text-gold hover:text-brown-dark transition-colors">info@byvskin.com</a>
              </p>
              <p className="text-brown leading-relaxed">
                These terms apply to all visitors, customers, and users of the website.
              </p>
            </section>

            {/* 2. Products and Descriptions */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">2. Products and Descriptions</h2>
              <p className="text-brown leading-relaxed">
                We strive to ensure that all product information, images, and prices are accurate and up to date. However, minor variations in color, texture, or packaging may occur due to digital representation or supplier updates. All products sold by VSkin are for personal cosmetic use only and are not intended to diagnose, treat, or prevent any medical condition.
              </p>
            </section>

            {/* 3. Prices and Payments */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">3. Prices and Payments</h2>
              <ul className="list-disc list-inside text-brown leading-relaxed space-y-2 mb-4">
                <li>All prices are listed in euros and include VAT</li>
                <li>Payment can be made securely via credit card, PayPal or other available methods displayed at checkout.</li>
                <li>Once your order is confirmed, you will receive an email confirmation with order details.</li>
              </ul>
              <p className="text-brown leading-relaxed">
                We reserve the right to change product prices or payment methods at any time.
              </p>
            </section>

            {/* 4. Shipping and Delivery */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">4. Shipping and Delivery</h2>
              <p className="text-brown leading-relaxed mb-3">
                We deliver to customers in Lithuania and selected international locations. Shipping times and costs are displayed during checkout and may vary depending on the destination.
              </p>
              <p className="text-brown leading-relaxed mb-3">
                Please note that some orders are fulfilled by our trusted manufacturing partner. As a result, delivery times may be slightly longer for international shipments.
              </p>
              <p className="text-brown leading-relaxed">
                VSkin is not responsible for delays caused by customs, courier issues, or force majeure events.
              </p>
            </section>

            {/* 5. Returns and Refunds */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">5. Returns and Refunds</h2>
              <p className="text-brown leading-relaxed mb-3">
                If you are not satisfied with your purchase, you may request a return or refund under the following conditions:
              </p>
              <ul className="list-disc list-inside text-brown leading-relaxed space-y-2 mb-4">
                <li>You contact us within 14 days of receiving your order.</li>
                <li>The product is unopened, unused, and in its original packaging.</li>
                <li>You provide proof of purchase (order number or receipt).</li>
              </ul>
              <p className="text-brown leading-relaxed mb-3">
                Due to hygiene and safety reasons, opened or used skincare products cannot be returned unless they are defective or damaged upon arrival.
              </p>
              <p className="text-brown leading-relaxed mb-3">
                Refunds will be processed once we receive and inspect the returned item. Shipping costs are non-refundable unless the return is due to an error on our part.
              </p>
              <p className="text-brown leading-relaxed">
                To request a return, please email: <a href="mailto:info@byvskin.com" className="text-gold hover:text-brown-dark transition-colors">info@byvskin.com</a>
              </p>
            </section>

            {/* 6. Order Cancellations */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">6. Order Cancellations</h2>
              <p className="text-brown leading-relaxed">
                You may cancel your order before it has been shipped. Once the order is processed or dispatched, it cannot be canceled. If you refuse delivery, the return shipping costs will be deducted from your refund.
              </p>
            </section>

            {/* 7. Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">7. Intellectual Property</h2>
              <p className="text-brown leading-relaxed">
                All content on this website – including text, logos, product images, and designs – is the property of VSkin or its licensors and is protected under copyright laws. You may not copy, reproduce, or distribute any material from our site without written permission.
              </p>
            </section>

            {/* 8. Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">8. Limitation of Liability</h2>
              <p className="text-brown leading-relaxed mb-3">VSkin is not liable for:</p>
              <ul className="list-disc list-inside text-brown leading-relaxed space-y-2 mb-4">
                <li>Any allergic reactions or skin sensitivities caused by improper use of the products.</li>
                <li>Any indirect, incidental, or consequential damages resulting from the use or inability to use our website or products.</li>
              </ul>
              <p className="text-brown leading-relaxed">
                Always perform a patch test before using a new skincare product.
              </p>
            </section>

            {/* 9. Privacy and Data Protection */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">9. Privacy and Data Protection</h2>
              <p className="text-brown leading-relaxed">
                Your personal information is handled in accordance with our privacy policy and the EU General Data Protection Regulation (GDPR).
              </p>
            </section>

            {/* 10. Governing Law */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">10. Governing Law</h2>
              <p className="text-brown leading-relaxed">
                These terms are governed by the laws of the Republic of Lithuania. Any disputes arising from these terms shall be resolved in Lithuanian courts, unless otherwise required by EU consumer protection laws.
              </p>
            </section>

            {/* 11. Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-3xl font-display text-brown-dark mb-4">11. Changes to Terms</h2>
              <p className="text-brown leading-relaxed">
                We may update or modify these terms at any time. All updates will be published on this page with a new "last updated" date. Continued use of the website after changes means you accept the revised terms.
              </p>
            </section>

            {/* 12. Contact Information */}
            <section>
              <h2 className="text-3xl font-display text-brown-dark mb-4">12. Contact Information</h2>
              <p className="text-brown leading-relaxed mb-2">
                For questions about these terms, please contact us at:
              </p>
              <p className="text-brown leading-relaxed mb-1">
                <a href="mailto:info@byvskin.com" className="text-gold hover:text-brown-dark transition-colors">info@byvskin.com</a>
              </p>
              <p className="text-brown leading-relaxed">
                J. Kazlausko g. 6, LT-08314 Vilnius, Lithuania
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
