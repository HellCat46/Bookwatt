import { useEffect, useState } from "react";
import { AlertPara } from "../shared.types";
import Homepage from "./Homepage";
import Register from "./Auth/Register";
import Login from "./Auth/Login";

export default function RequireUserAuth({
  ShowAlert,
}: {
  ShowAlert: (params: AlertPara) => void;
}) {
  const [loggedin, ChangeLogin] = useState(false);
  const [ShowRegister, setShowRegister] = useState(false);

  // Checks if User is logged in or not
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5246/user/listPurchasedBooks",
          {
            credentials: "include",
          }
        );
        if (res.status == 200) {
          ChangeLogin(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  });

  function setLoginState(){
    ChangeLogin(true);
  }
  return (loggedin ? (
    <Homepage  ShowAlert={ShowAlert}/>
  ) : ShowRegister ? (
    <Register handleLoginClick={setShowRegister} handleRegister={setLoginState} ShowAlert={ShowAlert}/>
  ) : (
    <Login handleRegisterClick={setShowRegister} handleLogin={setLoginState} ShowAlert={ShowAlert}/>
  )
    
  );
}
