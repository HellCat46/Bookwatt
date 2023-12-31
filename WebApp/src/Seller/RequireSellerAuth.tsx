import { useEffect, useState } from "react";
import SellerLogin from "./SellerLogin";
import SellerRegister from "./SellerRegister";
import HomePage from "./HomePage";
import { AlertPara } from "../shared.types";

export default function ({ShowAlert} : {ShowAlert : (params : AlertPara) => void}) {
  const [loggedin, ChangeLogin] = useState(false);
  const [ShowRegister, setShowRegister] = useState(false);

  // Checks if User is logged in or not
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

  // Renders Register Component
  function setRegisterState(val: boolean) {
    setShowRegister(val);
  }


  let res : JSX.Element;
  if (loggedin) res = (<HomePage ShowAlert={ShowAlert}/>);
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
    </>
  );
}
