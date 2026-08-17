import React, { useState } from 'react';

import './CSS/LoginSignup.css';

import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  signInWithPopup
} from "firebase/auth";
import CustomSnackbar
from "../Components/CustomSnackbar";
import {
  auth,
  provider
} from "../Components/firebase";
import { API_URL } from '../config';

const Login = ({ darkMode }) => {


  const [email,setEmail]=useState("");

  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword] = useState(false);
   const [loading,setLoading] =
    useState(false);

    const [snackbar,setSnackbar] =
    useState({
    open:false,
    message:"",
    severity:"success"
    });
    const showSnackbar=(
    message,
    severity="success"
    )=>{
    setSnackbar({
      open:true,
      message,
      severity
    });
    };

  const loginWithGoogle = async () => {

 try{

  const result =
  await signInWithPopup(
   auth,
   provider
  );

  const response =
  await fetch(`${API_URL}/google-login`,
   {
    method:"POST",
    headers:{
      "Content-Type":
      "application/json"
    },
    body:JSON.stringify({
      name:
      result.user.displayName,

      email:
      result.user.email
    })
   }
  );

  const data =
  await response.json();

  if(data.success){

   localStorage.setItem(
    "auth-token",
    data.token
   );
      localStorage.setItem(
    "user-name",
    result.user.displayName
  );

  localStorage.setItem(
    "user-email",
    result.user.email
  );
   localStorage.setItem(
  "user-mobile",
  data.mobile
   );
   showSnackbar(
    "Google Login Successful"
   );

    setTimeout(() => {
    window.location.href = "/";
    }, 1500);

  }

 }
 catch(error){

  showSnackbar(
    error.message,
    "error"
  );

}
};
const login = async () => {

 if(!email || !password){
  return showSnackbar(
   "Email and Password required",
   "error"
  );
 }

 try{

  setLoading(true);

  const response =
  await fetch(
   `${API_URL}/login`,
   {
    method:"POST",
    headers:{
      "Content-Type":
      "application/json"
    },
    body:JSON.stringify({
      email,
      password
    })
   }
  );

  const data =
  await response.json();

  if(data.success){

   localStorage.setItem(
    "auth-token",
    data.token
   );
    localStorage.setItem(
    "user-name",
    data.name
  );

  localStorage.setItem(
    "user-email",
    data.email
  );
   showSnackbar(
    "Login Successful"
   );
    setTimeout(() => {
    window.location.href = "/";
    }, 1500);

  }else{

   showSnackbar(
    data.errors,
    "error"
   );

  }

 }catch{

  showSnackbar(
   "Server Error",
   "error"
  );

 }finally{

  setLoading(false);

 }
};


  return (

    <div className={`auth-page ${darkMode ? "dark" : ""}`}>

      <div className="auth-container">

        <h1>Login</h1>

        <div className="auth-fields">

          <input
            type="email"
            placeholder="Email"
            onChange={(e)=>
            setEmail(e.target.value)}
          />

          <div className="password-field">
           <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e)=>setPassword(e.target.value)}
            />

            <span
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

          </div>

        </div>


        <button
            onClick={login}
            disabled={loading}
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>


        <button
          className="google-btn"
          onClick={loginWithGoogle}
        >
          Continue with Google
        </button>


        <p className="switch-page">

          Don't have account?

          <Link to="/signup">
            Sign Up
          </Link>

        </p>

      </div>
      <CustomSnackbar
        open={snackbar.open}
        setOpen={(value)=>
          setSnackbar({
            ...snackbar,
            open:value
          })
        }
        message={snackbar.message}
        severity={snackbar.severity}
      />          
    </div>
  );
};

export default Login;