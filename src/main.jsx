// index.js or main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login/Login';
import AddDriverForm from './Components/Dashboard/add-driver-form';



const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Dashboard  /> },
      { path: 'login', element: <Login  /> },
      { path: 'd', element: <AddDriverForm  /> },
     
  
      
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
         {/* RouterProvider ensures routing works with the configured router */}
         <RouterProvider router={router} />
      
   </React.StrictMode>
);
