import { Order } from '@/types'

export async function sendOrderWebhook(order: Order): Promise<void> {
  const webhookUrl = process.env.WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.WEBHOOK_SECRET || '',
      },
      body: JSON.stringify({
        event: 'order.created',
        timestamp: new Date().toISOString(),
        order: {
          id: order.id,
          order_number: order.order_number,
          product_name: order.product_name,
          product_price: order.product_price,
          quantity: order.quantity,
          total_price: order.total_price,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email,
          customer_city: order.customer_city,
          customer_address: order.customer_address,
          payment_method: order.payment_method,
          status: order.status,
          created_at: order.created_at,
        },
      }),
    })
  } catch (err) {
    console.error('[Webhook] Failed to send order webhook:', err)
  }
}
