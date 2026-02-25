const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, token } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (token) {
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Product APIs ────────────────────────────────────────────

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  stock: number;
  category: string;
  status: string;
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  totalPages: number;
  total: number;
}

export const fetchActiveProducts = (): Promise<ProductsResponse> =>
  apiRequest<ProductsResponse>("/products");

export const fetchProductById = (id: string): Promise<Product> =>
  apiRequest<Product>(`/products/${id}`);

// ─── Auth APIs ───────────────────────────────────────────────

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export const loginUser = (email: string, password: string): Promise<AuthResponse> =>
  apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const registerUser = (name: string, email: string, password: string): Promise<AuthResponse> =>
  apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });

export const fetchCurrentUser = (token: string) =>
  apiRequest<{ _id: string; name: string; email: string; role: string }>("/auth/me", {
    token,
  });

export const syncSocialUser = (
  email: string,
  name?: string,
  provider?: string
): Promise<AuthResponse> =>
  apiRequest<AuthResponse>("/auth/sync", {
    method: "POST",
    body: { email, name, provider },
  });

// ─── Payment APIs ────────────────────────────────────────────

export interface PaymentData {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  action: string;
  orderId: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  paymentData: PaymentData;
}

export const initiatePayment = (
  payload: { productId?: string; productName?: string; price?: number },
  quantity: number,
  token: string
): Promise<PaymentResponse> =>
  apiRequest<PaymentResponse>("/payment/create", {
    method: "POST",
    body: { ...payload, quantity },
    token,
  });

export const verifyPayment = (txnid: string, token: string) =>
  apiRequest("/payment/verify", {
    method: "POST",
    body: { txnid },
    token,
  });

// ─── Order APIs ──────────────────────────────────────────────

export const createOrder = (
  products: { product: string; quantity: number }[],
  token: string
) =>
  apiRequest("/orders", {
    method: "POST",
    body: { products },
    token,
  });

export const fetchMyOrders = (token: string) =>
  apiRequest("/orders/my", { token });

// ─── Analytics Tracking ──────────────────────────────────────

export const trackEvent = (data: {
  sessionId: string;
  userId?: string;
  page: string;
  referrer?: string;
  entryPage?: string;
  exitPage?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  screenResolution?: string;
  timeSpent?: number;
  sessionDuration?: number;
  isBounce?: boolean;
  eventType?: string;
  metadata?: Record<string, unknown>;
}) =>
  apiRequest("/analytics/track", {
    method: "POST",
    body: data,
  }).catch(() => {
    // Analytics tracking should never break the user experience
  });

export const trackEventsBatch = (events: unknown[]) =>
  apiRequest("/analytics/track/batch", {
    method: "POST",
    body: { events },
  }).catch(() => {});

// ─── Cart Tracking ───────────────────────────────────────────

export const updateCart = (data: {
  sessionId: string;
  userId?: string;
  email?: string;
  products: unknown[];
  totalAmount: number;
}) =>
  apiRequest("/cart/update", {
    method: "POST",
    body: data,
  }).catch(() => {});

export const recoverCart = (sessionId: string) =>
  apiRequest("/cart/recover", {
    method: "POST",
    body: { sessionId },
  }).catch(() => {});

// ─── Tracking Settings ──────────────────────────────────────

export interface TrackingSettings {
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  metaInsightsId?: string;
  customScripts?: {
    name: string;
    script: string;
    placement: string;
    isActive: boolean;
  }[];
}

export const fetchTrackingSettings = (): Promise<TrackingSettings> =>
  apiRequest<TrackingSettings>("/settings/tracking");

export default apiRequest;
