import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { generateInvoicePdf } from '../../../utils/generateInvoicePdf';

const BILL_URL = '/admin/billing';
const PRODUCTS_URL = '/admin/products';
const SHOPS_URL = '/admin/shops';

function CreateBill() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [customerMobileNumber, setCustomerMobileNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountPaid, setAmountPaid] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [autoDownload, setAutoDownload] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(PRODUCTS_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setProducts(productsResponse.data);

        const shopsResponse = await axios.get(SHOPS_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setShops(shopsResponse.data);
        if (shopsResponse.data.length > 0) {
          setSelectedShop(shopsResponse.data[0]._id);
        }
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  const handleProductSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedProduct(null); // Clear selected product when typing
    setQuantity(0); // Clear quantity when typing
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm(''); // Clear the search term to hide suggestions.
    setSearchResults([]); // Hide search results dropdown
    setQuantity(1); // Set a default quantity
    setError('');
  };

  const handleAddItem = () => {
    if (selectedProduct && quantity > 0) {
      if (selectedProduct.stockLevel < quantity) {
        setError(`Insufficient stock for ${selectedProduct.name}. Available: ${selectedProduct.stockLevel}`);
        return;
      }

      const price = selectedProduct.sellingPrice ?? 0;

      const existingItemIndex = billItems.findIndex(item => item.product === selectedProduct._id);
      let newTotalAmount = totalAmount;

      if (existingItemIndex > -1) {
        const updatedItems = [...billItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        if (selectedProduct.stockLevel < newQuantity) {
          setError(`Cannot add more. Total quantity for ${selectedProduct.name} would exceed available stock.`);
          return;
        }

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        setBillItems(updatedItems);
        newTotalAmount += price * quantity;
      } else {
        const newItem = {
          product: selectedProduct._id,
          name: selectedProduct.name,
          sku: selectedProduct.sku,
          quantity: quantity,
          price: price,
          unit: selectedProduct.unit,
        };
        setBillItems([...billItems, newItem]);
        newTotalAmount += price * quantity;
      }

      setTotalAmount(newTotalAmount);
      setQuantity(0);
      setSelectedProduct(null); // Clear selected product after adding
      setSearchTerm('');
      setError('');
    }
  };

  const handleRemoveItem = (index) => {
    const itemToRemove = billItems[index];
    const newBillItems = billItems.filter((_, i) => i !== index);
    setBillItems(newBillItems);
    setTotalAmount(totalAmount - itemToRemove.price * itemToRemove.quantity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedShop) {
      setError('Please select a shop.');
      return;
    }
    if (!customerMobileNumber || !customerName) {
      setError('Please enter customer details.');
      return;
    }
    if (billItems.length === 0) {
      setError('Please add at least one item to the bill.');
      return;
    }
    if (amountPaid < totalAmount) {
      setError('Amount paid cannot be less than total amount.');
      return;
    }

    try {
      const response = await axios.post(
        BILL_URL,
        JSON.stringify({
          shopId: selectedShop,
          customerMobileNumber,
          customerName,
          items: billItems,
          totalAmount,
          paymentMethod,
          amountPaid,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      setMessage('Bill created successfully!');

      if (autoDownload) {
        const shopInfo = shops.find(s => s._id === selectedShop);
        generateInvoicePdf(response.data, shopInfo);
      }

      setCustomerMobileNumber('');
      setCustomerName('');
      setBillItems([]);
      setTotalAmount(0);
      setAmountPaid(0);
      setSelectedProduct(null);
      setQuantity(0);
      setSearchTerm('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bill. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading data...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Create Bill</h3>

      {/* Customer Details */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h4 className="text-xl font-medium text-gray-700 mb-3">Customer Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNumber">
              Customer Mobile Number
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="mobileNumber"
              value={customerMobileNumber}
              onChange={(e) => setCustomerMobileNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
              Customer Name
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Add Products */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h4 className="text-xl font-medium text-gray-700 mb-3">Add Products</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productSearch">
              Product (Search by name or SKU)
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="productSearch"
              placeholder="Search product..."
              value={selectedProduct ? `${selectedProduct.name} (${selectedProduct.sku})` : searchTerm}
              onChange={handleProductSearchChange}
              onFocus={() => {
                if (!searchTerm && !selectedProduct) {
                  setSearchResults(products);
                }
              }}
            />
            {searchTerm && searchResults.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((product) => (
                  <li
                    key={product._id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    {product.name} ({product.sku}) - {product.stockLevel} {product.unit} available
                  </li>
                ))}
              </ul>
            )}
            {searchTerm && searchResults.length === 0 && (
              <p className="text-sm text-red-500 mt-2">No products found.</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Available</label>
            <p className="py-2 px-3 text-gray-700 bg-gray-200 rounded-lg">
              {selectedProduct ? `${selectedProduct.stockLevel} ${selectedProduct.unit}` : 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
              Quantity
            </label>
            <input
              type="number"
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={!selectedProduct}
            />
          </div>
        </div>
        <button
          onClick={handleAddItem}
          type="button"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={!selectedProduct || quantity <= 0}
        >
          Add Item
        </button>

        {/* Bill Items Table */}
        {billItems.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name} ({item.sku})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.quantity} {item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleRemoveItem(index)} className="text-red-600 hover:text-red-900">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-right text-base font-bold text-gray-900">Total Amount:</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold text-gray-900">₹{totalAmount.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h4 className="text-xl font-medium text-gray-700 mb-3">Payment Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentMethod">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountPaid">
              Amount Paid
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amountPaid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              required
            />
          </div>
        </div>
        <div className="flex justify-end items-center mt-4">
          <span className="text-lg font-bold text-gray-800 mr-4">Balance:</span>
          <span className="text-lg font-bold text-red-600">₹{(totalAmount - amountPaid).toFixed(2)}</span>
        </div>
      </div>

      {/* Bill Options */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
        <label htmlFor="autoDownload" className="text-gray-700 font-bold">Auto Download Bill after Creation</label>
        <input
          type="checkbox"
          id="autoDownload"
          checked={autoDownload}
          onChange={(e) => setAutoDownload(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Bill
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

export default CreateBill;