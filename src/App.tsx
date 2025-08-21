import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  const location = useLocation();
  
  // Hide navbar and footer on auth pages for cleaner look
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <AppRoutes />
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;