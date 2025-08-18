import html2pdf from 'html2pdf.js';

export const generateInvoicePdf = (billData, shopInfo) => {
  const shopName = shopInfo?.name || 'The Sweet Hub';
  const shopLocation = shopInfo?.location || '156, Dubai Main Road, Thanjavur, Tamil Nadu - 613006';
  const shopPhone = '7339200636';

  const itemsHtml = billData.items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.product.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const balance = billData.totalAmount - billData.amountPaid;

  const invoiceHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #333;">${shopName}</h2>
        <p style="color: #666; font-size: 14px;">${shopLocation}</p>
        <p style="color: #666; font-size: 14px;">Phone: ${shopPhone}</p>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <div>
          <p><strong>Bill No:</strong> ${billData._id.substring(0, 8)}</p>
          <p><strong>Date:</strong> ${new Date(billData.billDate).toLocaleDateString()}</p>
        </div>
        <div style="text-align: right;">
          <p><strong>Customer:</strong> ${billData.customerName}</p>
          <p><strong>Phone:</strong> ${billData.customerMobileNumber}</p>
        </div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Grand Total</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₹${billData.totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <div>
          <p><strong>Total Quantity:</strong> ${billData.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
          <p><strong>Payment Method:</strong> ${billData.paymentMethod}</p>
        </div>
        <div style="text-align: right;">
          <p><strong>Amount Paid:</strong> ₹${billData.amountPaid.toFixed(2)}</p>
          <p><strong>Balance:</strong> ₹${balance.toFixed(2)}</p>
        </div>
      </div>
      <p style="text-align: center; margin-top: 30px; font-style: italic; color: #777;">We value your trust in choosing our products!</p>
    </div>
  `;

  const opt = {
    margin: 10,
    filename: `bill_${billData._id.substring(0, 8)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().from(invoiceHtml).set(opt).save();
};