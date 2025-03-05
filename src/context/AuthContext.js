import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DEBUG } from "../constants";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
      ? JSON.parse(localStorage.getItem("authToken"))
      : null
  );
  const [username, setUsername] = useState(() =>
    localStorage.getItem("username")
      ? JSON.parse(localStorage.getItem("username"))
      : null
  );
  const [email, setEmail] = useState(() =>
    localStorage.getItem("email")
      ? JSON.parse(localStorage.getItem("email"))
      : null
  );

  useEffect(() => {
    if (DEBUG) console.log("username updated:", username);
  }, [username]);

  useEffect(() => {
    if (DEBUG) console.log("useremail updated:", email);
  }, [email]);

  useEffect(() => {
    if (DEBUG) console.log("authToken updated:", authToken);
  }, [authToken]);

  useEffect(() => {
    const auth = async () => {
      let response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/auth/authentication/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + authToken,
          },
        }
      );
      let data = await response.json();
      if (response.ok) {
        setUsername(data.username);
        localStorage.setItem("username", JSON.stringify(data.username));
        setEmail(data.email);
        localStorage.setItem("email", JSON.stringify(data.email));
      } else {
        setUsername(null);
        setEmail(null);
        setAuthToken(null);
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("authToken");
      }
      if (DEBUG) console.log("auth:", data);
    };

    if (authToken) auth();
  }, [authToken, username]);

  const navigate = useNavigate();

  const registerUser = async (username, password, email, setServerError) => {
    let response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/api/auth/users/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      }
    );
    let data = await response.json();
    if (DEBUG) console.log("register:", data);
    if (response.ok) {
      localStorage.setItem("lastUsername", JSON.stringify(username));
      navigate("./login");
    } else if ("username" in data) {
      setServerError("Учетная запись с таким именем пользователя уже существует");
    } else if ("password" in data) {
      setServerError("Пароль слишком слабый");
    } else setServerError("Регистрация прошла неудачно");
  };

  const loginUser = async (username, password, setServerError) => {
    let response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/api/auth/token/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );
    let data = await response.json();

    if (response.ok) {
      setUsername(username);
      setAuthToken(data.auth_token);
      localStorage.setItem("username", JSON.stringify(username));
      localStorage.setItem("lastUsername", JSON.stringify(username));
      localStorage.setItem("authToken", JSON.stringify(data.auth_token));
      setServerError("");
      navigate("/");
    } else setServerError("Учетная запись с такими данными не существует");

    if (DEBUG) console.log("loginUser:", data);
  };

  const logoutUser = async () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUsername(null);
    setEmail(null);

    let response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/api/auth/token/logout/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + authToken,
        },
      }
    );

    if (DEBUG) console.log("logoutUser success:", response.ok);
  };

  let contextData = {
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser,

    username: username,
    useremail: email,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
