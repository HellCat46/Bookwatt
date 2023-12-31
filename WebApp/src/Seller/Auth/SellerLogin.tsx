import { useState } from "react";
import { AlertPara, AlertType } from "../../shared.types";
import { SellerLogin } from "../../Components/Requests";

export default function ({
  handleRegisterClick,
  handleLogin,
  ShowAlert,
}: {
  handleRegisterClick: (val: boolean) => void;
  handleLogin: () => void;
  ShowAlert: (params: AlertPara) => void;
}) {
  // Takes User Credentials Input
  const [creds, changeCreds] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  // Takes User Credentials Input
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await SellerLogin(creds);
    if (res instanceof Error) {
      ShowAlert({
        alertMessage: res.message,
        alertType: AlertType.Error,
      });
      return;
    }

    ShowAlert({
      alertMessage: "Successfully Logged In!!",
      alertType: AlertType.Success,
    });
    handleLogin();
    return;
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" method="post" onSubmit={handleSubmit}>
              <h2 className="card-title">Seller Login</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  onChange={(e) =>
                    changeCreds({ ...creds, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  onChange={(e) =>
                    changeCreds({ ...creds, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
              </div>
            </form>
            <div className="link" onClick={() => handleRegisterClick(true)}>
              Register
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
