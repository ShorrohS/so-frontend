// Digital GST Tax Invoice & Receipt Generator Utility for Salon Organics Sanctuary

export function generateInvoicePDF(booking) {
  if (!booking) return

  const refId = booking.referenceId || `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`
  const invoiceNo = `INV-2026-${refId.split('-').pop() || Math.floor(1000 + Math.random() * 9000)}`
  const dateStr = booking.bookingDate || new Date().toISOString().split('T')[0]
  const timeStr = booking.bookingTime || '11:30 AM'
  const username = booking.username || 'Valued Client'
  const stylist = booking.stylistName || 'Master Artisan'
  const services = Array.isArray(booking.services) ? booking.services : [
    { name: 'Classic Precision Cut', price: 75, category: 'For Him' }
  ]

  const totalAmount = parseFloat(booking.totalAmount) || services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0)
  
  // Calculate 18% GST Breakdown (Base = Total / 1.18)
  const baseAmount = Math.round((totalAmount / 1.18) * 100) / 100
  const gstTotal = Math.round((totalAmount - baseAmount) * 100) / 100
  const cgst = Math.round((gstTotal / 2) * 100) / 100
  const sgst = Math.round((gstTotal - cgst) * 100) / 100

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tax Invoice - ${invoiceNo}</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-[#042C1D];
          background-color: #F9F7F2;
          color: #042C1D;
          margin: 0;
          padding: 20px;
        }
        .invoice-card {
          max-width: 680px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #D4AF37;
          border-radius: 16px;
          padding: 36px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-b: 2px solid #D4AF37;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .brand-title {
          font-size: 24px;
          font-weight: bold;
          color: #042C1D;
          letter-spacing: 2px;
          margin: 0;
        }
        .brand-sub {
          font-size: 11px;
          color: #D4AF37;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-top: 4px;
          font-weight: bold;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-badge {
          background: #042C1D;
          color: #D4AF37;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 6px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          background: #FAF6F0;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          margin-bottom: 24px;
          font-size: 12px;
        }
        .info-label {
          color: #666;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: bold;
          margin-bottom: 2px;
        }
        .info-val {
          font-weight: bold;
          color: #042C1D;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 13px;
        }
        th {
          background: #042C1D;
          color: #FAF6F0;
          text-align: left;
          padding: 10px 14px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        td {
          padding: 12px 14px;
          border-bottom: 1px solid #EEE;
        }
        .summary-box {
          margin-left: auto;
          width: 260px;
          background: #FAF6F0;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #D4AF37;
          font-size: 12px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
        }
        .summary-total {
          border-top: 2px solid #042C1D;
          margin-top: 8px;
          padding-top: 8px;
          font-weight: bold;
          font-size: 15px;
          color: #042C1D;
        }
        .footer {
          text-align: center;
          margin-top: 36px;
          padding-top: 20px;
          border-top: 1px solid #EEE;
          font-size: 11px;
          color: #777;
        }
        @media print {
          body { background: white; padding: 0; }
          .invoice-card { border: none; box-shadow: none; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <div class="header">
          <div>
            <h1 class="brand-title">SALON ORGANICS</h1>
            <div class="brand-sub">Botanical Luxury Sanctuary</div>
            <div style="font-size: 10px; color: #666; margin-top: 6px;">
              GSTIN: 27AAAAA0000A1Z5 • Mumbai Sanctuary Atelier
            </div>
          </div>
          <div class="invoice-title">
            <div class="invoice-badge">TAX INVOICE</div>
            <div style="font-size: 13px; font-weight: bold; color: #042C1D;">${invoiceNo}</div>
            <div style="font-size: 11px; color: #666;">Date: ${dateStr}</div>
          </div>
        </div>

        <div class="info-grid">
          <div>
            <div class="info-label">Customer Client</div>
            <div class="info-val">${username}</div>
            <div class="info-label" style="margin-top: 8px;">Reservation Reference</div>
            <div class="info-val">${refId}</div>
          </div>
          <div>
            <div class="info-label">Appointment Time</div>
            <div class="info-val">${dateStr} at ${timeStr}</div>
            <div class="info-label" style="margin-top: 8px;">Assigned Artisan</div>
            <div class="info-val">${stylist}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Ritual</th>
              <th>Category</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${services.map((srv, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${srv.name}</strong></td>
                <td>${srv.category || 'Organic Care'}</td>
                <td style="text-align: right; font-weight: bold;">₹${srv.price || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary-box">
          <div class="summary-row">
            <span>Taxable Subtotal:</span>
            <span>₹${baseAmount.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>CGST (9%):</span>
            <span>₹${cgst.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>SGST (9%):</span>
            <span>₹${sgst.toFixed(2)}</span>
          </div>
          <div class="summary-row summary-total">
            <span>Grand Total Paid:</span>
            <span>₹${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          Thank you for indulging in Salon Organics Botanical Sanctuary.<br>
          This is a computer-generated tax invoice receipt requiring no signature.
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `

  const win = window.open('', '_blank', 'width=800,height=900')
  if (win) {
    win.document.write(htmlContent)
    win.document.close()
  }
}
