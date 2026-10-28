import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle2, Package, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [showConfetti, setShowConfetti] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [webhookTimedOut, setWebhookTimedOut] = useState(false);

  // Removed clearCart() - cart is already cleared in CheckoutPage before navigation

  // Fetch the real order number from the webhook
  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 10; // Try for up to 20 seconds (10 attempts * 2 seconds)

    const fetchOrderNumber = async () => {
      attempts++;
      
      try {
        console.log(`[OrderSuccess] Fetching order number for payment ID: ${orderId} (attempt ${attempts})`);
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-af749b27/order-number/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(`[OrderSuccess] API response:`, data);
          
          // Always set the order number (either fallback or real)
          setOrderNumber(data.orderNumber);
          
          // If webhook is still pending and we haven't exceeded max attempts, poll again
          if (data.isWebhookPending && attempts < maxAttempts) {
            console.log(`[OrderSuccess] Webhook still pending, will retry in 2 seconds...`);
            setTimeout(fetchOrderNumber, 2000);
          } else {
            // Stop polling - either we got the real number or exceeded max attempts
            setIsLoading(false);
            
            if (data.isWebhookPending) {
              console.warn(`[OrderSuccess] Max polling attempts reached. Displaying fallback order number.`);
              setWebhookTimedOut(true);
            } else {
              console.log(`[OrderSuccess] Real order number received: ${data.orderNumber}`);
            }
          }
        } else {
          console.error(`[OrderSuccess] API error: ${response.status}`);
          // Fallback to derived order number if API fails
          const fallback = orderId.replace('pi_', '').replace('order_', '').slice(-8).toUpperCase();
          setOrderNumber(fallback);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[OrderSuccess] Error fetching order number:', error);
        // Fallback to derived order number
        const fallback = orderId.replace('pi_', '').replace('order_', '').slice(-8).toUpperCase();
        setOrderNumber(fallback);
        setIsLoading(false);
      }
    };

    fetchOrderNumber();
  }, [orderId]);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: 360,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'linear',
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#B89968', '#5C4033', '#F5F0E8'][Math.floor(Math.random() * 3)],
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-4 border-cream"
              />
              <div className="relative bg-cream rounded-full p-8">
                <CheckCircle2 className="w-24 h-24 text-brown" strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-brown mb-2"
          >
            Thank you for your purchase
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-brown mb-8"
          >
            Confidence looks good on you
          </motion.p>

          {/* Order ID */}
          {orderId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-cream border border-sand p-6 mb-12 inline-block min-w-[300px]"
            >
              <p className="text-sm text-brown mb-2">Order Number</p>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 text-brown-dark">
                  <div className="w-4 h-4 border-2 border-brown border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Processing...</span>
                </div>
              ) : webhookTimedOut ? (
                <div className="text-brown-dark">
                  <p className="text-sm mb-2">Your order number will be sent to your email confirmation shortly.</p>
                  <p className="text-xs text-brown">Please check your inbox for order details.</p>
                </div>
              ) : (
                <p className="text-brown-dark font-mono text-sm break-all">#{orderNumber}</p>
              )}
            </motion.div>
          )}

          {/* Information Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid md:grid-cols-2 gap-6 mb-12 text-left"
          >
            <div className="border border-sand p-6">
              <div className="flex items-start gap-4">
                <div className="bg-cream p-3 rounded-full">
                  <Mail className="w-6 h-6 text-brown" />
                </div>
                <div>
                  <h3 className="text-brown-dark mb-2">Confirmation Email</h3>
                  <p className="text-sm text-brown">
                    A confirmation email with your order details has been sent to your email address.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-sand p-6">
              <div className="flex items-start gap-4">
                <div className="bg-cream p-3 rounded-full">
                  <Package className="w-6 h-6 text-brown" />
                </div>
                <div>
                  <h3 className="text-brown-dark mb-2">Shipping Information</h3>
                  <p className="text-sm text-brown">
                    Your order will be carefully packaged and shipped within 2-3 business days.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-cream p-8 mb-8"
          >
            <h2 className="mb-4">What happens next?</h2>
            <div className="space-y-4 text-left max-w-xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brown text-white flex items-center justify-center text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-brown-dark mb-1">Order Processing</h3>
                  <p className="text-sm text-brown">
                    We'll carefully prepare your luxury skincare products for shipping.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brown text-white flex items-center justify-center text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-brown-dark mb-1">Shipping Notification</h3>
                  <p className="text-sm text-brown">
                    You'll receive a shipping confirmation email with tracking information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brown text-white flex items-center justify-center text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-brown-dark mb-1">Delivery</h3>
                  <p className="text-sm text-brown">
                    Your VSkin products will arrive at your doorstep within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/shop"
              className="btn-primary inline-flex items-center justify-center gap-2 bg-brown-dark text-white px-8 py-4 hover:bg-brown transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-brown text-brown-dark px-8 py-4 hover:bg-cream transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-sm text-brown"
          >
            <p className="mb-2">Need help with your order?</p>
            <p>
              Contact us at{' '}
              <a href="mailto:support@vskin.com" className="text-brown-dark hover:text-brown underline">
                support@vskin.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}