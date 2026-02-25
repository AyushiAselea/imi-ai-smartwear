import { initiatePayment, type PaymentData } from "@/lib/api";
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
 * Initiates the PayU payment flow:
 * 1. Calls backend to create order and get PayU form data
 * 2. Auto-submits form to redirect to PayU
 */
export async function startPayment(
  payload: { productId?: string; productName?: string; price?: number },
  quantity: number,
  token: string,
  sessionId?: string
): Promise<void> {
  const response = await initiatePayment(payload, quantity, token);

  if (!response.success || !response.paymentData) {
    throw new Error(response.message || "Failed to initiate payment");
  }

  // Mark cart as recovered since user is proceeding to payment
  if (sessionId) {
    recoverCart(sessionId);
  }

  // Redirect to PayU
  submitPayUForm(response.paymentData);
}
