import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import SocketContext from "../context/SocketContext";
import { Gravatar } from "./Gravatar";
import { BiLogInCircle } from "react-icons/bi";
import { motion } from "framer-motion";

function DropdownItemLink({ text, url, margin }) {
  return (
    <a href={url}>
      <li
        className={`bg-slate-700 rounded-lg p-1.5 px-3 border border-slate-400/60 ${margin}`}
      >
        {text}
      </li>
    </a>
  );
}

function DropdownItemButton({ text, func }) {
  return (
    <button
      onClick={func}
      className="bg-slate-700 rounded-lg p-1.5 px-3 border border-slate-400/60 my-1"
    >
      {text}
    </button>
  );
}

export default function Header() {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const { username, useremail, logoutUser } = useContext(AuthContext);
  const { setUserInfo, setRoomInfo } = useContext(SocketContext);

  return (
    <nav className="flex bg-slate-800 text-white h-[60px] justify-start items-center border-b border-slate-700 z-10 shadow-lg shadow-black/10">
      <div className="flex justify-center items-center w-full absolute">
        <div className="sm:text-2xl text-lg text-white pb-1 font-semibold">
          <a href="/">
            OOPQuest
          </a>
        </div>
      </div>
      <div className="flex justify-end items-center w-full absolute">
        <button
          onClick={() => {
            setAccountDropdownOpen(!accountDropdownOpen);
          }}
        >
          {useremail ? (
            <Gravatar
              className="sm:mr-5 mr-1 border-2 border-slate-400 rounded-full"
              email={useremail}
              size={34}
            />
          ) : (
            <BiLogInCircle className="sm:mr-5 mr-1" size={30} />
          )}
        </button>
      </div>
      {accountDropdownOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-[60px] right-0 bg-slate-800 px-2 py-1.5 rounded-bl-md border-b border-l border-slate-700"
          onMouseLeave={() => {
            setAccountDropdownOpen(false);
          }}
        >
          {username ? (
            <ul>
              <DropdownItemButton
                text={"Выход"}
                func={() => {
                  logoutUser();
                  setUserInfo(null);
                  setRoomInfo(null);
                }}
              />
            </ul>
          ) : (
            <ul>
              <DropdownItemLink text={"Вход"} url={"/login"} />
              <DropdownItemLink
                text={"Регистрация"}
                url={"/register"}
                margin={"mt-2"}
              />
            </ul>
          )}
        </motion.div>
      ) : null}
    </nav>
  );
}

/*
      <button
        className="text-slate-200 shadow-xl border border-slate-400/60 pt-1 pb-2 px-3 absolute rounded-lg sm:ml-3 ml-1"
        onClick={() => {
          setDropdownOpen(!dropdownOpen);
        }}
      >
        menu
      </button>
*/
