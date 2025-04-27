import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CarrinhoProvider } from './context/CarrinhoContext.jsx'; // 👈 importa

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CarrinhoProvider> {/* 👈 envolve seu App */}
      <App />
    </CarrinhoProvider>
  </React.StrictMode>,
)
