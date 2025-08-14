import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const BILL_URL = '/admin/billing';
const PRODUCTS_URL = '/admin/products';
const SHOPS_URL = '/admin/shops';

function AdminCreateBill() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(PRODUCTS_URL, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setProducts(productsResponse.data);
        if (productsResponse.data.length > 0) {
          setSelectedProduct(productsResponse.data[0]._id);
        }

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

  const handleAddItem = () => {
    const product = products.find((p) => p._id === selectedProduct);
    if (product && quantity > 0) {
      const newItem = {
        product: product._id,
        name: product.name,
        quantity: quantity,
        price: product.price,
      };
      setBillItems([...billItems, newItem]);
      setTotalAmount(totalAmount + product.price * quantity);
      setQuantity(1);
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

    if (billItems.length === 0) {
      setError('Please add at least one item to the bill.');
      return;
    }

    try {
      await axios.post(
        BILL_URL,
        JSON.stringify({ shopId: selectedShop, items: billItems, totalAmount }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setMessage('Bill created successfully!');
      setBillItems([]);
      setTotalAmount(0);
    } catch (err) {
      setError('Failed to create bill. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading data...</div>;
  }

  if (error && !message) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Create Bill</h3>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Shop</label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-medium text-gray-700">Add Item</h4>
        <div className="mt-2 space-y-2">
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button
            onClick={handleAddItem}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Item
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xl font-medium text-gray-700">Current Bill</h4>
        <ul className="mt-2 divide-y divide-gray-200">
          {billItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center py-2">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => handleRemoveItem(index)} className="text-red-500">Remove</button>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-4 border-t-2 border-gray-200 pt-4">
          <span className="text-lg font-bold">Total:</span>
          <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Finalize Bill
        </button>
      </div>
      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

export default AdminCreateBill;