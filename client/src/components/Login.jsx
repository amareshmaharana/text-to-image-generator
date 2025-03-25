import React, { useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import axios from "axios";

import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/user/login`, {
          email,
          password,
        });

        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/user/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <motion.form
          onSubmit={onSubmitHandler}
          initial={{ opacity: 0.2, y: 50 }}
          transition={{ duration: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white p-10 rounded-xl text-slate-500"
        >
          <h1 className="text-center text-2xl text-neutral-700 font-bold">
            {state}
          </h1>

          {state === "Login" ? (
            <p className="text-sm">Welcome back! Please sign in to continue</p>
          ) : (
            <p className="text-sm ml-2">
              Hello, Welcome from{" "}
              <span className="text-blue-500">DoodleForge</span>.<br />
              <span className="ml-8">Let's begin the journey!!</span>
            </p>
          )}

          {state !== "Login" && (
            <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
              <img width={17} src={assets.user_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="text-sm outline-none"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.email_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="text-sm outline-none"
              placeholder="Email"
              required
            />
          </div>

          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5 mb-9">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="text-sm outline-none"
              placeholder="Password"
              required
            />
          </div>

          {state !== "Sign Up" && (
            <p className="text-sm text-blue-600 my-4 cursor-pointer hover:underline">
              forgot password?
            </p>
          )}

          <button className="bg-blue-600 w-full text-white py-2 rounded-full">
            {state === "Login" ? "login" : "Create Account"}
          </button>

          {state === "Login" ? (
            <p className="mt-5 text-center">
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setState("Sign Up")}
              >
                signup
              </span>
            </p>
          ) : (
            <p className="mt-5 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setState("Login")}
              >
                login
              </span>
            </p>
          )}

          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="cross_icon"
            className="absolute top-5 right-5 cursor-pointer"
          />
        </motion.form>
      </div>
    </>
  );
};

export default Login;
