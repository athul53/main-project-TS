import React, { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'

const Singup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

const navigate = useNavigate()

const handleSignup = async (e) => {
  e.preventDefault();

  if (!validateEmail(email)) {
    setError("please enter your name");
    return;
  }

  if (!validateEmail(email)) {
    setError("please enter a valid email address");
    return;
  }

  if (!password) {
    setError("Please enter your password");
    return;
  }

  setError("");

  //Signup  Api Call
  try {
    const response = await axiosInstance.post("/Create-account",{
      fullName: name,
      email: email,
      password: password,
    });

    // handle successfull login responce
    if (response.data && response.data.accessToken) {
      localStorage.setItem("Token", response.data.accessToken);
      navigate("/dashboard");
    }
  } catch (error) {
    // Handle login error
    if (
      error.response &&
      error.responce.data &&
      error.responce.data.message
    ) {
      setError(error.response.data.message);
    } else {
      setError("An unexpected error occurred. Please try again later.");
    }
  }
};

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">

      <div className="login-ui-box right-10 -top-40"></div>
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2"></div>
      <div className="conainer h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Join the <br /> Adventure
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Create your account to start documenting your travels and presserving
              your memories in your personal travel journal
            </p>
          </div>

        </div>
        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignup }>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>

            <input type="text" 
            placeholder="Full Name"
             className="input-box"
            value={name}
            onChange={({target}) =>
               setName(target.value)}
            />
            
            <input type="text" 
            placeholder="Email"
             className="input-box"
            value={email}
            onChange={({target}) =>
               setEmail(target.value)}
            />


            <PasswordInput value={password}
            onChange={({target}) =>
               setPassword(target.value)}
               />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
            CREATE ACCOUNT
            </button>
            <p className="text-xs text-slate-500 text-center mt-4">or</p>

            <button
            type="submit"
            className="btn-primary btn-light"
            onClick={() => {
              navigate("/login")
            }}
          >
           LOGIN
          </button>
          </form>
        </div>

      </div>

    </div>
  )
}

export default Singup