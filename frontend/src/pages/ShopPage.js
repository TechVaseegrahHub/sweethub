import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShopSidebar from '../components/shop/ShopSidebar';
import ShopDashboard from '../components/shop/dashboard/ShopDashboard';
import ShopCreateBill from '../components/shop/billing/ShopCreateBill';           // Updated name
import ShopViewSalesReports from '../components/shop/billing/ShopViewSalesReports'; // Updated name

function ShopPage() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <ShopSidebar />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="dashboard" element={<ShopDashboard />} />
          <Route path="billing/create" element={<ShopCreateBill />} />           // Updated route
          <Route path="billing/reports" element={<ShopViewSalesReports />} /> // Updated route
        </Routes>
      </div>
    </div>
  );
}

export default ShopPage;