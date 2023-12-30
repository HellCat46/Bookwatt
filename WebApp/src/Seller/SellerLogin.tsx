import { ChangeEvent, useState } from "react";
import { redirect } from "react-router-dom";

export default function () {
  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");

  function handleEmail(event : ChangeEvent<HTMLInputElement>){
    changeEmail(event.target.value);
  }

  function handlePassword(event: ChangeEvent<HTMLInputElement>) {
    changePassword(event.target.value)
  }

  async function handleSubmit(event : React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const res = await fetch("http://localhost:5246/seller/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ email: email, password: password }),
      credentials: "include",
    });
    if(res.status == 200){
      console.log("Logged In")
      window.location.reload();
    }else {
      console.log(res.body);
    }
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
                  onChange={handleEmail}
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
                  onChange={handlePassword}
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
              </div>
            </form>
            <div className="link" onClick={() => redirect("/sellerRegister")}>
              Register
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
