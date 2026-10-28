// VSkin Order Confirmation Email Template

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  orderNumber: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export function generateOrderConfirmationEmail(orderDetails: OrderDetails): string {
  const { orderNumber, items, total, customerName, address, city, postalCode, country } = orderDetails;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #F5EFE7;">
        <div style="font-family: 'DM Sans', sans-serif; color: #4A3728; font-size: 15px;">
          ${item.name}
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #F5EFE7; text-align: center;">
        <div style="font-family: 'DM Sans', sans-serif; color: #4A3728; font-size: 15px;">
          ${item.quantity}
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #F5EFE7; text-align: right;">
        <div style="font-family: 'DM Sans', sans-serif; color: #4A3728; font-size: 15px;">
          €${item.price.toFixed(2)}
        </div>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - VSkin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'DM Sans', sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FAF7F2;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(74, 55, 40, 0.08);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #FAF7F2 0%, #F5EFE7 100%); padding: 40px; text-align: center; border-bottom: 2px solid rgba(184, 153, 104, 0.3);">
              <img src="https://bgsmbgofghygwbuevxpo.supabase.co/storage/v1/object/public/images/VSkin%20logo%20black.png" alt="VSkin" style="height: 50px; margin-bottom: 20px;">
              <h1 style="font-family: 'Playfair Display', serif; font-size: 32px; color: #4A3728; margin: 0; font-weight: 600;">
                Thank You for Your Order
              </h1>
            </td>
          </tr>

          <!-- Thank You Message -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <p style="font-family: 'DM Sans', sans-serif; font-size: 16px; line-height: 1.7; color: #4A3728; margin: 0 0 20px 0;">
                Dear ${customerName},
              </p>
              <p style="font-family: 'DM Sans', sans-serif; font-size: 16px; line-height: 1.7; color: #4A3728; margin: 0 0 20px 0;">
                We're delighted to confirm your order. Your journey to radiant, confident skin begins now. Each VSkin product is crafted with care, using premium natural ingredients to reveal your skin's natural beauty.
              </p>
              <p style="font-family: 'DM Sans', sans-serif; font-size: 16px; line-height: 1.7; color: #4A3728; margin: 0;">
                Your order number is: <strong style="color: #B89968;">#${orderNumber}</strong>
              </p>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; color: #4A3728; margin: 0 0 20px 0; font-weight: 600;">
                Order Summary
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 2px solid #B89968;">
                <thead>
                  <tr>
                    <th style="padding: 12px 0; text-align: left; border-bottom: 1px solid #F5EFE7;">
                      <div style="font-family: 'DM Sans', sans-serif; color: #B89968; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                        Product
                      </div>
                    </th>
                    <th style="padding: 12px 0; text-align: center; border-bottom: 1px solid #F5EFE7;">
                      <div style="font-family: 'DM Sans', sans-serif; color: #B89968; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                        Qty
                      </div>
                    </th>
                    <th style="padding: 12px 0; text-align: right; border-bottom: 1px solid #F5EFE7;">
                      <div style="font-family: 'DM Sans', sans-serif; color: #B89968; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                        Price
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Total -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px; background: linear-gradient(135deg, #FAF7F2 0%, #F5EFE7 100%); border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="text-align: left;">
                    <div style="font-family: 'Playfair Display', serif; font-size: 20px; color: #4A3728; font-weight: 600;">
                      Total Paid
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <div style="font-family: 'Playfair Display', serif; font-size: 24px; color: #B89968; font-weight: 700;">
                      €${total.toFixed(2)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Details -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; color: #4A3728; margin: 0 0 20px 0; font-weight: 600;">
                Shipping Details
              </h2>
              <div style="background-color: #FAF7F2; border-radius: 8px; padding: 20px; border-left: 3px solid #B89968;">
                <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; color: #4A3728; margin: 0 0 8px 0;">
                  <strong>${customerName}</strong>
                </p>
                <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; color: #4A3728; margin: 0 0 4px 0;">
                  ${address}
                </p>
                <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; color: #4A3728; margin: 0;">
                  ${city}, ${postalCode}, ${country}
                </p>
              </div>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; color: #4A3728; margin: 0 0 15px 0; font-weight: 600;">
                What's Next?
              </h2>
              <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; color: #4A3728; margin: 0 0 12px 0;">
                ✓ We're preparing your order with care
              </p>
              <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; color: #4A3728; margin: 0 0 12px 0;">
                ✓ You'll receive a shipping confirmation with tracking details
              </p>
              <p style="font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; color: #4A3728; margin: 0;">
                ✓ Your VSkin products will arrive within 5-7 business days
              </p>
            </td>
          </tr>

          <!-- Closing Message -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="background: linear-gradient(135deg, #B89968 0%, #A68958 100%); border-radius: 8px; padding: 25px; text-align: center;">
                <p style="font-family: 'Playfair Display', serif; font-size: 18px; line-height: 1.6; color: #FFFFFF; margin: 0 0 10px 0; font-style: italic;">
                  "Confidence looks good on you"
                </p>
                <p style="font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.6; color: #FFFFFF; margin: 0;">
                  Thank you for choosing VSkin. We're honored to be part of your skincare journey.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 30px 40px; border-top: 2px solid rgba(184, 153, 104, 0.3);">
              <p style="font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.6; color: #6B5D52; margin: 0 0 10px 0; text-align: center;">
                Questions? Contact us at <a href="mailto:info@byvskin.com" style="color: #B89968; text-decoration: none;">info@byvskin.com</a>
              </p>
              <p style="font-family: 'DM Sans', sans-serif; font-size: 12px; line-height: 1.6; color: #6B5D52; margin: 0; text-align: center;">
                VSkin | J. Kazlausko g. 6, LT-08314 Vilnius, Lithuania
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
