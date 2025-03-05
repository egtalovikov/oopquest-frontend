import { useContext, useState, useEffect } from "react";
import SocketContext from "../../../../context/SocketContext";
import { Gravatar } from "../../../Gravatar";
import { BsClock } from "react-icons/bs";
import { IoMdStats } from "react-icons/io";
import QuestionTimer from "../QuestionTimer";
import { motion } from "framer-motion";

import { PLAYER_COLORS } from "../../../../constants";

const shuffleArray = (refArray) => {
  const array = [...refArray];
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const NumericResults = () => {
  const { roomInfo } = useContext(SocketContext);

  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    if (roomInfo.currentQuestion.answers)
      setShuffledAnswers(shuffleArray(roomInfo.currentQuestion.answers));
  }, [roomInfo]);

  if (!roomInfo.currentQuestion.answers)
    return (
      <motion.div
        className="question min-w-[620px] min-h-[300px]"
        animate={{ scale: 1 }}
        initial={{ scale: 0.6 }}
      >
        <div className="question-question-div">
          <div className="question-question max-w-[620px]">
            {roomInfo.currentQuestion.question}{" "}
            <span className="question-category">
              {roomInfo.currentQuestion.category}
            </span>
          </div>
        </div>
        <div className="numeric-question-question-div">
          <p className="numeric-question-result">???</p>
        </div>
        <motion.div
          className="flex justify-center items-center h-[160px] rounded-b-lg"
          animate={{ scale: 1 }}
          initial={{ scale: 0 }}
        >
          <div className="text-center text-lg text-slate-200">
            Результаты ожидаются...
            <QuestionTimer />
          </div>
        </motion.div>
      </motion.div>
    );

  return (
    <motion.div
      className="question min-w-[620px] min-h-[300px] drop-shadow-[0_1px_40px_rgba(0, 0, 0, 0.5)]"
      animate={{ scale: 1 }}
      initial={{ scale: 0.6 }}
    >
      <div className="question-question-div">
        <div className="question-question max-w-[620px]">
          {roomInfo.currentQuestion.question}{" "}
          <span className="question-category">
            {roomInfo.currentQuestion.category}
          </span>
        </div>
      </div>
      <div className="numeric-question-question-div">
        <p className="numeric-question-result">
          {roomInfo.currentQuestion.rightAnswer}
        </p>
      </div>
      <div className="flex justify-center items-center p-2">
        {shuffledAnswers.map((ans) => (
          <motion.div
            key={ans.username}
            animate={{ scale: 1.1 - ans.position * 0.04 }}
            initial={{ scale: 0 }}
            transition={{ delay: (3 - ans.position) * 0.5 }}
          >
            <div className={`border-2 m-2 mx-4 rounded-lg border-slate-500`}>
              <div className="flex justify-start items-center bg-slate-700 rounded-t-lg">
                <Gravatar
                  style={{
                    borderColor:
                      PLAYER_COLORS[roomInfo.playerColors[ans.username]],
                  }}
                  className={`ml-3 m-2 border-2 rounded-full`}
                  email={
                    roomInfo.emails[ans.username]
                      ? roomInfo.emails[ans.username]
                      : ""
                  }
                  size={36}
                />
                <div className="text-lg pr-2">{ans.username}</div>
              </div>
              <div
                className="flex justify-center items-center text-black text-2xl font-bold p-1 border-y border-slate-300/50"
                style={{
                  backgroundColor:
                    PLAYER_COLORS[roomInfo.playerColors[ans.username]],
                }}
              >
                {ans.answer}
              </div>
              <div className="flex justify-between items-center gap-10 bg-slate-600/80 rounded-b-lg">
                <div className="flex justify-center items-center">
                  <IoMdStats size={20} className="m-1.5" />
                  <p className="">{ans.difference}</p>
                </div>
                <div className="flex justify-center items-center">
                  <p className="">{Math.round(ans.time / 10) / 100}</p>
                  <BsClock size={20} className="m-2" />
                </div>
              </div>
              <div
                className={`absolute border-2 rounded-full px-[0.45em] pb-[0.08em] text-xl font-semibol border-slate-600/80 bg-slate-900/95 top-[-10px] right-[0px]
                ${
                  ans.position === 1
                    ? "text-yellow-400 border-yellow-400 bouncing top-[-4px]"
                    : null
                }
                ${ans.position === 2 ? "text-[#c0c0c0] border-[#c0c0c0]" : null}
                ${
                  ans.position === 3 ? "text-[#cd7f32] border-[#cd7f32]" : null
                }`}
              >
                {ans.position}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NumericResults;
