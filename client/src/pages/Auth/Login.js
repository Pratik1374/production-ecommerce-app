import React, { useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Header from "../../components/Layout/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); //By default in js on a button click page is refreshed so we want to stop it with this
    try {
      const res = await axios.post(
        "/api/v1/auth/login",
        { email, password }
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.success("!!Something went wrong");
    }
  };

  return (
    <>
      <Header title={"Login - myEcom"} />
      <div className="container1" >
        <div className="screen">
          <div className="screen__content">
            <form className="login" onSubmit={handleSubmit}>
              <div className="login__field">
                <i className="login__icon fas fa-user" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login__input"
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-lock" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login__input"
                  placeholder="Enter Password"
                  required
                />
              </div>
              <button className="button login__submit">
                <span className="button__text">Log In</span>
                <i className="button__icon fas fa-chevron-right" />
                
              </button>
            </form>
            <div class="social-login">
              <Link to="/register" style={{ color: "cyan" }}>Sign Up</Link>
            </div>
          </div>
          <div className="screen__background">
            <span className="screen__background__shape screen__background__shape4" />
            <span className="screen__background__shape screen__background__shape3" />
            <span className="screen__background__shape screen__background__shape2" />
            <span className="screen__background__shape screen__background__shape1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
