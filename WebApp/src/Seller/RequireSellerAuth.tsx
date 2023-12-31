import { useEffect, useState } from "react";
import SellerLogin from "./SellerLogin";
import SellerRegister from "./SellerRegister";
import { AlertPara } from "./seller.types";

export default function ({ child }: { child: JSX.Element }) {
  const [loggedin, ChangeLogin] = useState(false);
  const [ShowRegister, setShowRegister] = useState(false);
  const [showAlert, setAlertState] = useState<AlertPara | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5246/seller/listBooks", {
          credentials: "include",
        });
        if (res.status == 200) {
          ChangeLogin(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  });

  function handleLogin() {
    ChangeLogin(true);
  }

  function setRegisterState(val: boolean) {
    setShowRegister(val);
  }

  function ShowAlert(params : AlertPara) {
    console.log(params);
    setAlertState(params);
    setTimeout(() => {setAlertState(null)}, 5000)
  }

  let res : JSX.Element;
  if (loggedin) res = child;
  else res = ShowRegister ? (
      <SellerRegister
        handleLoginClick={setRegisterState}
        handleRegister={handleLogin}
        ShowAlert={ShowAlert}
      />
      ) : (
      <SellerLogin
        handleRegisterClick={setRegisterState}
        handleLogin={handleLogin}
        ShowAlert={ShowAlert}
      />
      )
  

  return (
    <>
      {res}
      {showAlert != null ? <Alert alertMessage={showAlert.alertMessage} alertType={showAlert.alertType}/>: <></>}
    </>
  );
}

function Alert(params : AlertPara) {
  return (
    <div id="toast" className="toast toast-center">
      <div className={`alert ${params.alertType}`}>
        <span>{params.alertMessage}</span>
      </div>
    </div>
  );
}
