import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
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

Deno.serve(app.fetch);
