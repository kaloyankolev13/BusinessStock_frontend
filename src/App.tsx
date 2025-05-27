import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Main app routes */}
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Inventory routes */}
              <Route path="inventory/items" element={<div className="p-8 text-center text-gray-500">Items page coming soon...</div>} />
              <Route path="inventory/categories" element={<div className="p-8 text-center text-gray-500">Categories page coming soon...</div>} />
              <Route path="inventory/suppliers" element={<div className="p-8 text-center text-gray-500">Suppliers page coming soon...</div>} />
              
              {/* Sales routes */}
              <Route path="sales/invoices" element={<div className="p-8 text-center text-gray-500">Invoices page coming soon...</div>} />
              <Route path="sales/clients" element={<div className="p-8 text-center text-gray-500">Clients page coming soon...</div>} />
              
              {/* Purchasing routes */}
              <Route path="purchasing/orders" element={<div className="p-8 text-center text-gray-500">Purchase Orders page coming soon...</div>} />
              <Route path="purchasing/suppliers" element={<div className="p-8 text-center text-gray-500">Purchasing Suppliers page coming soon...</div>} />
              
              {/* Company routes */}
              <Route path="company/settings" element={<div className="p-8 text-center text-gray-500">Company Settings page coming soon...</div>} />
              <Route path="company/users" element={<div className="p-8 text-center text-gray-500">Users page coming soon...</div>} />
              
              {/* Settings */}
              <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings page coming soon...</div>} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<div className="p-8 text-center text-gray-500">Page not found</div>} />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
