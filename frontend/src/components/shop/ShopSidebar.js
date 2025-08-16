import React from 'react';
import { Link } from 'react-router-dom';

function ShopSidebar() {
  return (
    <div className="w-64 bg-white text-gray-800 min-h-screen p-4 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Shop Panel</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2">Dashboard</h3>
            <ul className="pl-4">
              <li className="mb-1"><Link to="/shop/dashboard" className="block p-2 rounded hover:bg-gray-200 transition-colors">Overview</Link></li>
            </ul>
          </li>
          <li className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2">Billing</h3>
            <ul className="pl-4">
              <li className="mb-1"><Link to="/shop/billing/create" className="block p-2 rounded hover:bg-gray-200 transition-colors">Create Bill</Link></li>
              <li className="mb-1"><Link to="/shop/billing/reports" className="block p-2 rounded hover:bg-gray-200 transition-colors">View Sales Reports</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ShopSidebar;