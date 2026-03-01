import { projectId, publicAnonKey } from '../supabase/info';

const CACHE_KEY = 'vskin_payment_config_v1';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

type PaymentConfig = { stripePublishableKey: string; paypalClientId: string; paypalMode?: string };

// In-memory cache (survives re-renders, cleared on page refresh)
let memCache: PaymentConfig | null = null;

function readLocalCache(): PaymentConfig | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data as PaymentConfig;
  } catch {
    return null;
  }
}

function writeLocalCache(config: PaymentConfig) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: config, ts: Date.now() }));
  } catch { /* localStorage unavailable */ }
}

async function fetchFromServer(): Promise<PaymentConfig> {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-af749b27/config/payment`,
    {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    if (error.needsSetup) throw new Error('NEEDS_SETUP');
    throw new Error(error.error || 'Failed to fetch payment configuration');
  }

  return response.json();
}

export async function getPaymentConfig(): Promise<PaymentConfig> {
  // 1. Return in-memory cache immediately
  if (memCache) return memCache;

  // 2. Return localStorage cache immediately and refresh in background
  const localCached = readLocalCache();
  if (localCached) {
    memCache = localCached;
    // Silently refresh in the background to keep Edge Function warm
    fetchFromServer()
      .then((fresh) => {
        memCache = fresh;
        writeLocalCache(fresh);
      })
      .catch(() => { /* ignore background refresh errors */ });
    return localCached;
  }

  // 3. No cache — fetch from server
  try {
    const config = await fetchFromServer();
    memCache = config;
    writeLocalCache(config);
    return config;
  } catch (error) {
    console.error('Failed to fetch payment configuration:', error);
    throw error;
  }
}

// Legacy exports for backward compatibility (will be empty until config is loaded)
export const stripePublishableKey = "";
export const paypalClientId = "";
