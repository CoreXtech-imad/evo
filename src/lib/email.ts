import nodemailer from 'nodemailer'
import { Order, Product } from '@/types'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOrderConfirmationEmail(
  order: Order,
  product: Product,
  downloadUrl?: string
): Promise<void> {
  if (!order.customer_email) return

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Digital Bite</title>
</head>
<body style="margin:0;padding:0;background:#0b0e14;font-family:'Inter',sans-serif;color:#ecedf6;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="background:linear-gradient(135deg,#81ecff,#dd8bfb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px;font-weight:900;margin:0;letter-spacing:-0.02em;">
        Digital Bite
      </h1>
      <p style="color:#a9abb3;margin:8px 0 0;font-size:14px;">Premium Digital Marketplace</p>
    </div>

    <!-- Success Banner -->
    <div style="background:linear-gradient(135deg,rgba(129,236,255,0.1),rgba(221,139,251,0.1));border:1px solid rgba(129,236,255,0.2);border-radius:16px;padding:32px;text-align:center;margin-bottom:32px;">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,#81ecff,#dd8bfb);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="color:#005762;font-size:32px;">✓</span>
      </div>
      <h2 style="color:#ecedf6;font-size:24px;font-weight:800;margin:0 0 8px;">Order Confirmed!</h2>
      <p style="color:#a9abb3;margin:0;font-size:14px;">Order #${order.order_number}</p>
    </div>

    <!-- Greeting -->
    <p style="color:#ecedf6;font-size:16px;margin-bottom:32px;">
      Hi <strong>${order.customer_name}</strong>, thank you for your purchase! 🎉<br>
      Your order has been received and is being processed.
    </p>

    <!-- Order Details -->
    <div style="background:#161a21;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#81ecff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 20px;">Order Details</h3>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span style="color:#a9abb3;">Product</span>
        <span style="color:#ecedf6;font-weight:600;">${order.product_name}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span style="color:#a9abb3;">Quantity</span>
        <span style="color:#ecedf6;">${order.quantity}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
        <span style="color:#a9abb3;">Total</span>
        <span style="color:#81ecff;font-weight:700;font-size:18px;">$${order.total_price.toFixed(2)}</span>
      </div>
      <div style="border-top:1px solid rgba(69,72,79,0.3);margin:16px 0;"></div>
      <div style="display:flex;justify-content:space-between;">
        <span style="color:#a9abb3;">Payment</span>
        <span style="color:#ecedf6;">${order.payment_method === 'cash' ? 'Cash on Delivery' : 'Digital Payment'}</span>
      </div>
    </div>

    <!-- Download Link (if available) -->
    ${downloadUrl ? `
    <div style="background:linear-gradient(135deg,rgba(129,236,255,0.05),rgba(221,139,251,0.05));border:1px solid rgba(129,236,255,0.15);border-radius:16px;padding:24px;margin-bottom:24px;text-align:center;">
      <h3 style="color:#ecedf6;font-size:16px;font-weight:700;margin:0 0 8px;">⬇️ Download Your Product</h3>
      <p style="color:#a9abb3;font-size:13px;margin:0 0 20px;">Your download link is ready. This link expires in 48 hours and can be used up to 5 times.</p>
      <a href="${downloadUrl}" style="display:inline-block;background:linear-gradient(135deg,#81ecff,#dd8bfb);color:#005762;font-weight:800;font-size:16px;padding:16px 40px;border-radius:999px;text-decoration:none;">
        Download Now
      </a>
    </div>
    ` : `
    <div style="background:#161a21;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#ecedf6;font-size:16px;font-weight:700;margin:0 0 8px;">📦 What's Next?</h3>
      <p style="color:#a9abb3;font-size:14px;margin:0;">
        Our team will contact you via WhatsApp at <strong style="color:#ecedf6;">${order.customer_phone}</strong> to deliver your product and confirm your order.
      </p>
    </div>
    `}

    <!-- Contact Info -->
    <div style="text-align:center;margin-bottom:40px;">
      <p style="color:#a9abb3;font-size:13px;margin:0;">
        Questions? Contact us on WhatsApp or email us at<br>
        <a href="mailto:support@digitalbite.store" style="color:#81ecff;text-decoration:none;">support@digitalbite.store</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid rgba(69,72,79,0.2);padding-top:24px;">
      <p style="color:#a9abb3;font-size:12px;margin:0;">
        © 2024 Digital Bite · The Digital Nebula Experience
      </p>
    </div>
  </div>
</body>
</html>
  `

  await transporter.sendMail({
    from: `"Digital Bite" <${process.env.SMTP_USER}>`,
    to: order.customer_email,
    subject: `✅ Order Confirmed #${order.order_number} - ${order.product_name}`,
    html,
  })
}

export async function sendAdminNotificationEmail(order: Order): Promise<void> {
  if (!process.env.ADMIN_EMAIL) return

  const html = `
    <h2>New Order Received!</h2>
    <p><strong>Order:</strong> #${order.order_number}</p>
    <p><strong>Product:</strong> ${order.product_name}</p>
    <p><strong>Customer:</strong> ${order.customer_name}</p>
    <p><strong>Phone:</strong> ${order.customer_phone}</p>
    <p><strong>Email:</strong> ${order.customer_email || 'N/A'}</p>
    <p><strong>City:</strong> ${order.customer_city}</p>
    <p><strong>Address:</strong> ${order.customer_address}</p>
    <p><strong>Total:</strong> $${order.total_price.toFixed(2)}</p>
    <p><strong>Payment:</strong> ${order.payment_method}</p>
    <p><strong>Time:</strong> ${order.created_at}</p>
  `

  await transporter.sendMail({
    from: `"Digital Bite System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New Order #${order.order_number} - $${order.total_price.toFixed(2)}`,
    html,
  })
}
