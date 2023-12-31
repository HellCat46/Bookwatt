import './index.css'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserHomePage from './User/Homepage'
import RequireSellerAuth from './Seller/RequireSellerAuth'
import { AlertPara } from './shared.types'

function App() {

  const [showAlert, setAlertState] = useState<AlertPara | null>(null);
    // Shows Alerts on Bottom Middle part of screen
  function ShowAlert(params : AlertPara) {
    console.log(params);
    setAlertState(params);
    setTimeout(() => {setAlertState(null)}, 5000)
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/seller" element={<RequireSellerAuth ShowAlert={ShowAlert}/>} />
          <Route path="/" element={<UserHomePage />} />
        </Routes>
      </BrowserRouter>
      {showAlert != null ? (
        <Alert
          alertMessage={showAlert.alertMessage}
          alertType={showAlert.alertType}
        />
      ) : (
        <></>
      )}
    </>
  );
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode >
    <App></App>
  </React.StrictMode>,
)



function Alert(params : AlertPara) {
  return (
    <div id="toast" className="toast toast-center">
      <div className={`alert ${params.alertType}`}>
        <span>{params.alertMessage}</span>
      </div>
    </div>
  );
}
