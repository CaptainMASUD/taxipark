// index.js or main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './Redux/Store/Store'; // <-- update path if yours differs

// App routes/components
import Layout from './Components/Layout/Layout';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login/Login';
import AddDriverForm from './Components/Dashboard/add-driver-form';

// Optional: a tiny error boundary element to avoid the default router error UI
function RouteError() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong</h2>
      <p>Try refreshing the page or navigating back.</p>
    </div>
  );
}

// Provide onBack/onSubmit to the form to avoid runtime errors
import { useNavigate } from 'react-router-dom';
function AddDriverRoute() {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    // TODO: replace with your API call
    console.log('Submitting driver:', formData);
    // simulate success
    return Promise.resolve();
  };
  return (
    <AddDriverForm
      onBack={() => navigate(-1)}
      onSubmit={handleSubmit}
    />
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'login', element: <Login /> },
      { path: 'd', element: <AddDriverRoute /> }, // <-- wrapped route
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* RouterProvider must be inside Provider so all routes/components see Redux */}
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
