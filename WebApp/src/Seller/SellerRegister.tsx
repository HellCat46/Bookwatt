import { useState } from "react";
import { AlertPara, AlertType } from "./seller.types";
import { ResponseError } from "../share.types";

export default function ({
  handleLoginClick,
  handleRegister,
  ShowAlert,
}: {
  handleLoginClick: (val: boolean) => void;
  handleRegister: () => void;
  ShowAlert: (params: AlertPara) => void;
}) {
  // Takes User Credentials Input
  const [creds, changeCreds] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: "", email: "", password: "" });

  // Submits the Credentials to the Server
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const res = await fetch("http://localhost:5246/seller/register", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          name: creds.name,
          email: creds.email,
          password: creds.password,
        }),
        credentials: "include",
      });
      if (res.status == 200) {
        ShowAlert({
          alertMessage: `Successfully Signed Up!`,
          alertType: AlertType.Success,
        });
        handleRegister();
      } else {
        const err: ResponseError = await res.json();
        ShowAlert({
          alertMessage: `${err.error}: ${err.message}`,
          alertType: AlertType.Error,
        });
      }
    } catch (ex) {
      console.error(ex);
      ShowAlert({
        alertMessage: "Unable to send the request",
        alertType: AlertType.Error,
      });
    }
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" method="post" onSubmit={handleSubmit}>
              <h2 className="card-title">Seller Register</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="name"
                  placeholder="name"
                  className="input input-bordered"
                  onChange={(e) =>
                    changeCreds({ ...creds, name: e.target.value })
                  }
                  required
                />
              </div>
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
                <button className="btn btn-primary">Register</button>
              </div>
            </form>
            <div className="link" onClick={() => handleLoginClick(false)}>
              Login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
