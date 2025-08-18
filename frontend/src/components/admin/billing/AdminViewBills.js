import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { generateInvoicePdf } from '../../../utils/generateInvoicePdf';

const BILLS_URL = '/admin/billing';

function AdminViewBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(BILLS_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setBills(response.data);
      } catch (err) {
        setError('Failed to fetch bills.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);


  const generateInvoice = (bill) => {
    // The shop info is already populated in the bill object from the backend
    generateInvoicePdf(bill, bill.shop);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading bills...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">View Bills</h3>
      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Purchased</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill._id.slice(-8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{bill.customerName}</div>
                    <div>{bill.customerMobileNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.items.map(item => (
                    <div key={item._id}>{item.product ? item.product.name : '[Deleted Product]'} (x{item.quantity})</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{bill.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.billDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => generateInvoice(bill)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Generate Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminViewBills;