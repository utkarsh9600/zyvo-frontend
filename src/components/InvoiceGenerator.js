import jsPDF from "jspdf";

export const downloadInvoice = (booking) => {
  const doc = new jsPDF();

  doc.text("ZYVO Rooms Invoice", 20, 20);
  doc.text(`Hotel: ${booking.hotel?.name}`, 20, 40);
  doc.text(`Total: ₹${booking.totalPrice}`, 20, 50);

  doc.save("invoice.pdf");
};