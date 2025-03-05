import React, { useEffect, useState, useContext, useRef } from "react";
import PublicRooms from "./PublicRooms";

import SocketContext from "../../context/SocketContext";
import { motion } from "framer-motion";
import { IoMdRefresh } from "react-icons/io";

export default function HomeMenu() {
  const {
    socketCreateRoom,
    socketJoinRoom,
    socketGetPublicRooms,
    socketJoinPublicRoom,
  } = useContext(SocketContext);

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(null);
  const [publicRooms, setPublicRooms] = useState([]);
  const [spamCounter, setSpamCounter] = useState(0);

  const loading = useRef(false);

  useEffect(() => {
    if (loading.current) return;
    loading.current = true;

    socketGetPublicRooms(setPublicRooms);
  }, [socketGetPublicRooms]);

  useEffect(() => {
    if (publicRooms == null) {
      socketGetPublicRooms(setPublicRooms);
    }
  }, [publicRooms, socketGetPublicRooms]);

  useEffect(() => {
    setCodeError(null);

    if (code.length === 4) {
      socketJoinRoom(code, setCodeError);
    }
  }, [code, setCodeError, socketJoinRoom]);

  const handleCode = (e) => {
    e.preventDefault();

    if (e.target.value.length <= 4) setCode(e.target.value.toUpperCase());
  };

  return (
    <div className="flex grow justify-center items-center bg-slate-900">
      <motion.div
        animate={{ scale: 1 }}
        initial={{ scale: 0.6 }}
        className="sm:rounded-lg shadow sm:border w-full max-w-4xl  bg-slate-800 border-slate-600"
      >
        <div className="space-y-6 p-7">
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={socketCreateRoom}
              type="submit"
              className="border-2 border-slate-400/40 w-64 text-white bg-slate-700/80 font-bold rounded-lg text-lg py-2.5 text-center bg-primary-600 hover:bg-slate-700"
            >
              Создайте игру
            </motion.button>
          </div>
          <hr className="border border-slate-400/60" />
          <div className="flex justify-center">
            <div>
              <label
                htmlFor="code"
                className="userdata-label text-center text-xl"
              >
                Присоединяйтесь к игре
              </label>
              <input
                onFocus={() => setCode("")}
                value={code}
                type="text"
                name="code"
                placeholder="Код вставки"
                className={`tracking-widest border text-xl w-40 rounded-lg block text-center p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white`}
                onChange={handleCode}
              />
            </div>
          </div>
          <div className="text-center text-rose-500/90 text-lg te">
            {codeError ? codeError : null}
          </div>
          <hr className="border border-slate-400/60" />
          <div>
            <div className="flex justify-center items-center">
              <div className="text-xl text-white font-semibold mb-2">
                Общественные игры
              </div>
              <div className="left-[78px] text-white flex justify-start items-center">
                <button
                  onClick={() => {
                    setSpamCounter((prev) => prev + 1);
                    setTimeout(() => {
                      setSpamCounter((prev) => prev - 1);
                    }, 1000);

                    if (spamCounter > 3) return;

                    socketGetPublicRooms(setPublicRooms);
                  }}
                >
                  <IoMdRefresh
                    className="m-2 border-2 rounded-md border-slate-400/50 cursor-pointer hover:bg-slate-700/80 "
                    size={28}
                  />
                </button>
                {spamCounter > 3 ? (
                  <motion.div
                    className="absolute left-[45px] w-[100px] text-sm text-white/50 blocker"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    не спамить
                  </motion.div>
                ) : null}
              </div>
            </div>
            <PublicRooms
              publicRooms={publicRooms}
              setCodeError={setCodeError}
              socketJoinPublicRoom={socketJoinPublicRoom}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
