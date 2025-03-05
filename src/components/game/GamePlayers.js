import { useContext } from "react";
import { Gravatar } from "../Gravatar";

import AuthContext from "../../context/AuthContext";
import SocketContext from "../../context/SocketContext";
import { motion } from "framer-motion";

import { PLAYER_COLORS } from "../../constants";

export default function GamePlayers() {
  const { username } = useContext(AuthContext);
  const { roomInfo } = useContext(SocketContext);

  const totalScore = (player) => {
    let total = 0;
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(roomInfo.map)) {
      if (value.owner === player) total += value.price;
    }
    return total;
  };

  return (
    <div>
      <div className="absolute text-white px-4 top-[10%] left-[2%]">
        {roomInfo.players
          .sort((a, b) => (totalScore(b) > totalScore(a) ? 1 : -1))
          .map((player, idx) => {
            return (
              <motion.div
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ duration: 0.3, delay: (idx + 1) * 0.2 }}
                key={idx}
                style={{
                  borderColor: PLAYER_COLORS[roomInfo.playerColors[player]],
                }}
                className="flex items-center text-lg justify-between rounded-2xl pb-1.5 pt-1 pl-2 border-2 my-2 w-[304px] opacity-95 bg-slate-800/70 shadow-xl shadow-black/60"
              >
                <div className="flex items-center">
                  <Gravatar
                    className="m-2 border-2 rounded-full"
                    style={{
                      borderColor: PLAYER_COLORS[roomInfo.playerColors[player]],
                    }}
                    email={
                      roomInfo.emails[player] ? roomInfo.emails[player] : ""
                    }
                    size={46}
                  />
                  <div
                    className={`m-2 text-grey ${
                      player === username ? "font-semibold" : null
                    }`}
                  >
                    {player}
                  </div>
                </div>
                <motion.div
                  key={totalScore(player)}
                  className="m-2 px-2 font-semibold"
                  initial={{ scale: 1.6 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {totalScore(player)}
                </motion.div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
