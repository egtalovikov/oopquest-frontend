import { useState, useEffect, useContext } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import AuthContext from "../../context/AuthContext";

import SocketContext from "../../context/SocketContext";
import { motion } from "framer-motion";

export default function GameChat() {
  const { username } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const [currMess, setCurrMess] = useState("");
  const [messList, setMessList] = useState([
    {
      author: "Егор Т., Аркадий Д., Егор Ш.",
      message: "Наслаждайтесь игрой 🙂",
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
    },
  ]);
  const [focused, setFocused] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    if (messList.length === 0) return;

    setShowChat(true);

    setTimeout(() => {
      setShowChat(false);
    }, 4 * 1000);
  }, [messList]);

  const sendMessage = async () => {
    if (currMess !== "") {
      const messData = {
        author: username,
        message: currMess,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
      };

      await socket.emit("send-message", messData, username);
      setMessList((list) => [...list, messData]);
      setCurrMess("");
    }
  };
  return (
    <motion.div
      animate={{ scale: 1 }}
      initial={{ scale: 0 }}
      transition={{ duration: 0.3 }}
      className={`z-50 absolute px-4 bottom-[10%] left-[1%] hidden 2xl:block opacity-50 hover:opacity-100 focus::opacity-100 transition-all
    ${showChat || focused ? "opacity-100" : "hidden"}`}
    >
      <div className="border-2 rounded-md border-slate-500 p-2 bg-slate-800/50 shadow-xl shadow-black/70">
        <ScrollToBottom className="message-game-container">
          <div className="text-white/80 text-center text-sm">Чат</div>
          {messList.map((messContent, index) => {
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={index}
                className={`flex text-white ${
                  messContent.author === username
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="m-1">
                  {messContent.author !== username ? (
                    <div className="text-xs flex">
                      <div className="mr-1 mb-0.5"> {messContent.author} </div>
                      <div className="text-gray-400">{messContent.time}</div>
                    </div>
                  ) : null}
                  <div
                    className={`break-words border border-slate-800/80 w-fit max-w-[240px] p-1 px-3 rounded-lg text-white ${
                      messContent.author === username
                        ? "bg-blue-500"
                        : "bg-slate-500"
                    }`}
                  >
                    {messContent.message}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </ScrollToBottom>
        <div className="flex justify-center">
          <div className="w-full">
            <input
              className="border-b border-l border-t p-1 w-full rounded-l-md bg-slate-200 border-slate-400 text-black"
              value={currMess}
              type="text"
              onFocus={() => {
                setFocused(true);
              }}
              onBlur={() => {
                setFocused(false);
              }}
              onChange={(e) => {
                setCurrMess(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
          </div>
          <div className="">
            <button
              className="border p-1 px-2 w-full border-slate-600 rounded-br-md rounded-tr-sm bg-slate-600 text-white font-semibold"
              onClick={sendMessage}
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
