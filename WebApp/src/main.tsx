import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SellerHomePage from './Seller/HomePage'
import UserHomePage from './User/Homepage'
import SellerLogin from './Seller/SellerLogin'
import RequireSellerAuth from './Seller/RequireSellerAuth'
import SellerRegister from './Seller/SellerRegister'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/seller"
            element={<RequireSellerAuth child={<SellerHomePage />} />}
          />
          <Route path="/sellerLogin" element={<SellerLogin />} />
          <Route path="/sellerRegister" element={<SellerRegister />} />
          <Route path="/" element={<UserHomePage />} />
        </Routes>
      </BrowserRouter>
  );
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode >
    <App></App>
  </React.StrictMode>,
)
