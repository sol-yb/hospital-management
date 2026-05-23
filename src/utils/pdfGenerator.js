const PDFDocument = require('pdfkit');

function generateInvoicePdf(invoice, outputStream) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(outputStream);
  doc.fontSize(20).text('Hospital Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice ID: ${invoice._id}`);
  doc.text(`Patient ID: ${invoice.patient}`);
  doc.text(`Total: ${invoice.total.toFixed(2)}`);
  doc.moveDown();
  invoice.items.forEach((item) => {
    doc.text(`${item.description} - $${item.amount.toFixed(2)} (Tax ${item.taxRate || 0})`);
  });
  doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`);
  doc.text(`Tax: $${invoice.tax.toFixed(2)}`);
  doc.text(`Total: $${invoice.total.toFixed(2)}`);
  doc.end();
}

module.exports = { generateInvoicePdf };
