import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-white text-gray-800 min-h-screen p-4 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Admin Panel</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2">Department Management</h3>
            <ul className="pl-4">
              <li className="mb-1"><Link to="/admin/departments/create" className="block p-2 rounded hover:bg-gray-200 transition-colors">Create Department</Link></li>
              <li className="mb-1"><Link to="/admin/departments/view" className="block p-2 rounded hover:bg-gray-200 transition-colors">View Departments</Link></li>
            </ul>
          </li>
          <li className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2">Worker Management</h3>
            <ul className="pl-4">
              <li className="mb-1"><Link to="/admin/workers/add" className="block p-2 rounded hover:bg-gray-200 transition-colors">Add Worker</Link></li>
              <li className="mb-1"><Link to="/admin/workers/view" className="block p-2 rounded hover:bg-gray-200 transition-colors">View Workers</Link></li>
              <li className="mb-1"><Link to="/admin/workers/attendance" className="block p-2 rounded hover:bg-gray-200 transition-colors">Attendance Tracking</Link></li>
            </ul>
          </li>
          <li className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2">Product Management</h3>
            <ul className="pl-4">
              <li className="mb-1"><Link to="/admin/products/add" className="block p-2 rounded hover:bg-gray-200 transition-colors">Add Product</Link></li>
              <li className="mb-1"><Link to="/admin/products/view" className="block p-2 rounded hover:bg-gray-200 transition-colors">View Products</Link></li>
            </ul>
          </li>
          <li className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2">Warehouse Management</h3>
            <ul className="pl-4">
              <li className="mb-1"><Link to="/admin/warehouse/stock" className="block p-2 rounded hover:bg-gray-200 transition-colors">Track Stock</Link></li>
              <li className="mb-1"><Link to="/admin/warehouse/alerts" className="block p-2 rounded hover:bg-gray-200 transition-colors">Stock Alerts</Link></li>
            </ul>
          </li>
          <li className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2">Billing</h3>
            <ul className="pl-4">
              <li className="mb-1"><Link to="/admin/billing/create" className="block p-2 rounded hover:bg-gray-200 transition-colors">Create Bill</Link></li>
              <li className="mb-1"><Link to="/admin/billing/view" className="block p-2 rounded hover:bg-gray-200 transition-colors">View Bills</Link></li>
            </ul>
          </li>
          <li className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2">Shop Management</h3>
            <ul className="pl-4">
              <li className="mb-1"><Link to="/admin/shops/add" className="block p-2 rounded hover:bg-gray-200 transition-colors">Add Shop</Link></li>
              <li className="mb-1"><Link to="/admin/shops/view" className="block p-2 rounded hover:bg-gray-200 transition-colors">View Shops</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;