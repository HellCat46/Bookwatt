import { useEffect, useState } from "react";
import SellerLogin from "./Auth/SellerLogin";
import SellerRegister from "./Auth/SellerRegister";
import HomePage from "./HomePage";
import { AlertPara } from "../shared.types";

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

  // Updates Login State
  function handleLogin() {
    ChangeLogin(true);
  }

  return (
    <>
      {loggedin ? (
        <HomePage ShowAlert={ShowAlert} />
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
