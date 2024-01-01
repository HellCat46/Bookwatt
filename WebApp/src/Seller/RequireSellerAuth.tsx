import { useEffect, useState } from "react";
import SellerLogin from "./Auth/SellerLogin";
import SellerRegister from "./Auth/SellerRegister";
import HomePage from "./HomePage";
import { AlertPara, AlertType } from "../shared.types";
import { SellerLogout } from "../Components/Requests";

export default function ({ShowAlert} : {ShowAlert : (params : AlertPara) => void}) {
  const [loggedin, ChangeLogin] = useState(false);
  const [ShowRegister, setShowRegister] = useState(false);

  // Checks if Seller is logged in or not
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

  // Set Login State to true
  function handleLogin() {
    ChangeLogin(true);
  }

  // Logs user out of the Seller Account
  async function Logout() {
    const res = await SellerLogout();
    if (res instanceof Error) {
      ShowAlert({ alertMessage: res.message, alertType: AlertType.Error });
      return;
    }

    ShowAlert({
      alertMessage: "Successfully Logged Out",
      alertType: AlertType.Info,
    });
    ChangeLogin(false);
  }

  return (
    <>
      {loggedin ? (
        <HomePage ShowAlert={ShowAlert} Logout={Logout}/>
      ) : ShowRegister ? (
        <SellerRegister
          handleLoginClick={setShowRegister}
          handleRegister={handleLogin}
          ShowAlert={ShowAlert}
        />
      ) : (
        <SellerLogin
          handleRegisterClick={setShowRegister}
          handleLogin={handleLogin}
          ShowAlert={ShowAlert}
        />
      )}
    </>
  );
}
