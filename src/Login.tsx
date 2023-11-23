import { useState } from "react";
import Buttons from "./Buttons";
import Input from "./Input";
import "./Login.css";
import { axiosRequest } from "./utils/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [invaldEmail, setInvalidEmail] = useState(false);
  const navigate = useNavigate();

  //Call server with name and email on button press
  const handleSubmit = async () => {
    //Validate email pattern
    const validEmail = emailValidationPattern(emailValue);
    if (!validEmail) {
      //If not valid, don't send request
      setInvalidEmail(true);
      return;
    } else {
      //If valid, send request and setInvalidEmail to false
      setInvalidEmail(false);
      await axiosRequest.post(
        "/auth/login",
        { name: nameValue, email: emailValue },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      //Navigate to home after successful login
      navigate("/home");
    }
  };
  const emailValidationPattern = (email: string) => {
    //Validate email pattern
    const regex = new RegExp(".+@.+..+");
    return regex.test(email);
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg">
      <div className="card small-card mat-elevation-z0">
        <div className="card-head position-relative mat-elevation-z3 mx-3">
          <h4 className="text-center mt-2 text-white">Sign In</h4>
        </div>
        <form className="d-flex flex-column">
          <Input id="name" name="Name" inputType="text" changeValue={setNameValue} />
          <Input id="email" name="Email" inputType="email" changeValue={setEmailValue} inputError={invaldEmail} />
          <Buttons name="Login" handleButtonClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default Login;
