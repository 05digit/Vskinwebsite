import { useState, useEffect, useRef } from 'react';
import { getPaymentConfig } from '../utils/payment/info';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner@2.0.3';
import { CreditCard, ShoppingBag, Lock, Mail, User, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

declare global {
  interface Window {
    Stripe?: any;
    paypal?: any;
  }
}

type PaymentMethod = 'stripe' | 'paypal';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  
  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Ireland',
    phone: '',
  });

  // Keep a ref in sync with the latest customerInfo so PayPal button callbacks
  // always see the current values (avoids stale-closure issues).
  const customerInfoRef = useRef(customerInfo);
  customerInfoRef.current = customerInfo;

  // Stripe state
  const [stripe, setStripe] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [paymentConfig, setPaymentConfig] = useState<{ stripePublishableKey: string; paypalClientId: string; paypalMode?: string } | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  // Load payment configuration
  useEffect(() => {
    setConfigLoading(true);
    getPaymentConfig()
      .then((config) => {
        setPaymentConfig(config);
      })
      .catch((error) => {
        console.error('Failed to load payment configuration:', error);
        toast.error('Payment is temporarily unavailable. Please try again shortly.');
      })
      .finally(() => {
        setConfigLoading(false);
      });
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items, navigate]);

  // Load Stripe
  useEffect(() => {
    if (window.Stripe) {
      setStripeLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => setStripeLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize Stripe Elements when Stripe loads and payment method is selected
  useEffect(() => {
    if (!stripeLoaded || !window.Stripe || paymentMethod !== 'stripe') return;
    if (!paymentConfig?.stripePublishableKey) return;

    // Use a small delay to ensure the DOM element is rendered
    const timer = setTimeout(() => {
      const cardElementContainer = document.getElementById('card-element');
      if (!cardElementContainer) return;

      // Don't re-initialize if already mounted
      if (cardElement) {
        try { cardElement.destroy(); } catch (e) { /* ignore */ }
      }

      const stripeInstance = window.Stripe(paymentConfig.stripePublishableKey);
      setStripe(stripeInstance);

      const elements = stripeInstance.elements();
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#5C4033',
            fontFamily: 'DM Sans, sans-serif',
            '::placeholder': {
              color: '#B89968',
            },
          },
        },
      });

      card.mount('#card-element');
      setCardElement(card);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cardElement) {
        try { cardElement.destroy(); } catch (e) { /* ignore */ }
      }
    };
  }, [stripeLoaded, paymentMethod, paymentConfig]);

  // Pre-warm the Edge Function as soon as the checkout page mounts so it's
  // ready by the time the user clicks PayPal (avoids cold-start timeout).
  useEffect(() => {
    fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-af749b27/health`,
      { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
    ).catch(() => { /* fire-and-forget */ });
  }, []);

  // Load PayPal
  useEffect(() => {
    if (paymentMethod !== 'paypal') return;
    if (!paymentConfig?.paypalClientId) return;

    if (window.paypal) {
      // SDK already present — render buttons straight away.
      // Use a short delay only to guarantee the DOM node exists after render.
      const t = setTimeout(() => renderPayPalButtons(), 50);
      return () => clearTimeout(t);
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paymentConfig.paypalClientId}&currency=EUR&intent=capture`;
    script.async = true;
    script.onload = () => {
      setTimeout(() => renderPayPalButtons(), 50);
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      toast.error('Failed to load PayPal. Please check your Client ID.');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [paymentMethod, paymentConfig]);

  const validateForm = () => {
    if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
      toast.error('Please fill in all required fields');
      return false;
    }
    
    if (!customerInfo.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Validation that reads from the ref — safe to call inside PayPal callbacks
  // that were rendered at an earlier point in time.
  const validateFormFromRef = () => {
    const info = customerInfoRef.current;
    if (!info.email || !info.firstName || !info.lastName) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (!info.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!stripe || !cardElement) {
      toast.error('Stripe is not loaded yet. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-af749b27/payments/stripe/create-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            amount: totalPrice,
            currency: 'eur',
            customerEmail: customerInfo.email,
            cartItems: items,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city,
              postal_code: customerInfo.postalCode,
              country: 'IE',
            },
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        await saveOrder(paymentIntent.id, 'stripe');
        toast.success('Payment successful!');
        clearCart();
        navigate(`/order-success?orderId=${paymentIntent.id}`);
      }
    } catch (error: any) {
      console.error('Stripe payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPayPalButtons = () => {
    // Check window.paypal directly — avoids stale-closure on the paypalLoaded
    // state variable which may still be false when this is called from a
    // setTimeout scheduled during the same render cycle.
    if (!window.paypal) return;

    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    // Clear existing buttons
    container.innerHTML = '';

    window.paypal.Buttons({
      createOrder: async () => {
        // Use ref-based validation so we always see the latest form values,
        // even though this callback was created when the buttons were rendered.
        if (!validateFormFromRef()) {
          throw new Error('validation_failed');
        }

        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-af749b27/payments/paypal/create-order`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({
                amount: totalPrice,
                currency: 'EUR',
                cartItems: items,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to create PayPal order');
          }

          return data.orderId;
        } catch (error: any) {
          if (error.message !== 'validation_failed') {
            toast.error(error.message || 'Failed to create PayPal order');
          }
          throw error;
        }
      },
      onApprove: async (data: any) => {
        setIsProcessing(true);
        
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-af749b27/payments/paypal/capture-order`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({ orderId: data.orderID }),
            }
          );

          const captureData = await response.json();

          if (!response.ok) {
            throw new Error(captureData.error || 'Failed to capture PayPal payment');
          }

          await saveOrder(data.orderID, 'paypal');
          toast.success('Payment successful!');
          clearCart();
          navigate(`/order-success?orderId=${data.orderID}`);
        } catch (error: any) {
          console.error('PayPal capture error:', error);
          toast.error(error.message || 'Payment failed. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      },
      onError: (error: any) => {
        const msg = error?.message || String(error);
        // Suppress generic error toast for validation failures — the specific
        // toast was already shown by validateFormFromRef().
        if (msg === 'validation_failed' || msg.includes('Please fill in') || msg.includes('valid email')) {
          return;
        }
        console.error('PayPal error:', error);
        toast.error('PayPal payment failed. Please try again.');
      },
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
      },
    }).render('#paypal-button-container');
  };

  const saveOrder = async (paymentId: string, method: PaymentMethod) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-af749b27/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            paymentId,
            paymentMethod: method,
            customerInfo,
            items,
            totalPrice,
            status: 'completed',
          }),
        }
      );

      if (!response.ok) {
        console.error('Failed to save order');
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-cream border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Lock className="w-12 h-12 text-brown mx-auto mb-4" />
            <h1 className="mb-2">Secure Checkout</h1>
            <p className="text-brown">Complete your order with confidence</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Customer Info & Payment */}
          <div className="space-y-8">
            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-brown" />
                Customer Information
              </h2>
              
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-brown mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-sand focus:border-brown focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-brown mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-sand focus:border-brown focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-brown mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border border-sand focus:border-brown focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-brown mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-sand focus:border-brown focus:outline-none transition-colors"
                    placeholder="+353 1 234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm text-brown mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full px-4 py-3 border border-sand focus:border-brown focus:outline-none transition-colors"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-brown mb-2">City</label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      className="w-full px-4 py-3 border border-sand focus:border-brown focus:outline-none transition-colors"
                      placeholder="Dublin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-brown mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={customerInfo.postalCode}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                      className="w-full px-4 py-3 border border-sand focus:border-brown focus:outline-none transition-colors"
                      placeholder="D02 X285"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brown" />
                Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 border-2 transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-brown bg-cream'
                      : 'border-sand hover:border-brown'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                    paymentMethod === 'stripe' ? 'text-brown' : 'text-sand'
                  }`} />
                  <p className={`text-sm ${
                    paymentMethod === 'stripe' ? 'text-brown-dark' : 'text-brown'
                  }`}>
                    Credit Card
                  </p>
                </button>

                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 border-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-brown bg-cream'
                      : 'border-sand hover:border-brown'
                  }`}
                >
                  <div className={`font-bold text-xl mb-2 ${
                    paymentMethod === 'paypal' ? 'text-[#0070BA]' : 'text-sand'
                  }`}>
                    PayPal
                  </div>
                  <p className={`text-sm ${
                    paymentMethod === 'paypal' ? 'text-brown-dark' : 'text-brown'
                  }`}>
                    PayPal
                  </p>
                </button>
              </div>

              {/* Stripe Payment Form */}
              {paymentMethod === 'stripe' && (
                <>
                  {configLoading || !paymentConfig?.stripePublishableKey ? (
                    <div className="p-6 border border-sand bg-cream text-center space-y-3">
                      <p className="text-sm text-brown">
                        {configLoading
                          ? 'Loading payment configuration...'
                          : 'Credit card payments are currently unavailable. Please try PayPal or contact us.'}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleStripePayment} className="space-y-6">
                      <div>
                        <label className="block text-sm text-brown mb-2">
                          Card Information
                        </label>
                        <div
                          id="card-element"
                          className="p-4 border border-sand focus-within:border-brown transition-colors min-h-[44px]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing || !stripe || !cardElement}
                        className="btn-primary w-full bg-brown-dark text-white py-4 hover:bg-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : `Pay €${totalPrice.toFixed(2)}`}
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* PayPal Payment */}
              {paymentMethod === 'paypal' && (
                <>
                  {configLoading || !paymentConfig?.paypalClientId ? (
                    <div className="p-6 border border-sand bg-cream text-center space-y-3">
                      <p className="text-sm text-brown">
                        {configLoading
                          ? 'Loading payment configuration...'
                          : 'PayPal is currently unavailable. Please try credit card or contact us.'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div id="paypal-button-container" className="min-h-[150px]" />
                      {isProcessing && (
                        <div className="text-center text-brown mt-4">
                          Processing payment...
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="flex items-start gap-2 text-sm text-brown mt-4 bg-cream p-4">
                <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Your payment information is secure and encrypted. We never store your card details.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="sticky top-24">
              <h2 className="mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brown" />
                Order Summary
              </h2>

              <div className="border border-sand p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-sand last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover bg-cream"
                    />
                    <div className="flex-1">
                      <h3 className="text-brown-dark mb-1">{item.name}</h3>
                      <p className="text-sm text-brown mb-2">Quantity: {item.quantity}</p>
                      <p className="text-brown-dark">€{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-brown">
                    <span>Subtotal</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-brown">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-sand pt-2 flex justify-between">
                    <span>Total</span>
                    <span className="text-xl">€{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-brown bg-cream p-4">
                <p className="flex items-center gap-2">
                  <span className="text-brown">✓</span>
                  Free shipping on all orders
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-brown">✓</span>
                  30-day return policy
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-brown">✓</span>
                  Secure & encrypted payment
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}