import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { PlansProvider } from './context/PlansContext'
import { RecommendationProvider } from './context/RecommendationContext'
import App from './App'
import './styles.css'
import { queryClient } from './services/queryClient'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProductProvider>
            <RecommendationProvider>
              <PlansProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </PlansProvider>
            </RecommendationProvider>
          </ProductProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
