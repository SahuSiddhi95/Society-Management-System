import React from "react";

const PrintableReceipt = ({ payment }) => {
  if (!payment) return null;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  
  const monthLabel = payment.month && !isNaN(payment.month) 
    ? monthNames[Number(payment.month) - 1] 
    : payment.month;

  return (
    <div className="hidden print:block w-full max-w-4xl mx-auto p-10 bg-white text-gray-900 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black text-indigo-700 tracking-tight uppercase">SocietyOS</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Official Payment Receipt</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800">RECEIPT</h2>
          <p className="text-gray-500 mt-1 font-mono text-sm">
            #{payment.receiptNumber || payment._id?.slice(-8).toUpperCase()}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Date: {formatDate(payment.paymentDate || payment.paidAt)}
          </p>
        </div>
      </div>

      {/* Bill To & Info */}
      <div className="flex justify-between mb-12">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Received From</h3>
          <p className="text-lg font-bold text-gray-900">{payment.resident?.name || "Resident"}</p>
          <p className="text-gray-600">Flat No: <span className="font-semibold text-gray-900">{payment.resident?.flatNo || "—"}</span></p>
          <p className="text-gray-600">{payment.resident?.email}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Details</h3>
          <p className="text-gray-600">Method: <span className="font-semibold text-gray-900">{payment.paymentMethod || "Online"}</span></p>
          <p className="text-gray-600">Status: <span className="font-bold text-emerald-600">Paid</span></p>
        </div>
      </div>

      {/* Table */}
      <table className="w-full mb-12 border-collapse">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            <th className="py-4 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
            <th className="py-4 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Period</th>
            <th className="py-4 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="py-6 px-4">
              <p className="font-bold text-gray-900 text-lg">Society Maintenance Dues</p>
              <p className="text-gray-500 text-sm mt-1">{payment.category || "Maintenance"}</p>
            </td>
            <td className="py-6 px-4 text-center text-gray-700 font-medium">
              {monthLabel} {payment.year}
            </td>
            <td className="py-6 px-4 text-right text-gray-900 font-black text-xl">
              {formatCurrency(payment.amount)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Total Section */}
      <div className="flex justify-end mb-16">
        <div className="w-72 bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="text-gray-900 font-bold">{formatCurrency(payment.amount)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-3">
            <span className="text-lg font-bold text-gray-800">Total Paid</span>
            <span className="text-2xl font-black text-indigo-700">{formatCurrency(payment.amount)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-gray-200">
        <p className="font-bold text-gray-800 text-lg mb-1">Thank you for your payment!</p>
        <p className="text-sm text-gray-500">This is a computer generated receipt and does not require a physical signature.</p>
      </div>
    </div>
  );
};

export default PrintableReceipt;
