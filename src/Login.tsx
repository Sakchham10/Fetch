import { useState } from "react";
import Buttons from "./Buttons";
import Input from "./Input";
import "./Login.css";
import { axiosRequest } from "./utils/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const res = await axiosRequest.post(
      "/auth/login",
      { name: nameValue, email: emailValue },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    navigate("/home");
  };

  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  return (
    <div className="d-flex justify-content-center align-items-center bg">
      <div className="card small-card mat-elevation-z0">
        <div className="card-head position-relative mat-elevation-z3 mx-3">
          <h4 className="text-center mt-2 text-white">Sign In</h4>
        </div>
        <form className="d-flex flex-column">
          <Input id="name" name="Name" inputType="text" changeValue={setNameValue} />
          <Input id="email" name="Email" inputType="email" changeValue={setEmailValue} />
          <Buttons name="Login" handleButtonClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default Login;
