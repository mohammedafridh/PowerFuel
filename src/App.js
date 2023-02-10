import { Routes, Route } from 'react-router-dom';
import Login from './Pages/AuthenticationPages/Login';
import Register from './Pages/AuthenticationPages/Register';
import './App.css'
import Homepage from './Pages/Homepage';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Orders from './Pages/Orders';
import DeliveriesPage from './Pages/DeliveriesPage';
import FillingStations from './Pages/FillingStations';
import CustomersPage from './Pages/Customers';
import CustomerOrdersPage from './Pages/CustomerOrders';

function App() {
  return (
    <div className='mainPanel'>
      <Toaster />
      <Routes>
        <Route>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/deliveries' element={<DeliveriesPage />} />
          <Route path='/fillingStations' element={<FillingStations />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path='/customers' element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
          <Route path='/customer-orders' element={<ProtectedRoute><CustomerOrdersPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
