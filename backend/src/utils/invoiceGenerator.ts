import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { InvoiceDetails } from '../types';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INVOICES_DIR = path.join(__dirname, '../../invoices');
if (!fs.existsSync(INVOICES_DIR)) {
  fs.mkdirSync(INVOICES_DIR);
}

/**
 * Generates a PDF invoice (client or audit).
 */
export const generateInvoice = (details: InvoiceDetails): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filename = `${details.orderId}_${details.type}_${Date.now()}.pdf`;
    const filePath = path.join(INVOICES_DIR, filename);

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc
      .fontSize(25)
      .text('Mvs_Aqua - The Aquatic Habitat', { align: 'center' })
      .moveDown();

    doc
      .fontSize(10)
      .text('Specialty Catalog for Aquatic Life', { align: 'center' })
      .moveDown(2);

    // Invoice Title
    doc
      .fontSize(20)
      .text(`${details.type === 'CLIENT' ? 'INVOICE' : 'AUDIT RECORD'}`, { align: 'center' })
      .moveDown(1.5);

    // Invoice Details
    doc.fontSize(12)
      .text(`Invoice ID: ${details.orderId}`, { align: 'left' })
      .text(`Date: ${details.invoiceDate.toLocaleDateString()}`, { align: 'left' })
      .moveDown();

    doc.text(`Customer Name: ${details.customerName}`)
      .text(`Shipping Address: ${details.customerAddress.addressLine1}, ${details.customerAddress.city}, ${details.customerAddress.state} - ${details.customerAddress.zipCode}`)
      .text(`Phone: ${details.customerAddress.phoneNumber}`)
      .moveDown();

    // Line Items Table Header
    doc.fontSize(12)
      .font('Helvetica-Bold')
      .text('Item', 50, doc.y, { width: 200, continued: true })
      .text('Quantity', 250, doc.y, { width: 100, continued: true })
      .text('Unit Price', 350, doc.y, { width: 100, continued: true })
      .text('Total', 450, doc.y, { width: 100 })
      .moveDown(0.5);

    doc.font('Helvetica');

    // Line Items
    details.items.forEach(item => {
      doc
        .text(item.name, 50, doc.y, { width: 200, continued: true })
        .text(item.quantity.toString(), 250, doc.y, { width: 100, continued: true })
        .text(`₹${item.price.toFixed(2)}`, 350, doc.y, { width: 100, continued: true })
        .text(`₹${(item.quantity * item.price).toFixed(2)}`, 450, doc.y, { width: 100 })
        .moveDown(0.2);
    });

    // Separator line
    doc.strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
      .moveDown();

    // Total Amount
    doc.fontSize(14)
      .font('Helvetica-Bold')
      .text(`GRAND TOTAL: ₹${details.totalAmount.toFixed(2)}`, { align: 'right' })
      .moveDown();

    if (details.type === 'AUDIT') {
      doc.fontSize(10)
        .font('Helvetica')
        .text(`Order Confirmed By: ${details.confirmationName}`, { align: 'right' })
        .text(`Generated On: ${new Date().toLocaleString()}`, { align: 'right' })
        .moveDown();
    } else {
        doc.fontSize(10)
        .text('Thank you for your business!', 50, doc.y, { align: 'left' })
        .moveDown();
    }


    doc.end();

    doc.on('data', () => { /* Prevent memory leak warnings in some environments */ });
    doc.on('end', () => resolve(`/invoices/${filename}`));
    doc.on('error', (err) => reject(err));
  });
};