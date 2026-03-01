import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export function PrivacyPage() {
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
          <h1 className="text-brown-dark mb-4">Privacy Policy</h1>
          <p className="text-brown">Last updated: 2025-11-27</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="prose prose-brown max-w-none">
            <p className="text-brown text-lg leading-relaxed mb-12">
              This privacy policy describes how VSkin collects, uses, discloses, and protects the personal information 
              of visitors and customers who access or use byvskin.com. By using our site, you agree to the practices 
              described in this privacy policy.
            </p>

            <div className="space-y-10">
              {/* Section 1 */}
              <div>
                <h3 className="text-brown-dark mb-4">1. Information We Collect</h3>
                <p className="text-brown leading-relaxed mb-4">
                  We may collect the following categories of personal information:
                </p>
                <p className="text-brown text-sm italic mb-4">
                  (We do not collect sensitive personal data such as health information, biometric data, 
                  or government identification numbers).
                </p>

                <h4 className="text-brown-dark mb-3">1.1 Information You Provide Directly</h4>
                <ul className="list-disc list-inside text-brown space-y-2 mb-6 ml-4">
                  <li>Name, email address, shipping and billing address</li>
                  <li>Payment confirmation details (we use Wix Payments to process orders placed through our website. 
                      Wix Payments securely handles your payment information, and we do not have access to or store 
                      this data on our servers)</li>
                  <li>Order history</li>
                  <li>Any information you provide through contact forms, customer service interactions or emails</li>
                </ul>

                <h4 className="text-brown-dark mb-3">1.2 Information Collected Automatically</h4>
                <ul className="list-disc list-inside text-brown space-y-2 mb-6 ml-4">
                  <li>IP address</li>
                  <li>Device information (browser type, operating system, device identifiers)</li>
                  <li>Usage data (pages viewed, clicks, time spent, navigation paths)</li>
                  <li>Cookies, tracking technologies, and analytics data</li>
                </ul>

                <h4 className="text-brown-dark mb-3">1.3 Information from Third Parties</h4>
                <ul className="list-disc list-inside text-brown space-y-2 ml-4">
                  <li>Payment processors</li>
                  <li>Shipping providers</li>
                  <li>Our fulfillment partner for order processing</li>
                  <li>Advertising and analytics partners</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-brown-dark mb-4">2. How We Use Your Information</h3>
                <p className="text-brown leading-relaxed mb-4">
                  We use personal information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 ml-4">
                  <li>To process and fulfill your orders</li>
                  <li>To communicate with you (order confirmation, updates, customer support)</li>
                  <li>To manage your account</li>
                  <li>To operate and improve our site</li>
                  <li>To personalize your experience</li>
                  <li>For marketing, promotions, and advertising (with your consent where requested)</li>
                  <li>To comply with legal obligations</li>
                  <li>To prevent fraud and security issues</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-brown-dark mb-4">3. Legal Bases for Processing (GDPR Users)</h3>
                <p className="text-brown leading-relaxed mb-4">
                  If you are located in the EEA/UK, we process your data under the following legal bases:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 ml-4">
                  <li>Performance of a contract (e.g., fulfilling your purchase)</li>
                  <li>Consent (e.g., marketing emails, cookies)</li>
                  <li>Legitimate interests (e.g., improving the site)</li>
                  <li>Legal obligation (e.g., tax records)</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-brown-dark mb-4">4. Sharing Your Information</h3>
                <p className="text-brown leading-relaxed mb-4">
                  We may share your personal information with trusted third parties for operational purposes:
                </p>
                <p className="text-brown text-sm italic mb-4">
                  (Fulfillment partners receive only the information needed to ship your order and are prohibited 
                  from using it for any other purpose).
                </p>

                <h4 className="text-brown-dark mb-3">4.1 Service Providers</h4>
                <p className="text-brown leading-relaxed mb-4">
                  Including but not limited to:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 mb-6 ml-4">
                  <li>Product fulfillment</li>
                  <li>Payment processors</li>
                  <li>Shipping carriers</li>
                  <li>Website hosting providers</li>
                  <li>Email marketing platforms</li>
                  <li>Analytics and advertising partners</li>
                </ul>
                <p className="text-brown leading-relaxed mb-6">
                  These third parties are only permitted to use your data as necessary to provide their services to us.
                </p>

                <h4 className="text-brown-dark mb-3">4.2 Legal Requirements</h4>
                <p className="text-brown leading-relaxed mb-4">
                  We may disclose information if required to:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 mb-6 ml-4">
                  <li>Comply with laws and regulations</li>
                  <li>Respond to lawful requests</li>
                  <li>Protect our rights, safety, or the safety of others</li>
                </ul>

                <h4 className="text-brown-dark mb-3">4.3 Business Transfers</h4>
                <p className="text-brown leading-relaxed">
                  In case of merger, acquisition, or asset sale, your information may be transferred.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-brown-dark mb-4">5. Cookies and Tracking Technologies</h3>
                <p className="text-brown leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 mb-4 ml-4">
                  <li>Enable site functionality</li>
                  <li>Remember your preferences</li>
                  <li>Analyze website traffic</li>
                  <li>Deliver personalized ads</li>
                </ul>
                <p className="text-brown leading-relaxed">
                  You can manage or disable cookies through your browser settings. If required by law, we will request 
                  your cookie consent when you visit the site.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-brown-dark mb-4">6. Your Privacy Rights</h3>
                <p className="text-brown leading-relaxed mb-4">
                  Depending on your location, you may have a right to:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 mb-4 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Object to or restrict processing</li>
                  <li>Withdraw consent</li>
                  <li>Receive a copy of your data</li>
                  <li>Opt-out of targeted advertising</li>
                  <li>Opt-out of the sale/share of personal data</li>
                </ul>
                <p className="text-brown leading-relaxed">
                  To exercise your rights, contact us at: <a href="mailto:info@byvskin.com" className="text-brown-dark hover:underline">info@byvskin.com</a>
                  <br />
                  We may need to verify your identity before fulfilling your request.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h3 className="text-brown-dark mb-4">7. Data Retention</h3>
                <p className="text-brown leading-relaxed mb-4">
                  We retain personal information only as long as necessary for:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 mb-4 ml-4">
                  <li>Fulfilling your orders</li>
                  <li>Legal, accounting or reporting requirements</li>
                  <li>Resolving disputes</li>
                  <li>Enforcing agreements</li>
                </ul>
                <p className="text-brown leading-relaxed">
                  After the retention period, data is securely deleted or anonymized.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h3 className="text-brown-dark mb-4">8. Security Measures</h3>
                <p className="text-brown leading-relaxed">
                  We implement reasonable administrative, technical, and physical safeguards to protect your personal 
                  information. However, no method of transmission over the internet is 100% secure.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h3 className="text-brown-dark mb-4">9. International Data Transfers</h3>
                <p className="text-brown leading-relaxed">
                  Your information may be processed outside your country of residence. By using the site, you consent 
                  to such transfers, which may involve countries with different data protection laws.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h3 className="text-brown-dark mb-4">10. Email Marketing and Communication Preferences</h3>
                <p className="text-brown leading-relaxed mb-4">
                  You may opt-out of marketing emails anytime by:
                </p>
                <ul className="list-disc list-inside text-brown space-y-2 mb-4 ml-4">
                  <li>Clicking "unsubscribe" in an email</li>
                  <li>Contacting us directly</li>
                </ul>
                <p className="text-brown leading-relaxed">
                  Transactional emails (order confirmations, shipping updates) cannot be opted out of.
                </p>
              </div>

              {/* Section 11 */}
              <div>
                <h3 className="text-brown-dark mb-4">11. Third-Party Links</h3>
                <p className="text-brown leading-relaxed">
                  Our site may contain links to external websites. We are not responsible for their privacy practices 
                  or content.
                </p>
              </div>

              {/* Section 12 */}
              <div>
                <h3 className="text-brown-dark mb-4">12. Updates to This Privacy Policy</h3>
                <p className="text-brown leading-relaxed">
                  We may update this privacy policy periodically. Changes will be posted on this page with a new 
                  "Last updated" date.
                </p>
              </div>

              {/* Section 13 */}
              <div className="bg-cream p-8 border border-sand">
                <h3 className="text-brown-dark mb-4">13. Contact Us</h3>
                <p className="text-brown leading-relaxed mb-4">
                  If you have questions about this privacy policy or how your data is handled, contact us at:
                </p>
                <div className="text-brown space-y-1">
                  <p className="font-heading">VSkin</p>
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