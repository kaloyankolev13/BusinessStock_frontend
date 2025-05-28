import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import PlaceholderPage from './components/ui/PlaceholderPage';

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
              <Route path="inventory/items" element={<Inventory />} />
              
              {/* Placeholder routes - to be implemented */}
              <Route path="inventory/categories" element={<PlaceholderPage title="Categories page" />} />
              <Route path="inventory/suppliers" element={<PlaceholderPage title="Suppliers page" />} />
              <Route path="sales/*" element={<PlaceholderPage title="Sales module" />} />
              <Route path="purchasing/*" element={<PlaceholderPage title="Purchasing module" />} />
              <Route path="company/*" element={<PlaceholderPage title="Company module" />} />
              <Route path="settings" element={<PlaceholderPage title="Settings page" />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<PlaceholderPage title="Page not found" />} />
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
