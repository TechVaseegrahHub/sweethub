import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [openMenu, setOpenMenu] = useState({});

  const toggleMenu = (menuName) => {
    setOpenMenu(prevState => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center">Admin Panel</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <div
              className="flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => toggleMenu('department')}
            >
              <h3 className="text-lg font-semibold">Department Management</h3>
              <span>{openMenu.department ? '▲' : '▼'}</span>
            </div>
            {openMenu.department && (
              <ul className="pl-4 mt-2">
                <li className="mb-1"><Link to="/admin/departments/create" className="block p-2 rounded hover:bg-gray-700 transition-colors">Create Department</Link></li>
                <li className="mb-1"><Link to="/admin/departments/view" className="block p-2 rounded hover:bg-gray-700 transition-colors">View Departments</Link></li>
              </ul>
            )}
          </li>
          <li className="mb-2">
            <div
              className="flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => toggleMenu('worker')}
            >
              <h3 className="text-lg font-semibold">Worker Management</h3>
              <span>{openMenu.worker ? '▲' : '▼'}</span>
            </div>
            {openMenu.worker && (
              <ul className="pl-4 mt-2">
                <li className="mb-1"><Link to="/admin/workers/add" className="block p-2 rounded hover:bg-gray-700 transition-colors">Add Worker</Link></li>
                <li className="mb-1"><Link to="/admin/workers/view" className="block p-2 rounded hover:bg-gray-700 transition-colors">View Workers</Link></li>
                <li className="mb-1"><Link to="/admin/workers/attendance" className="block p-2 rounded hover:bg-gray-700 transition-colors">Attendance Tracking</Link></li>
              </ul>
            )}
          </li>
          <li className="mb-2">
            <div
              className="flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => toggleMenu('product')}
            >
              <h3 className="text-lg font-semibold">Product Management</h3>
              <span>{openMenu.product ? '▲' : '▼'}</span>
            </div>
            {openMenu.product && (
              <ul className="pl-4 mt-2">
                <li className="mb-1"><Link to="/admin/products/add" className="block p-2 rounded hover:bg-gray-700 transition-colors">Add Product</Link></li>
                <li className="mb-1"><Link to="/admin/products/category" className="block p-2 rounded hover:bg-gray-700 transition-colors">Add Category</Link></li>
                <li className="mb-1"><Link to="/admin/products/view" className="block p-2 rounded hover:bg-gray-700 transition-colors">View Products</Link></li>
              </ul>
            )}
          </li>
          <li className="mb-2">
            <div
              className="flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => toggleMenu('warehouse')}
            >
              <h3 className="text-lg font-semibold">Warehouse Management</h3>
              <span>{openMenu.warehouse ? '▲' : '▼'}</span>
            </div>
            {openMenu.warehouse && (
              <ul className="pl-4 mt-2">
                <li className="mb-1"><Link to="/admin/warehouse/stock" className="block p-2 rounded hover:bg-gray-700 transition-colors">Track Stock</Link></li>
                <li className="mb-1"><Link to="/admin/warehouse/alerts" className="block p-2 rounded hover:bg-gray-700 transition-colors">Stock Alerts</Link></li>
              </ul>
            )}
          </li>
          <li className="mb-2">
            <div
              className="flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => toggleMenu('billing')}
            >
              <h3 className="text-lg font-semibold">Billing</h3>
              <span>{openMenu.billing ? '▲' : '▼'}</span>
            </div>
            {openMenu.billing && (
              <ul className="pl-4 mt-2">
                <li className="mb-1"><Link to="/admin/billing/create" className="block p-2 rounded hover:bg-gray-700 transition-colors">Create Bill</Link></li>
                <li className="mb-1"><Link to="/admin/billing/view" className="block p-2 rounded hover:bg-gray-700 transition-colors">View Bills</Link></li>
              </ul>
            )}
          </li>
          <li className="mb-2">
            <div
              className="flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => toggleMenu('shop')}
            >
              <h3 className="text-lg font-semibold">Shop Management</h3>
              <span>{openMenu.shop ? '▲' : '▼'}</span>
            </div>
            {openMenu.shop && (
              <ul className="pl-4 mt-2">
                <li className="mb-1"><Link to="/admin/shops/add" className="block p-2 rounded hover:bg-gray-700 transition-colors">Add Shop</Link></li>
                <li className="mb-1"><Link to="/admin/shops/view" className="block p-2 rounded hover:bg-gray-700 transition-colors">View Shops</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;