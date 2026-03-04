import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { generateOrderConfirmationEmail } from "./email-template.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-af749b27/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// HELPER: Get config value from KV store or env var
// KV store takes priority to allow overriding env vars without redeployment.
// ============================================
async function getConfigValue(envKey: string, kvKey: string): Promise<string | undefined> {
  try {
    const kvValue = await kv.get(`payment_config:${kvKey}`);
    if (kvValue) return kvValue as string;
  } catch (e) {
    console.log(`Error reading KV for ${kvKey}: ${e}`);
  }
  const envValue = Deno.env.get(envKey);
  if (envValue) return envValue;
  return undefined;
}

// ============================================
// HELPER: Get Supabase client for database operations
// ============================================
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase credentials not configured");
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// ============================================
// HELPER: Generate order number in VSkin format
// ============================================
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp.substring(0, 1)}_${random}`;
}

// ============================================
// HELPER: Save order to Postgres and send confirmation email
// This is the atomic operation triggered by webhooks
// ============================================
async function saveOrderAndSendEmail(orderData: {
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  products: any[];
  totalPrice: number;
  paymentMethod: 'Stripe' | 'PayPal';
  paymentStatus: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}) {
  try {
    const supabase = getSupabaseClient();
    
    // Generate order number if not provided
    const orderNumber = orderData.orderNumber || generateOrderNumber();
    
    console.log(`💾 Saving order ${orderNumber} to Postgres...`);
    
    // Save order to Postgres orders table
    const { data: savedOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        products: orderData.products,
        total_price: orderData.totalPrice,
        payment_method: orderData.paymentMethod,
        payment_status: orderData.paymentStatus,
      })
      .select()
      .single();
    
    if (dbError) {
      console.log(`❌ Database error saving order ${orderNumber}: ${dbError.message}`);
      throw new Error(`Failed to save order to database: ${dbError.message}`);
    }
    
    console.log(`✅ Order ${orderNumber} saved to Postgres (ID: ${savedOrder.id})`);
    
    // Send confirmation email
    console.log(`📧 Sending confirmation email to ${orderData.customerEmail}...`);
    
    const RESEND_API_KEY = await getConfigValue("RESEND_API_KEY", "resend_api_key");
    if (!RESEND_API_KEY) {
      console.log(`⚠️  Email skipped for order ${orderNumber}: RESEND_API_KEY not configured`);
      return { success: true, order: savedOrder, emailSent: false };
    }
    
    const emailHtml = generateOrderConfirmationEmail({
      orderNumber,
      items: orderData.products,
      total: orderData.totalPrice,
      customerName: orderData.customerName,
      email: orderData.customerEmail,
      address: orderData.address,
      city: orderData.city,
      postalCode: orderData.postalCode,
      country: orderData.country,
    });
    
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VSkin <onboarding@resend.dev>",
        to: [orderData.customerEmail],
        subject: `Order Confirmation - VSkin (#${orderNumber})`,
        html: emailHtml,
      }),
    });
    
    const emailData = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.log(`⚠️  Email failed for order ${orderNumber}: ${emailData.message || emailData.error}`);
      return { success: true, order: savedOrder, emailSent: false };
    }
    
    console.log(`✅ Confirmation email sent to ${orderData.customerEmail} (Email ID: ${emailData.id})`);
    
    return { success: true, order: savedOrder, emailSent: true, emailId: emailData.id };
  } catch (error: any) {
    console.log(`❌ Error in saveOrderAndSendEmail: ${error.message}`);
    throw error;
  }
}

// ============================================
// PAYMENT CONFIG — read-only public endpoint
// ============================================

// Get public payment configuration
app.get("/make-server-af749b27/config/payment", async (c) => {
  console.log("=== Payment Config Request ===");

  const stripePublishableKey = await getConfigValue("STRIPE_PUBLISHABLE_KEY", "stripe_publishable_key");
  const paypalClientId = await getConfigValue("PAYPAL_CLIENT_ID", "paypal_client_id");
  const paypalMode = (await getConfigValue("PAYPAL_MODE", "paypal_mode")) || "sandbox";

  console.log("STRIPE_PUBLISHABLE_KEY found:", !!stripePublishableKey);
  console.log("PAYPAL_CLIENT_ID found:", !!paypalClientId);
  console.log("PAYPAL_MODE:", paypalMode);

  if (!stripePublishableKey && !paypalClientId) {
    console.log("Payment configuration: No payment keys found in env or KV store");
    return c.json({
      error: "Payment not configured. Please configure environment variables.",
      needsSetup: true,
    }, 500);
  }

  console.log("Payment config loaded successfully");
  return c.json({
    stripePublishableKey: stripePublishableKey || null,
    paypalClientId: paypalClientId || null,
    paypalMode,
  });
});

// ============================================
// STRIPE PAYMENT ROUTES
// ============================================

// Create Stripe payment intent
app.post("/make-server-af749b27/payments/stripe/create-intent", async (c) => {
  try {
    const { amount, currency, cartItems, customerEmail } = await c.req.json();

    const STRIPE_SECRET_KEY = await getConfigValue("STRIPE_SECRET_KEY", "stripe_secret_key");
    if (!STRIPE_SECRET_KEY) {
      console.log("Stripe payment intent creation failed: Missing STRIPE_SECRET_KEY environment variable");
      return c.json({
        error: "Payment service not configured. Please add your Stripe API key.",
      }, 500);
    }

    // Create simplified metadata (max 500 chars per value)
    const itemCount = cartItems?.length || 0;
    const itemNames = cartItems?.map((item: any) => item.name).join(', ').substring(0, 400) || '';

    // Create payment intent with Stripe API
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(), // Convert to cents
        currency: currency || "eur",
        "metadata[customerEmail]": customerEmail || "",
        "metadata[itemCount]": itemCount.toString(),
        "metadata[items]": itemNames,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`Stripe payment intent creation failed: ${JSON.stringify(data)}`);
      return c.json({ error: data.error?.message || "Failed to create payment intent" }, 400);
    }

    console.log(`Stripe payment intent created successfully: ${data.id}`);
    return c.json({
      clientSecret: data.client_secret,
      paymentIntentId: data.id,
    });
  } catch (error) {
    console.log(`Error creating Stripe payment intent: ${error}`);
    return c.json({ error: "Internal server error while creating payment intent" }, 500);
  }
});

// ============================================
// PAYPAL PAYMENT ROUTES
// ============================================

// Get PayPal access token
async function getPayPalAccessToken() {
  const PAYPAL_CLIENT_ID = (await getConfigValue("PAYPAL_CLIENT_ID", "paypal_client_id"))?.trim();
  const PAYPAL_CLIENT_SECRET = (await getConfigValue("PAYPAL_CLIENT_SECRET", "paypal_client_secret"))?.trim();
  const PAYPAL_MODE = ((await getConfigValue("PAYPAL_MODE", "paypal_mode")) || "sandbox").trim().toLowerCase();

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured");
  }

  const baseURL = PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

  console.log(`PayPal auth attempt — mode: ${PAYPAL_MODE}, baseURL: ${baseURL}, clientId: ${PAYPAL_CLIENT_ID.substring(0, 16)}..., secretLength: ${PAYPAL_CLIENT_SECRET.length}`);

  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);

  const response = await fetch(`${baseURL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "Accept-Language": "en_US",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    const reason = data.error_description || data.message || data.error || JSON.stringify(data);
    console.log(`PayPal OAuth failed (mode=${PAYPAL_MODE}, status=${response.status}): ${reason}`);
    throw new Error(
      `PayPal authentication failed (mode=${PAYPAL_MODE}): ${reason}. ` +
      `Hint: make sure your Client ID and Secret match the selected mode (sandbox vs live).`
    );
  }

  console.log(`PayPal access token obtained successfully (mode=${PAYPAL_MODE})`);
  return { accessToken: data.access_token, baseURL };
}

// Create PayPal order
app.post("/make-server-af749b27/payments/paypal/create-order", async (c) => {
  try {
    const { amount, currency, cartItems } = await c.req.json();

    const { accessToken, baseURL } = await getPayPalAccessToken();

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: currency || "EUR",
          value: Number(amount).toFixed(2),
        },
        description: `VSkin Order - ${cartItems?.length || 0} items`,
      }],
    };

    const response = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      const reason = data.message || data.details?.[0]?.description || JSON.stringify(data);
      console.log(`PayPal order creation failed (${response.status}): ${reason}`);
      return c.json({ error: `PayPal order creation failed: ${reason}` }, 400);
    }

    console.log(`PayPal order created successfully: ${data.id}`);
    return c.json({ orderId: data.id });
  } catch (error: any) {
    console.log(`Error creating PayPal order: ${error}`);
    return c.json({ error: error.message || "Internal server error while creating PayPal order" }, 500);
  }
});

// Capture PayPal payment
app.post("/make-server-af749b27/payments/paypal/capture-order", async (c) => {
  try {
    const { orderId } = await c.req.json();

    const { accessToken, baseURL } = await getPayPalAccessToken();

    const response = await fetch(`${baseURL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const reason = data.message || data.details?.[0]?.description || JSON.stringify(data);
      console.log(`PayPal order capture failed (${response.status}): ${reason}`);
      return c.json({ error: `PayPal capture failed: ${reason}` }, 400);
    }

    console.log(`PayPal order captured successfully: ${orderId}`);
    return c.json(data);
  } catch (error: any) {
    console.log(`Error capturing PayPal payment: ${error}`);
    return c.json({ error: error.message || "Internal server error while capturing payment" }, 500);
  }
});

// ============================================
// ORDER MANAGEMENT ROUTES
// ============================================

// Store cart data for webhook access
app.post("/make-server-af749b27/store-cart-data", async (c) => {
  try {
    const { paymentId, provider, ...cartData } = await c.req.json();
    
    if (!paymentId || !provider) {
      return c.json({ error: "Missing paymentId or provider" }, 400);
    }
    
    const key = `${provider}_cart:${paymentId}`;
    await kv.set(key, cartData);
    
    console.log(`📦 Cart data stored for ${provider} payment ${paymentId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error storing cart data: ${error}`);
    return c.json({ error: "Failed to store cart data" }, 500);
  }
});

// Create/save order
app.post("/make-server-af749b27/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const order = {
      id: orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    await kv.set(`order:${orderId}`, order);

    console.log(`Order created successfully: ${orderId}`);
    return c.json({ orderId, order });
  } catch (error) {
    console.log(`Error creating order: ${error}`);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Update order status
app.patch("/make-server-af749b27/orders/:orderId", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const updates = await c.req.json();

    const existingOrder = await kv.get(`order:${orderId}`);
    if (!existingOrder) {
      console.log(`Order not found: ${orderId}`);
      return c.json({ error: "Order not found" }, 404);
    }

    const updatedOrder = {
      ...existingOrder,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, updatedOrder);

    console.log(`Order updated successfully: ${orderId}`);
    return c.json({ order: updatedOrder });
  } catch (error) {
    console.log(`Error updating order: ${error}`);
    return c.json({ error: "Failed to update order" }, 500);
  }
});

// Get order by ID
app.get("/make-server-af749b27/orders/:orderId", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const order = await kv.get(`order:${orderId}`);

    if (!order) {
      console.log(`Order not found: ${orderId}`);
      return c.json({ error: "Order not found" }, 404);
    }

    console.log(`Order retrieved successfully: ${orderId}`);
    return c.json({ order });
  } catch (error) {
    console.log(`Error retrieving order: ${error}`);
    return c.json({ error: "Failed to retrieve order" }, 500);
  }
});

// Get order number by payment ID (Stripe payment intent ID or PayPal order ID)
app.get("/make-server-af749b27/order-number/:paymentId", async (c) => {
  try {
    const paymentId = c.req.param("paymentId");
    const orderNumber = await kv.get(`order_number:${paymentId}`);

    if (!orderNumber) {
      console.log(`Order number not found for payment ID: ${paymentId}`);
      // Return a fallback order number derived from payment ID for display
      // This handles the case where the webhook hasn't processed yet
      const fallback = paymentId.replace('pi_', '').slice(-8).toUpperCase();
      return c.json({ orderNumber: fallback, isWebhookPending: true });
    }

    console.log(`Order number retrieved: ${orderNumber} for payment ${paymentId}`);
    return c.json({ orderNumber: orderNumber as string, isWebhookPending: false });
  } catch (error: any) {
    console.log(`Error retrieving order number: ${error.message}`);
    return c.json({ error: "Failed to retrieve order number" }, 500);
  }
});

// ============================================
// EMAIL SENDING ROUTE - ORDER CONFIRMATION
// ============================================

// Send order confirmation email via Resend
app.post("/make-server-af749b27/send-order-confirmation", async (c) => {
  try {
    const orderDetails = await c.req.json();

    // Validate required fields
    if (!orderDetails.orderNumber || !orderDetails.email || !orderDetails.items) {
      console.log("Order confirmation email failed: Missing required fields");
      return c.json({ error: "Missing required fields: orderNumber, email, items" }, 400);
    }

    // Get Resend API key from environment
    const RESEND_API_KEY = await getConfigValue("RESEND_API_KEY", "resend_api_key");
    if (!RESEND_API_KEY) {
      console.log("Order confirmation email failed: Missing RESEND_API_KEY environment variable");
      return c.json({ 
        error: "Email service not configured. Please add your Resend API key.",
        success: false
      }, 500);
    }

    // Generate HTML email content
    const emailHtml = generateOrderConfirmationEmail({
      orderNumber: orderDetails.orderNumber,
      items: orderDetails.items,
      total: orderDetails.total,
      customerName: orderDetails.customerName,
      email: orderDetails.email,
      address: orderDetails.address,
      city: orderDetails.city,
      postalCode: orderDetails.postalCode,
      country: orderDetails.country,
    });

    // Send email via Resend API
    // NOTE: To send emails to customers, you must verify a domain at https://resend.com/domains
    // OR verify individual sender addresses at https://resend.com/emails
    const fromEmail = "VSkin <onboarding@resend.dev>";
    
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [orderDetails.email],
        subject: `Order Confirmation - VSkin (#${orderDetails.orderNumber})`,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || data.error || JSON.stringify(data);
      console.log(`⚠️  Resend email send failed (${response.status}): ${errorMsg}`);
      
      // Don't fail the order if email fails - just log it
      console.log("ℹ️  Order was processed successfully, but confirmation email failed to send");
      return c.json({ 
        success: true, 
        emailFailed: true,
        message: "Order processed successfully, but confirmation email could not be sent" 
      });
    }

    console.log(`✅ Order confirmation email sent successfully to ${orderDetails.email} (Email ID: ${data.id})`);
    return c.json({ 
      success: true, 
      emailId: data.id,
      message: "Order confirmation email sent successfully" 
    });
  } catch (error: any) {
    console.log(`Error sending order confirmation email: ${error}`);
    return c.json({ 
      error: error.message || "Internal server error while sending email",
      success: false
    }, 500);
  }
});

// ============================================
// WEBHOOK HANDLERS - AUTOMATIC ORDER CREATION
// ============================================

// Stripe Webhook - Automatically save orders when payment succeeds
app.post("/make-server-af749b27/webhooks/stripe", async (c) => {
  try {
    console.log("🔔 Stripe webhook received");
    
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature");
    
    if (!signature) {
      console.log("❌ Stripe webhook rejected: Missing signature");
      return c.json({ error: "Missing signature" }, 400);
    }
    
    // Get webhook secret for signature verification
    const STRIPE_WEBHOOK_SECRET = await getConfigValue("STRIPE_WEBHOOK_SECRET", "stripe_webhook_secret");
    const STRIPE_SECRET_KEY = await getConfigValue("STRIPE_SECRET_KEY", "stripe_secret_key");
    
    if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY) {
      console.log("❌ Stripe webhook configuration missing");
      return c.json({ error: "Webhook not configured" }, 500);
    }
    
    // Verify webhook signature
    let event;
    try {
      // Construct the event using Stripe's verification
      // Parse timestamp and signatures from header
      const parts = signature.split(',');
      const timestamp = parts.find(p => p.startsWith('t='))?.substring(2);
      const sig = parts.find(p => p.startsWith('v1='))?.substring(3);
      
      if (!timestamp || !sig) {
        throw new Error("Invalid signature format");
      }
      
      // Construct signed payload
      const signedPayload = `${timestamp}.${body}`;
      
      // Compute HMAC with webhook secret
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(STRIPE_WEBHOOK_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signatureBytes = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(signedPayload)
      );
      
      // Convert to hex string
      const expectedSignature = Array.from(new Uint8Array(signatureBytes))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      // Compare signatures
      if (expectedSignature !== sig) {
        console.log("❌ Stripe webhook rejected: Invalid signature");
        return c.json({ error: "Invalid signature" }, 401);
      }
      
      console.log("✅ Stripe webhook signature verified");
      
      // Parse the verified event
      event = JSON.parse(body);
    } catch (err: any) {
      console.log(`❌ Stripe webhook signature verification failed: ${err.message}`);
      return c.json({ error: "Invalid signature" }, 401);
    }
    
    // Handle payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      
      console.log(`💳 Stripe payment succeeded: ${paymentIntent.id}`);
      console.log(`Amount: €${(paymentIntent.amount / 100).toFixed(2)}`);
      console.log(`Customer email: ${paymentIntent.metadata?.customerEmail || 'N/A'}`);
      
      // Extract order data from payment intent metadata
      // Note: Frontend should store cart data in KV store with payment intent ID as key
      const cartDataKey = `stripe_cart:${paymentIntent.id}`;
      const cartData = await kv.get(cartDataKey) as any;
      
      if (!cartData) {
        console.log(`⚠️  No cart data found for payment intent ${paymentIntent.id}`);
        console.log(`⚠️  Order will need to be created manually from Stripe dashboard`);
        return c.json({ received: true, warning: "No cart data found" });
      }
      
      // Save order to Postgres and send email atomically
      const result = await saveOrderAndSendEmail({
        customerName: cartData.customerName || "Stripe Customer",
        customerEmail: paymentIntent.metadata?.customerEmail || cartData.customerEmail || "unknown@email.com",
        products: cartData.items || [],
        totalPrice: paymentIntent.amount / 100, // Convert from cents
        paymentMethod: "Stripe",
        paymentStatus: "completed",
        address: cartData.address,
        city: cartData.city,
        postalCode: cartData.postalCode,
        country: cartData.country,
      });
      
      console.log(`✅ Stripe webhook processed successfully: Order ${result.order.order_number} created`);
      
      // Clean up cart data from KV store
      await kv.del(cartDataKey);
      
      // Store the order number in KV so frontend can retrieve it
      await kv.set(`order_number:${paymentIntent.id}`, result.order.order_number);
      
      return c.json({ 
        received: true, 
        orderNumber: result.order.order_number,
        emailSent: result.emailSent 
      });
    }
    
    // For other event types, just acknowledge receipt
    console.log(`ℹ️  Stripe webhook event type ${event.type} received (not processed)`);
    return c.json({ received: true });
    
  } catch (error: any) {
    console.log(`❌ Error processing Stripe webhook: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// PayPal Webhook - Automatically save orders when payment is captured
app.post("/make-server-af749b27/webhooks/paypal", async (c) => {
  try {
    console.log("🔔 PayPal webhook received");
    
    const rawBody = await c.req.text();
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      console.log("❌ PayPal webhook rejected: Invalid JSON");
      return c.json({ error: "Invalid payload" }, 400);
    }
    
    const eventType = body.event_type;
    console.log(`PayPal event type: ${eventType}`);
    
    // Get PayPal webhook verification credentials
    const PAYPAL_WEBHOOK_ID = await getConfigValue("PAYPAL_WEBHOOK_ID", "paypal_webhook_id");
    
    if (!PAYPAL_WEBHOOK_ID) {
      console.log("❌ PayPal webhook configuration missing: PAYPAL_WEBHOOK_ID not set");
      return c.json({ error: "Webhook not configured" }, 500);
    }
    
    // Verify webhook signature using PayPal's verification API
    try {
      const { accessToken, baseURL } = await getPayPalAccessToken();
      
      // Extract webhook headers for verification
      const transmissionId = c.req.header("paypal-transmission-id");
      const transmissionTime = c.req.header("paypal-transmission-time");
      const transmissionSig = c.req.header("paypal-transmission-sig");
      const certUrl = c.req.header("paypal-cert-url");
      const authAlgo = c.req.header("paypal-auth-algo");
      
      if (!transmissionId || !transmissionTime || !transmissionSig) {
        console.log("❌ PayPal webhook rejected: Missing verification headers");
        return c.json({ error: "Missing verification headers" }, 400);
      }
      
      // Call PayPal's webhook verification endpoint
      const verifyResponse = await fetch(`${baseURL}/v1/notifications/verify-webhook-signature`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transmission_id: transmissionId,
          transmission_time: transmissionTime,
          cert_url: certUrl,
          auth_algo: authAlgo,
          transmission_sig: transmissionSig,
          webhook_id: PAYPAL_WEBHOOK_ID,
          webhook_event: body,
        }),
      });
      
      const verifyData = await verifyResponse.json();
      
      if (!verifyResponse.ok || verifyData.verification_status !== "SUCCESS") {
        console.log(`❌ PayPal webhook verification failed: ${verifyData.verification_status || 'UNKNOWN'}`);
        return c.json({ error: "Webhook verification failed" }, 401);
      }
      
      console.log("✅ PayPal webhook signature verified");
    } catch (err: any) {
      console.log(`❌ PayPal webhook verification error: ${err.message}`);
      return c.json({ error: "Verification failed" }, 401);
    }
    
    // Handle PAYMENT.CAPTURE.COMPLETED event
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = body.resource;
      const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;
      
      console.log(`💳 PayPal payment captured: ${resource.id}`);
      console.log(`Amount: ${resource.amount.currency_code} ${resource.amount.value}`);
      
      // Extract order data from KV store
      // Note: Frontend should store cart data with PayPal order ID as key
      const cartDataKey = `paypal_cart:${orderId}`;
      const cartData = await kv.get(cartDataKey) as any;
      
      if (!cartData) {
        console.log(`⚠️  No cart data found for PayPal order ${orderId}`);
        console.log(`⚠️  Order will need to be created manually from PayPal dashboard`);
        return c.json({ received: true, warning: "No cart data found" });
      }
      
      // Save order to Postgres and send email atomically
      const result = await saveOrderAndSendEmail({
        customerName: cartData.customerName || resource.payer?.name?.given_name + " " + resource.payer?.name?.surname || "PayPal Customer",
        customerEmail: resource.payer?.email_address || cartData.customerEmail || "unknown@email.com",
        products: cartData.items || [],
        totalPrice: parseFloat(resource.amount.value),
        paymentMethod: "PayPal",
        paymentStatus: "completed",
        address: cartData.address,
        city: cartData.city,
        postalCode: cartData.postalCode,
        country: cartData.country,
      });
      
      console.log(`✅ PayPal webhook processed successfully: Order ${result.order.order_number} created`);
      
      // Clean up cart data from KV store
      await kv.del(cartDataKey);
      
      // Store the order number in KV so frontend can retrieve it
      await kv.set(`order_number:${orderId}`, result.order.order_number);
      
      return c.json({ 
        received: true, 
        orderNumber: result.order.order_number,
        emailSent: result.emailSent 
      });
    }
    
    // For other event types, just acknowledge receipt
    console.log(`ℹ️  PayPal webhook event type ${eventType} received (not processed)`);
    return c.json({ received: true });
    
  } catch (error: any) {
    console.log(`❌ Error processing PayPal webhook: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);