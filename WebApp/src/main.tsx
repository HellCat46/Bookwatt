import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SellerHomePage from './Seller/HomePage'
import UserHomePage from './User/Homepage'
import RequireSellerAuth from './Seller/RequireSellerAuth'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/seller"
            element={<RequireSellerAuth child={<SellerHomePage />} />}
          />
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
