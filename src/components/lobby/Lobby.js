import React, { useState, useEffect, useRef, useContext } from "react";

import AuthContext from "../../context/AuthContext";
import SocketContext from "../../context/SocketContext";

import LoadingScreen from "../LoadingScreen";
import LobbyChat from "./LobbyChat";
import LobbyPlayers from "./LobbyPlayers";
import ChooseCategories from "./ChooseCategories";
import { FaCopy } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Lobby() {
  const { username } = useContext(AuthContext);
  const {
    userInfo,
    roomInfo,
    socketUpdateRoom,
    socketCancelRoom,
    socketLeaveRoom,
    socketStartGame,
  } = useContext(SocketContext);

  const [copied, setCopied] = useState(false);
  const isPublic = useRef(false);

  useEffect(() => {
    if (copied === true) {
      setTimeout(function () {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  const handleSlider = () => {
    socketUpdateRoom({
      ...roomInfo,
      public: isPublic.current,
    });
  };

  const canStartGame = () => {
    if (roomInfo.categories === undefined) return false;
    if (roomInfo.players.length !== 3) return false;

    let isSomeActive = false;
    roomInfo.categories.forEach((cat) => {
      if (cat.active === true) {
        isSomeActive = true;
        return;
      }
    });
    return isSomeActive;
  };

  if (roomInfo)
    return (
      <div className="flex grow justify-center items-center bg-slate-900">
        <motion.div
          animate={{ scale: 1 }}
          initial={{ scale: 0.6 }}
          className="sm:rounded-lg shadow sm:border w-full max-w-6xl bg-slate-800 border-slate-600"
        >
          <div className="sm:space-y-6 p-7">
            <div className="text-white text-lg text-center">
              Код, чтобы присоединиться к игре
              <div className="flex justify-center">
                <button
                  className="flex ml-3 text-yellow-200 font-semibold text-2xl tracking-widest text-start items-center"
                  onClick={() => {
                    setCopied(true);
                    navigator.clipboard.writeText(userInfo.roomCode);
                  }}
                >
                  {userInfo.roomCode ? userInfo.roomCode : ""}
                  <FaCopy className="p-2 text-white/80" size={35} />
                  <div className="relative">
                    <p className="text-sm font-normal tracking-normal text-white/80 absolute top-[-12px]">
                      {copied ? "Скопировано из" : null}
                    </p>
                  </div>
                </button>
              </div>
            </div>
            <div className="grid sm:grid-rows-1 sm:grid-cols-3 grid-cols-1 grid-rows-3 gap-2 w-full">
              <ChooseCategories />
              <div className="grid grid-rows-2">
                <LobbyPlayers />
                {roomInfo["owner"] === username ? (
                  <div className="flex justify-center items-center text-white">
                    <div>
                      <div className="text-center m-2">
                        Опубликуйте игру для всех
                      </div>
                      <div className="flex justify-center">
                        <label className="inline-flex relative items-center cursor-pointer hover:scale-110 transition-all">
                          <input
                            type="checkbox"
                            value={isPublic}
                            id="default-toggle"
                            className="sr-only peer"
                            onChange={() => {
                              isPublic.current = !isPublic.current;
                              handleSlider();
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center text-white/70">
                    {roomInfo.public
                      ? "Любой желающий может присоединиться"
                      : "Доступ только по коду"}
                  </div>
                )}
              </div>
              <LobbyChat />
            </div>
            <div className="flex justify-center gap-5">
              {roomInfo.owner === username ? (
                <>
                  {canStartGame() ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={socketStartGame}
                      type="submit"
                      className="border-2 border-slate-400/40 sm:w-1/3 text-green-500 w-full bg-slate-900/50 font-semibold rounded-lg text-lg py-2.5 text-center hover:bg-slate-700/80"
                    >
                      Начните игру
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      type="submit"
                      className="border-2 border-slate-400/40 sm:w-1/3 text-green-500/50 w-full bg-slate-900/50 font-semibold rounded-lg text-lg py-2.5 text-center"
                    >
                      Начните игру
                    </button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={socketCancelRoom}
                    type="submit"
                    className="border-2 border-slate-400/40 sm:w-1/3 w-full text-rose-500 bg-slate-900/50 font-semibold rounded-lg text-lg py-2.5 text-center hover:bg-slate-700/80"
                  >
                    Отмена
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={socketLeaveRoom}
                  type="submit"
                  className="border-2 border-slate-400/40 sm:w-1/3 w-full text-rose-500 bg-slate-900/50 font-semibold rounded-lg text-lg py-2.5 text-center hover:bg-slate-700/80"
                >
                  Оставить
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  return <LoadingScreen />;
}
