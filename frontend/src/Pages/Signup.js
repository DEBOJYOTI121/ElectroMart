  import React, { useState } from 'react';

  import './CSS/LoginSignup.css';

  import { Link } from 'react-router-dom';

  import CustomSnackbar from "../Components/CustomSnackbar";
  import { API_URL } from '../config';


  const Signup = ({ darkMode }) => {


    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [mobile,setMobile]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [loading,setLoading] =
    useState(false);

    const [snackbar,setSnackbar] =
    useState({
      open:false,
      message:"",
      severity:"success"
    });
    const showSnackbar = (
    message,
    severity="success"
    )=>{
    setSnackbar({
      open:true,
      message,
      severity
    });
  };
    const signup = async () => {

    if(
      !name ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword
    ){
      return showSnackbar(
        "All fields required",
        "error"
      );
    }

    if(!/^\d{10}$/.test(mobile)){
      return showSnackbar(
        "Enter valid mobile number",
        "error"
      );
    }

    if(password.length < 6){
      return showSnackbar(
        "Password must be at least 6 characters",
        "error"
      );
    }

    if(password !== confirmPassword){
      return showSnackbar(
        "Passwords do not match",
        "error"
      );
    }

    try{

      setLoading(true);

      const response =
        await fetch(`${API_URL}/signup`,
          {
            method:"POST",
            headers:{
              "Content-Type":
              "application/json"
            },
            body:JSON.stringify({
                name,
                email,
                mobile,
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
        localStorage.setItem(
          "user-mobile",
          data.mobile
        );
        showSnackbar(
          "Account Created Successfully"
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

        <h1>Create Account</h1>

        <p className="subtitle">
          Join Electro Mart
        </p>

       <div className="auth-fields">

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          maxLength="10"
          onChange={(e) => setMobile(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

      </div>

        <button
          onClick={signup}
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        <p className="switch-page">
          Already have account?
          <Link to="/login">
            Login
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

  export default Signup;