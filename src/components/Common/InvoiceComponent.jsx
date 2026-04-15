import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoicePage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/orders/${id}/invoice`);
        setInvoice(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch invoice');
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleGeneratePDF = async () => {
    if (!invoiceRef.current) return;
    
    try {
      setGeneratingPdf(true);
      const invoiceElement = invoiceRef.current;
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      
      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight;
      
      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
      setGeneratingPdf(false);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setGeneratingPdf(false);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col justify-center items-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lv-gold mb-4"></div>
      <p className="text-gray-700 font-medium text-lg">Loading invoice...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-red-100 p-4 rounded-lg flex items-center gap-3">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    </div>
  );

  if (!invoice) return (
    <div className="max-w-7xl mx-auto p-6 text-center">
      <p className="text-gray-600">No invoice found</p>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const subtotal = invoice.items.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* PDF Generation Overlay */}
      {generatingPdf && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-lv-gold mb-3"></div>
            <p className="text-gray-700 font-medium">Generating PDF...</p>
            <p className="text-gray-500 text-sm mt-1">Please wait, this may take a moment</p>
          </div>
        </div>
      )}
      
      <div className="print:hidden mb-8 flex justify-between items-center">
        <Link to={`/order/${id}`} className="text-lv-gold hover:underline font-medium">
          &larr; Back to Order
        </Link>
        <button
          onClick={handleGeneratePDF}
          disabled={generatingPdf}
          className="bg-lv-dark hover:bg-lv-dark/90 text-white py-2 px-4 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Invoice Content */}
      <div 
        ref={invoiceRef} 
        className="bg-white shadow-lg border border-gray-200 p-8"
      >
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-6 border-b border-gray-300 pb-4">
          <div>
            <h1 className="text-2xl  text-gray-900">INVOICE</h1>
            <p className="text-gray-600 text-lg">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-gray-900 mb-1">LOUIS VEIL</div>
            <div className="text-sm text-gray-600">
              <p>123 Louis Veil Skyscraper</p>
              <p>Dapoli, Maharashtra 415712</p>
              <p>meritees@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Bill To</h2>
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-800">{invoice.customer.name}</p>
              <p>{invoice.customer.email}</p>
              {invoice.shippingAddress && (
                <>
                  <p>{invoice.shippingAddress.address}</p>
                  <p>{invoice.shippingAddress.city}, {invoice.shippingAddress.postalCode}</p>
                  <p>{invoice.shippingAddress.country}</p>
                  <p>Phone: {invoice.shippingAddress.phone}</p>
                </>
              )}
            </div>
          </div>
          <div className="bg-gray-50 p-4 shadow-sm text-right">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Invoice Details</h2>
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Invoice Date:</span>
                <span>{formatDate(invoice.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span>#{invoice.orderId.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Status:</span>
                <span className={invoice.isPaid ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {invoice.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              {invoice.isPaid && (
                <div className="flex justify-between">
                  <span className="font-medium">Paid Date:</span>
                  <span>{formatDate(invoice.paidAt)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>{invoice.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-lv-dark">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-lv-cream uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-lv-cream uppercase tracking-wider">
                    Qty
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-lv-cream uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-lv-cream uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 hidden sm:block">
                          <img className="h-10 w-10 object-cover rounded-md" src={item.image} alt={item.name} />
                        </div>
                        <div className="ml-0 sm:ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.size && item.color && (
                            <div className="text-xs text-gray-500">
                              Size: {item.size}, Color: {item.color}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ₹{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="flex justify-end mb-6">
          <div className="w-full sm:w-72">
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                <span className="font-medium text-gray-900">Total:</span>
                <span className="font-bold text-gray-900">₹{invoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t border-gray-200 pt-6 text-sm text-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
          <p>Thank you for shopping with us! If you have any questions or need support, please contact our customer service team.</p>
         
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
