import { useState } from "react";
import { AlertPara, AlertType } from "../../shared.types";
import { UserLogin } from "../../Components/Requests";

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
    const res = await UserLogin(creds);
    if (res instanceof Error) {
      ShowAlert({
        alertMessage: res.message,
        alertType: AlertType.Error,
      });
      return;
    }
    ShowAlert({
      alertMessage: `Successfully Signed Up!`,
      alertType: AlertType.Success,
    });
    handleRegister();
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" method="post" onSubmit={handleSubmit}>
              <h2 className="card-title">Register</h2>
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
