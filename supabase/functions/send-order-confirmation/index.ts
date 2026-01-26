import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  size: number;
  color: string;
}

interface OrderConfirmationRequest {
  email: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderConfirmationRequest = await req.json();
    console.log("Received order confirmation request:", orderData.orderNumber);

    // Validate required fields
    if (!orderData.email || !orderData.orderNumber || !orderData.items) {
      throw new Error("Missing required fields: email, orderNumber, or items");
    }

    // Generate order items HTML
    const itemsHtml = orderData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <img src="${item.product.images[0]}" alt="${item.product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
              <div>
                <p style="margin: 0; font-weight: 600; color: #1f2937;">${item.product.name}</p>
                <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Size: ${item.size} | Color: ${item.color}</p>
              </div>
            </div>
          </td>
          <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${item.quantity}</td>
          <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #1f2937;">$${(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #1f2937; letter-spacing: -0.5px;">STRIDE</h1>
              <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">Premium Footwear</p>
            </div>

            <!-- Confirmation Card -->
            <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <!-- Success Banner -->
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
                <div style="width: 64px; height: 64px; background: white; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 32px;">✓</span>
                </div>
                <h2 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">Order Confirmed!</h2>
                <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9);">Thank you for your purchase, ${orderData.customerName}!</p>
              </div>

              <!-- Order Details -->
              <div style="padding: 32px;">
                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Order Number</p>
                  <p style="margin: 0; font-size: 20px; font-weight: 700; color: #1f2937; font-family: monospace;">${orderData.orderNumber}</p>
                </div>

                <!-- Items Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <thead>
                    <tr style="border-bottom: 2px solid #e5e7eb;">
                      <th style="padding: 12px 16px; text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                      <th style="padding: 12px 16px; text-align: center; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                      <th style="padding: 12px 16px; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <!-- Order Summary -->
                <div style="border-top: 2px solid #e5e7eb; padding-top: 20px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Subtotal</span>
                    <span style="color: #1f2937;">$${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Shipping</span>
                    <span style="color: #1f2937;">${orderData.shipping === 0 ? 'FREE' : '$' + orderData.shipping.toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                    <span style="color: #6b7280;">Tax</span>
                    <span style="color: #1f2937;">$${orderData.tax.toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 2px solid #1f2937;">
                    <span style="font-size: 18px; font-weight: 700; color: #1f2937;">Total</span>
                    <span style="font-size: 18px; font-weight: 700; color: #1f2937;">$${orderData.total.toFixed(2)}</span>
                  </div>
                </div>

                <!-- Shipping Address -->
                <div style="margin-top: 32px; padding: 20px; background: #f9fafb; border-radius: 12px;">
                  <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Shipping To</h3>
                  <p style="margin: 0; color: #1f2937; line-height: 1.6;">
                    ${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}<br>
                    ${orderData.shippingAddress.address}<br>
                    ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}<br>
                    ${orderData.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 8px;">Questions about your order?</p>
              <p style="margin: 0;">Contact us at <a href="mailto:support@stride.com" style="color: #10b981; text-decoration: none;">support@stride.com</a></p>
              <p style="margin: 24px 0 0; font-size: 12px;">© 2024 Stride. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Stride <onboarding@resend.dev>",
        to: [orderData.email],
        subject: `Order Confirmed - ${orderData.orderNumber}`,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error sending email:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
