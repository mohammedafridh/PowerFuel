import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import { UserAuthContextProvider } from './Context/Context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <UserAuthContextProvider>
      <React.StrictMode>
        <BrowserRouter><App /></BrowserRouter>
      </React.StrictMode>
  </UserAuthContextProvider>

  
);

