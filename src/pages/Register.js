import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion";

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export default function Register() {
  const { registerUser } = useContext(AuthContext);

  const [usern, setUsern] = useState("");
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [confPasswd, setConfPasswd] = useState("");

  const [usernError, setUsernError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwdError, setPasswdError] = useState(false);
  const [confPasswdError, setConfPasswdError] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const checkConfPasswd = () => {
      if (confPasswd !== passwd) {
        setConfPasswdError(true);
      } else {
        setConfPasswdError(false);
      }
    };
    checkConfPasswd();
  }, [confPasswd, passwd]);

  useEffect(() => {
    document.title = "Регистрация - OOPQuest";
  }, []);

  const handleUsern = (e) => {
    e.preventDefault();

    const validChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_ěščřžýáíéóůúňĚŠČŘŽÝÁÍÉÓŮÚŇ";

    const text = e.target.value;

    let areValid = true;
    text.split("").forEach((char) => {
      if (!validChars.includes(char)) {
        console.log(char);
        areValid = false;
      }
    });

    if (!areValid) return;

    if (e.target.value[0] >= "0" && e.target.value[0] <= "9") return;
    if (e.target.value[e.target.value.length - 1] === " ") return;
    if (e.target.value.length > 16) return;

    if (e.target.value.length <= 4) setUsernError(true);
    else setUsernError(false);

    setUsern(e.target.value);
  };

  const handleEmail = (e) => {
    e.preventDefault();

    if (e.target.value[e.target.value.length - 1] === " ") return;
    if (e.target.value.length > 30) return;

    if (!validateEmail(e.target.value)) setEmailError(true);
    else if (e.target.value.length <= 5) setEmailError(true);
    else setEmailError(false);

    setEmail(e.target.value);
  };

  const handlePasswd = (e) => {
    e.preventDefault();

    if (e.target.value[e.target.value.length - 1] === " ") return;
    if (e.target.value.length > 30) return;

    if (e.target.value.length < 8) setPasswdError(true);
    else setPasswdError(false);

    setPasswd(e.target.value);
  };

  const handleConfPasswd = (e) => {
    e.preventDefault();

    setConfPasswd(e.target.value);
  };

  const handleButton = (e) => {
    e.preventDefault();

    console.log("register");

    if (usernError || passwdError) return;

    if (usern === "") {
      setUsernError(true);
      return;
    }

    if (email === "") {
      setEmailError(true);
      return;
    }

    if (passwd === "") {
      setPasswdError(true);
      return;
    }
    registerUser(usern, passwd, email, setServerError);
  };

  return (
    <div className="flex grow justify-center items-center bg-slate-900">
      <motion.div
        initial={{ opacity: 0.4, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full sm:rounded-lg shadow sm:border max-w-md  bg-slate-800 border-slate-600"
      >
        <div className="space-y-6 p-7">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-white">
            Регистрация
          </h1>
          <form className="space-y-6" action="#">
            <div>
              <label htmlFor="username" className="userdata-label">
                Имя пользователя
              </label>
              <input
                value={usern}
                type="username"
                name="username"
                id="username"
                className={`userdata-input ${
                  usernError ? "border-rose-800" : ""
                }`}
                placeholder="Имя пользователя"
                onChange={handleUsern}
              />
              {usernError ? (
                <label className="text-rose-500/90 p-2 text-sm">
                  Имя пользователя должно быть длиннее 4 символов
                </label>
              ) : null}
            </div>
            <div>
              <label htmlFor="email" className="userdata-label">
                Email
              </label>
              <input
                value={email}
                type="email"
                name="email"
                id="email"
                className={`userdata-input ${
                  emailError ? "border-rose-800" : ""
                }`}
                placeholder="test@ya.ru"
                onChange={handleEmail}
              />
              <div className="text-white text-[13px] p-1 opacity-80">
                Для собственного аватара нужно связать электронную почту с{" "}
                <a
                  href="https://gravatar.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-300 font-semibold hover:text-blue-100 underline"
                >
                  Gravatar
                </a>
              </div>
              {emailError ? (
                <label className="text-rose-500/90 p-2 text-sm">
                  Электронная почта недействительна
                </label>
              ) : null}
            </div>
            <div>
              <label htmlFor="password" className="userdata-label">
                Пароль
              </label>
              <input
                value={passwd}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className={`userdata-input ${
                  passwdError ? "border-rose-800" : ""
                }`}
                onChange={handlePasswd}
              />
              {passwdError ? (
                <label className="text-rose-500/90 p-2 text-sm">
                  Пароль должен быть не менее 8 символов
                </label>
              ) : null}
            </div>
            <div>
              <label htmlFor="confirm-password" className="userdata-label">
                Подтверждение пароля
              </label>
              <input
                value={confPasswd}
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                className={`userdata-input ${
                  passwdError ? "border-rose-800" : ""
                }`}
                onChange={handleConfPasswd}
              />
              {confPasswdError ? (
                <label className="text-rose-500/90 p-2 text-sm">
                  Пароли не совпадают
                </label>
              ) : null}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={handleButton}
              type="submit"
              className="border-2 border-slate-400/40 w-full text-white bg-primary-600 font-bold rounded-lg text-lg py-2.5 text-center bg-primary-600 hover:bg-slate-700/50"
            >
              Создать аккаунт
            </motion.button>
            {serverError !== "" ? (
              <div className="flex text-rose-400">{serverError}</div>
            ) : null}
            <p className="text-sm font-light text-gray-400">
              Уже есть аккаунт?{" "}
              <a
                href="./login"
                className="font-medium hover:underline text-primary-500"
              >
                Войти
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
