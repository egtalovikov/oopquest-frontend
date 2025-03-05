import React, { useContext } from "react";
import { MdCancelPresentation } from "react-icons/md";
import { Gravatar } from "../Gravatar";
import { FaCrown } from "react-icons/fa";

import AuthContext from "../../context/AuthContext";
import SocketContext from "../../context/SocketContext";
import { motion } from "framer-motion";

export default function LobbyPlayers() {
  const { username } = useContext(AuthContext);
  const { roomInfo, socketKickPlayer } = useContext(SocketContext);

  return (
    <div className="text-white px-4">
      <div className="text-center p-1 text-md">
        Подключенные игроки
        <span className="ml-2 font-semibold tracking-widest">
          ({roomInfo.players.length}/3)
        </span>
      </div>
      {roomInfo.players.map((player, idx) => {
        let borderColor = idx === 0 ? "border-amber-400" : "border-blue-400";
        return (
          <motion.div
            key={idx}
            animate={{ scale: 1 }}
            initial={{ scale: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            <div
              className={`flex items-center text-lg justify-start rounded-lg pb-2.5 pt-1.5 pl-2 border my-2 ${
                player === username
                  ? "border-white font-semibold"
                  : "border-slate-400"
              } `}
            >
              <Gravatar
                className={`m-2 border-2 ${borderColor} rounded-full`}
                email={roomInfo.emails[player] ? roomInfo.emails[player] : ""}
                size={36}
              />
              {roomInfo.owner === player ? (
                <div className="flex items-center justify-center absolute">
                  <FaCrown
                    size={20}
                    className="relative top-[-22px] left-[16px] text-yellow-400"
                  />
                </div>
              ) : null}
              {player}
            </div>
            {idx !== 0 && username === roomInfo.owner ? (
              <div className="relative flex justify-end">
                <button
                  className="absolute text-rose-400 top-[-58px] right-[18px] hover:scale-125 transition-all"
                  onClick={() => {
                    socketKickPlayer(player);
                  }}
                >
                  <MdCancelPresentation size={30} />
                </button>
              </div>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
