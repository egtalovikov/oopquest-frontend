import { useState, useEffect, useRef, useContext } from "react";
import NumericQuestion from "./Numeric/NumericQuestion";
import NumericResults from "./Numeric/NumericResults";
import PickQuestion from "./Pick/PickQuestion";
import PickResults from "./Pick/PickResults";
import ImageQuestion from "./Image/ImageQuestion";
import ImageResults from "./Image/ImageResults";

import SocketContext from "../../../context/SocketContext";
import PrepareCounter from "./PrepareCounter";
import useCurrentTime from "../../../hooks/useCurrentTime";
import { motion } from "framer-motion";
import { GAME_STATES, QUESTION_TYPES } from "../../../constants";
import AuthContext from "../../../context/AuthContext";
import { GiSwordBrandish } from "react-icons/gi";
import { GiSlashedShield } from "react-icons/gi";
import { Gravatar } from "../../Gravatar";
import { PLAYER_COLORS } from "../../../constants";

const QuestionController = () => {
  const { username } = useContext(AuthContext);
  const { roomInfo, socketAnswerQuestion } = useContext(SocketContext);
  const currentTime = useCurrentTime();

  const [secondsTillStart, setSecondsTillStart] = useState(9999);
  const [secondsTillEnd, setSecondsTillEnd] = useState(9999);

  const [answer, setAnswer] = useState(null);
  const [submit, setSubmit] = useState(false);

  const answerSent = useRef(false);

  useEffect(() => {
    console.log("answer", answer);
  }, [answer]);

  useEffect(() => {
    setAnswer(null);
    setSubmit(false);
    answerSent.current = false;
  }, [roomInfo.currentQuestion.type]);

  useEffect(() => {
    if (!roomInfo.currentQuestion.answers) return;

    roomInfo.currentQuestion.answers.forEach((ans) => {
      if (ans.username === username) {
        setAnswer(ans.answer);
        setSubmit(true);
      }
    });
  }, [roomInfo, username]);

  useEffect(() => {
    if (submit === false) return;
    if (answerSent.current === true) return;
    if (answer === null) return;

    console.log("sending answer submit button", answer);

    socketAnswerQuestion(answer, false);
    answerSent.current = true;
  }, [submit, answer, socketAnswerQuestion]);

  useEffect(() => {
    if (answerSent.current === true) return;
    if (answer === null) return;
    if (secondsTillEnd > 0.1) return;

    console.log("sending answer", answer);

    socketAnswerQuestion(answer, true);
    answerSent.current = true;
  }, [secondsTillEnd, answer, socketAnswerQuestion]);

  useEffect(() => {
    const startTime =
      roomInfo.startTime + roomInfo.correctionTime - currentTime;
    const endTime = roomInfo.endTime + roomInfo.correctionTime - currentTime;

    setSecondsTillStart(parseInt(parseInt(startTime / 1000 + 1)));
    setSecondsTillEnd(endTime / 1000);
  }, [
    currentTime,
    roomInfo.currentQuestion,
    setSecondsTillStart,
    setSecondsTillEnd,
  ]);

  const attackerDefenderWrapper = (content) => {
    return (
      <div className="flex justify-center items-center">
        <motion.div
          className="w-[180px] h-[233px] mr-6 bg-slate-900/50 text-white rounded-xl rounded-b-[70px] rounded-tr-3xl border-slate-400/30 border-2 drop-shadow-[0_1px_40px_rgba(0,0,0,0.5)]"
          initial={{ scale: 0, x: 200 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-start items-center text-white/90">
            <GiSwordBrandish size={60} /> <div className="text-lg">Атакующий</div>
          </div>
          <div
            className="py-2 text-center text-lg font-semibold text-slate-900"
            style={{
              backgroundColor:
                PLAYER_COLORS[
                  roomInfo.playerColors[roomInfo.currentAttack.attacker]
                ],
            }}
          >
            {roomInfo.currentAttack.attacker}
          </div>
          <div className="flex justify-center mt-1">
            <Gravatar
              className={`m-2 border-[4px] rounded-full`}
              style={{
                borderColor:
                  PLAYER_COLORS[
                    roomInfo.playerColors[roomInfo.currentAttack.attacker]
                  ],
              }}
              email={roomInfo.emails[roomInfo.currentAttack.attacker]}
              size={100}
            />
          </div>
        </motion.div>
        {content}
        <motion.div
          className="w-[180px] h-[233px] ml-6 bg-slate-900/50 text-white rounded-xl rounded-b-[70px] rounded-tl-3xl border-slate-400/30 border-2 drop-shadow-[0_1px_40px_rgba(0,0,0,0.5)]"
          initial={{ scale: 0, x: -200 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-end items-center text-white/90">
            <div className="text-lg">Защитник</div>
            <GiSlashedShield size={60} className="p-[5px]" />
          </div>
          <div
            className="py-2 text-center text-lg font-semibold text-slate-900"
            style={{
              backgroundColor:
                PLAYER_COLORS[
                  roomInfo.playerColors[roomInfo.currentAttack.defender]
                ],
            }}
          >
            {roomInfo.currentAttack.defender}
          </div>
          <div className="flex justify-center mt-1">
            <Gravatar
              className={`m-2 border-[4px] rounded-full`}
              style={{
                borderColor:
                  PLAYER_COLORS[
                    roomInfo.playerColors[roomInfo.currentAttack.defender]
                  ],
              }}
              email={roomInfo.emails[roomInfo.currentAttack.defender]}
              size={100}
            />
          </div>
        </motion.div>
      </div>
    );
  };

  const content = () => {
    if (roomInfo.gameState === GAME_STATES.QUESTION_GUESS) {
      if (secondsTillStart > 3) return;

      if (secondsTillStart >= 1)
        return (
          <PrepareCounter
            seconds={secondsTillStart}
            involved={roomInfo.currentQuestion.involvedPlayers.includes(
              username
            )}
          />
        );

      if (
        submit ||
        secondsTillEnd < 0 ||
        !roomInfo.currentQuestion.involvedPlayers.includes(username)
      ) {
        // user already answered
        switch (roomInfo.currentQuestion.type) {
          case QUESTION_TYPES.NUMERIC:
            if (roomInfo.currentQuestion.involvedPlayers.length === 3)
              return <NumericResults />;
            return attackerDefenderWrapper(<NumericResults />);
          case QUESTION_TYPES.PICK:
            return attackerDefenderWrapper(<PickResults answer={answer} />);
          case QUESTION_TYPES.IMAGE:
            return attackerDefenderWrapper(<ImageResults answer={answer} />);
        }
      }

      // time is up
      if (secondsTillEnd < 0) {
        return;
      }

      // user has not answered yet and time is not up
      switch (roomInfo.currentQuestion.type) {
        case QUESTION_TYPES.NUMERIC:
          if (roomInfo.currentQuestion.involvedPlayers.length === 3)
            return (
              <NumericQuestion
                setAnswer={setAnswer}
                setSubmit={setSubmit}
                answer={answer}
              />
            );
          return attackerDefenderWrapper(
            <NumericQuestion
              setAnswer={setAnswer}
              setSubmit={setSubmit}
              answer={answer}
            />
          );
        case QUESTION_TYPES.PICK:
          return attackerDefenderWrapper(
            <PickQuestion setAnswer={setAnswer} setSubmit={setSubmit} />
          );
        case QUESTION_TYPES.IMAGE:
          return attackerDefenderWrapper(
            <ImageQuestion setAnswer={setAnswer} setSubmit={setSubmit} />
          );
      }
    }
    switch (roomInfo.currentQuestion.type) {
      case QUESTION_TYPES.NUMERIC:
        if (roomInfo.currentQuestion.involvedPlayers.length === 3)
          return <NumericResults />;
        return attackerDefenderWrapper(<NumericResults />);
      case QUESTION_TYPES.PICK:
        return attackerDefenderWrapper(<PickResults answer={answer} />);
      case QUESTION_TYPES.IMAGE:
        return attackerDefenderWrapper(<ImageResults answer={answer} />);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute w-full h-full bg-black/70 m-0 p-0 top-[0%] flex justify-center items-center transition-all z-20"
    >
      {content()}
    </motion.div>
  );
};
export default QuestionController;
