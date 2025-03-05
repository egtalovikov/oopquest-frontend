import { useContext } from "react";
import { motion } from "framer-motion";
import { Gravatar } from "../Gravatar";
import { PLAYER_COLORS, USER_STATES } from "../../constants";
import SocketContext from "../../context/SocketContext";

const GameEnd = () => {
  const { roomInfo, userInfo, setUserInfo, setRoomInfo } =
    useContext(SocketContext);

  const totalScore = (player) => {
    let total = 0;
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(roomInfo.map)) {
      if (value.owner === player) total += value.price;
    }
    return total;
  };

  return (
    <motion.div
      className="relative bottom-[-16%]"
      initial={{ scale: 0.3 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex gap-20">
        {roomInfo.players.map((player, idx) => {
          return (
            <div key={idx} className="relative flex justify-center text-white">
              <motion.div
                className="w-[130px] absolute top-[54px] rounded-sm shadow-xl shadow-black/40"
                animate={{ y: -30 - totalScore(player) / 5 }}
                initial={{ y: 0 }}
                transition={{
                  duration: 0.8 + totalScore(player) / 2000,
                  delay: (idx + 1) * 1.2,
                }}
                style={{
                  backgroundColor: PLAYER_COLORS[roomInfo.playerColors[player]],
                  height: 30 + totalScore(player) / 5 - 2,
                }}
              />
              <motion.div
                className="flex justify-center w-[130px] h-[52px] absolute top-[28px] rounded-sm "
                animate={{ scale: 1.2 }}
                initial={{ scale: 0 }}
                transition={{
                  duration: 0.8 + totalScore(player) / 2000,
                  delay: (idx + 1) * 1.2,
                }}
              >
                <div className="text-slate-900 text-lg font-semibold tracking-wider">
                  {totalScore(player)}
                </div>
              </motion.div>
              <motion.div
                animate={{ y: -30 - totalScore(player) / 5 }}
                initial={{ y: 0 }}
                transition={{
                  duration: 0.8 + totalScore(player) / 2000,
                  delay: (idx + 1) * 1.2,
                }}
                style={{
                  borderColor: PLAYER_COLORS[roomInfo.playerColors[player]],
                }}
                className="text-xl text-center rounded-2xl w-[190px] py-2.5 border-2 opacity-95 bg-slate-700/60 shadow-xl shadow-black/60"
              >
                {player}
                <motion.div
                  className="absolute flex justify-center w-[190px] top-[-110px] "
                  animate={{ y: -2 }}
                  initial={{ y: 0 }}
                  transition={{
                    duration: 0.0001,
                    delay: (idx + 1) * 1.2,
                  }}
                >
                  <motion.div
                    animate={{ y: -totalScore(player) / 100 }}
                    initial={{ y: -20 }}
                    transition={{
                      duration: 0.8 + totalScore(player) / 2000,
                      delay: (idx + 1) * 1.2,
                    }}
                  >
                    <Gravatar
                      className="m-2 border-[3px] rounded-full relative shadow-xl shadow-black/40"
                      style={{
                        borderColor:
                          PLAYER_COLORS[roomInfo.playerColors[player]],
                      }}
                      email={
                        roomInfo.emails[player] ? roomInfo.emails[player] : ""
                      }
                      size={90}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="h-[270px] w-[900px] left-[-20px] absolute bg-slate-900"></div>
      <div className="absolute w-[730px]">
        <div className="flex justify-center text-white text-2xl m-8 border border-slate-700 rounded-2xl bg-slate-800 p-3 shadow-xl shadow-black/30">
          <div className="flex justify-center">
            <div>Результаты игры</div>
            <div className="text-yellow-200 ml-3 font-semibold text-3xl tracking-widest">
              {roomInfo.roomCode}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setRoomInfo(null);
              setUserInfo({
                ...userInfo,
                state: USER_STATES.MENU,
                roomCode: null,
              });
            }}
            type="submit"
            className="border-2 border-slate-400/40 sm:w-1/3 w-full text-slate-300 bg-slate-900/50 font-semibold rounded-lg text-lg py-2.5 text-center hover:bg-slate-700/80 shadow-xl shadow-black/40"
          >
            Назад к меню
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameEnd;

/*
<a
            whileHover={{ scale: 1.05 }}
            type="submit"
            href="/"
            className="border-2 border-slate-400/40 sm:w-1/3 w-full text-slate-300 bg-slate-900/50 font-semibold rounded-lg text-lg py-2.5 text-center hover:bg-slate-700/80 shadow-xl shadow-black/40"
          >
            Назад к меню
          </a>
*/
