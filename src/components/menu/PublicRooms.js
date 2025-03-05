import React from "react";
import TextCategories from "./TextCategories";
import { motion } from "framer-motion";

export default function PublicRooms({
                                      publicRooms,
                                      socketJoinPublicRoom,
                                      setCodeError,
                                    }) {
  const content = () => {
    if (!publicRooms) return null;
    
    return (
      <div>
        {publicRooms.length === 0 ? (
          <div className="p-3 text-center grid text-slate-400 font-normal text-sm">
            в данный момент нет публичных игр
          </div>
        ) : null}
        {publicRooms.map((room, idx) => {
          return (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.6 }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="grid grid-cols-4 p-2 py-1 border-t border-slate-400/50 text-slate-200 font-normal"
            >
              <div>{room.owner}</div>
              <div>{room.capacity}/3</div>
              <div>
                <TextCategories room={room} />
              </div>
              <div className="flex justify-end">
                <motion.button
                  onClick={() => {
                    socketJoinPublicRoom(room.roomCode, setCodeError);
                  }}
                  className="border border-slate-500 m-1 px-5 p-2 rounded-lg bg-slate-900/80 font-semibold text-slate-200 hover:bg-slate-700/100 hover:border-slate-400/50 transition-all"
                >
                  <div>Присоединиться</div>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="text-white border-2 rounded-md border-slate-400/50 font-semibold">
      <div className="grid grid-cols-4 p-2 py-1">
        <div>Создатель</div>
        <div>Игроки</div>
        <div>Темы</div>
      </div>
      {content()}
    </div>
  );
}
