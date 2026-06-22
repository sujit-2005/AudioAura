import { BrowserRouter } from 'react-router-dom';

import SiteHeader from './components/layout/SiteHeader';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <div className="app-frame">
          <SiteHeader />
          <AppRoutes />
        </div>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
