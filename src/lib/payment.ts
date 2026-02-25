import { initiatePayment, type PaymentData, type ShippingAddress } from "@/lib/api";
import { recoverCart } from "@/lib/api";

/**
 * Submits the PayU payment form.
 * Creates a hidden form and auto-submits to redirect to PayU hosted checkout.
 */
function submitPayUForm(paymentData: PaymentData) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentData.action;
  form.style.display = "none";

  const fields: Record<string, string> = {
    key: paymentData.key,
    txnid: paymentData.txnid,
    amount: paymentData.amount,
    productinfo: paymentData.productinfo,
    firstname: paymentData.firstname,
    email: paymentData.email,
    phone: paymentData.phone || "",
    surl: paymentData.surl,
    furl: paymentData.furl,
    hash: paymentData.hash,
  };

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

/**
 * Result type for startPayment — either a redirect (online/partial) or an order (COD).
 */
export interface PaymentResult {
  type: "redirect" | "cod";
  order?: unknown;
}

/**
 * Initiates the payment flow:
 * 1. Calls backend to create order and get PayU form data (or COD order)
 * 2. ONLINE/PARTIAL → auto-submits form to redirect to PayU
 * 3. COD → returns immediately with the created order
 */
export async function startPayment(
  payload: { productId?: string; productName?: string; price?: number },
  quantity: number,
  token: string,
  paymentMethod: string = "ONLINE",
  shippingAddress?: ShippingAddress,
  sessionId?: string,
): Promise<PaymentResult> {
  const response = await initiatePayment(payload, quantity, token, paymentMethod, shippingAddress);

  if (!response.success) {
    throw new Error(response.message || "Failed to initiate payment");
  }

  // Mark cart as recovered since user is proceeding to payment
  if (sessionId) {
    recoverCart(sessionId);
  }

  // COD — order created immediately, no PayU redirect
  if (response.paymentMethod === "COD") {
    return { type: "cod", order: response.order };
  }

  // ONLINE or PARTIAL — redirect to PayU
  if (!response.paymentData) {
    throw new Error("Missing payment data from server");
  }
  submitPayUForm(response.paymentData);
  return { type: "redirect" };
}
