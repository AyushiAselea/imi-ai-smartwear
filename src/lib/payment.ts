import { initiatePayment, type PaymentData, type ShippingAddress } from "@/lib/api";
import { recoverCart } from "@/lib/api";

/**
 * Submits the Zaakpay V13 payment form.
 * Creates a hidden form and auto-submits to redirect to Zaakpay hosted checkout.
 * Field names must exactly match the Zaakpay V13 API spec.
 */
function submitZaakpayForm(paymentData: PaymentData) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentData.action;
  form.style.display = "none";

  const fields: Record<string, string> = {
    amount:             paymentData.amount,
    buyerAddress:       paymentData.buyerAddress,
    buyerCity:          paymentData.buyerCity,
    buyerCountry:       paymentData.buyerCountry,
    buyerEmail:         paymentData.buyerEmail,
    buyerFirstName:     paymentData.buyerFirstName,
    buyerLastName:      paymentData.buyerLastName,
    buyerPhoneNumber:   paymentData.buyerPhoneNumber || "",
    buyerPincode:       paymentData.buyerPincode,
    buyerState:         paymentData.buyerState,
    currency:           paymentData.currency,
    merchantIdentifier: paymentData.merchantIdentifier,
    mode:               paymentData.mode,
    orderId:            paymentData.orderId,
    productDescription: paymentData.productDescription,
    returnUrl:          paymentData.returnUrl,
    checksum:           paymentData.checksum,
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
  payload: { productId?: string; productName?: string; price?: number; variant?: string },
  quantity: number,
  token: string,    // pass "" for guest checkout
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

  // COD — order created immediately, no Zaakpay redirect
  if (response.paymentMethod === "COD") {
    return { type: "cod", order: response.order };
  }

  // ONLINE or PARTIAL — redirect to Zaakpay
  if (!response.paymentData) {
    throw new Error("Missing payment data from server");
  }
  submitZaakpayForm(response.paymentData);
  return { type: "redirect" };
}
