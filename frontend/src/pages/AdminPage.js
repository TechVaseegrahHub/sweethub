import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import CreateDepartment from '../components/admin/department/CreateDepartment';
import ViewDepartments from '../components/admin/department/ViewDepartments';
import AddWorker from '../components/admin/worker/AddWorker';
import ViewWorkers from '../components/admin/worker/ViewWorkers';
import AttendanceTracking from '../components/admin/worker/AttendanceTracking';
import AddProduct from '../components/admin/product/AddProduct';
import ViewProducts from '../components/admin/product/ViewProducts';
import TrackStock from '../components/admin/warehouse/TrackStock';
import StockAlerts from '../components/admin/warehouse/StockAlerts';
import AdminCreateBill from '../components/admin/billing/AdminCreateBill'; // Updated name
import AdminViewBills from '../components/admin/billing/AdminViewBills';   // Updated name
import AddShop from '../components/admin/shop/AddShop';
import ViewShops from '../components/admin/shop/ViewShops';


function AdminPage() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="departments/create" element={<CreateDepartment />} />
          <Route path="departments/view" element={<ViewDepartments />} />
          <Route path="workers/add" element={<AddWorker />} />
          <Route path="workers/view" element={<ViewWorkers />} />
          <Route path="workers/attendance" element={<AttendanceTracking />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/view" element={<ViewProducts />} />
          <Route path="warehouse/stock" element={<TrackStock />} />
          <Route path="warehouse/alerts" element={<StockAlerts />} />
          <Route path="billing/create" element={<AdminCreateBill />} /> // Updated route
          <Route path="billing/view" element={<AdminViewBills />} />   // Updated route
          <Route path="shops/add" element={<AddShop />} />
          <Route path="shops/view" element={<ViewShops />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminPage;