import { useState, useContext, useEffect } from "react";
import CalculatorNumber from "./CalculatorNumber";
import { BiPlay } from "react-icons/bi";
import { BsBackspace } from "react-icons/bs";
import QuestionTimer from "../QuestionTimer";
import SocketContext from "../../../../context/SocketContext";
import { motion } from "framer-motion";

const isWholeNumber = (str) => Number.isInteger(Number(str));

const NumericQuestion = ({ setAnswer, setSubmit, answer }) => {
  const { roomInfo } = useContext(SocketContext);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (isNaN(parseInt(input))) return;
    if (!isWholeNumber(input)) return;

    setAnswer(parseInt(input));
  }, [input, setAnswer]);

  const undoLastNumber = () => {
    if (input.length === 1) {
      setInput("0");
      return;
    }

    setInput(input.slice(0, -1));
  };

  const addNumber = (number) => {
    if (input.length > 7) return;
    if (input.length === 1 && input[0] === "0") {
      setInput(number);
      return;
    }

    setInput(input + number);
  };

  const handleInput = (e) => {
    e.preventDefault();

    if (e.target.value.length > 8) return;
    if (!isWholeNumber(e.target.value)) return;

    setInput(e.target.value);
  };

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      submitInput();
    }
  };

  const handleButtonSubmit = (e) => {
    e.preventDefault();

    submitInput();
  };

  const submitInput = () => {
    if (answer) setSubmit(true);
  };

  return (
    <motion.div
      className="question drop-shadow-[0_1px_40px_rgba(0, 0, 0, 0.5)]"
      animate={{ scale: 1 }}
      initial={{ scale: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="question-question-div">
        <div className="question-question max-w-[540px]">
          {roomInfo.currentQuestion.question}{" "}
          <span className="question-category">
            {roomInfo.currentQuestion.category}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center mt-2">
        <div className="m-2 p-2 rounded-md border-white/40 border-2 bg-slate-700 drop-shadow-[0_1px_20px_rgba(255,255,255,0.1)]">
          <div className="flex justify-center items-center my-2">
            <input
              onKeyDown={handleInputSubmit}
              autoFocus={true}
              className="rounded-sm m-2 h-14 w-72 text-blue-900 font-semibold p-2 text-center text-4xl bg-slate-100"
              value={input}
              placeholder={input}
              onChange={handleInput}
              onClick={(e) => {
                e.target.value = "";
              }}
              onBlur={(e) => {
                e.target.value = input;
              }}
            />
          </div>
          <div className="flex mx-2">
            <CalculatorNumber number={"7"} addNumber={addNumber} />
            <CalculatorNumber number={"8"} addNumber={addNumber} />
            <CalculatorNumber number={"9"} addNumber={addNumber} />
            <CalculatorNumber number={"0"} addNumber={addNumber} />
            <button
              onClick={undoLastNumber}
              className="w-[62px] h-[54px] m-1 bg-slate-500 hover:bg-slate-400 transition-all rounded-md border-white/40 border-4 flex justify-center items-center"
            >
              <BsBackspace size={30} />
            </button>
          </div>
          <div className="flex mx-2">
            <div>
              <div className="flex">
                <CalculatorNumber number={"4"} addNumber={addNumber} />
                <CalculatorNumber number={"5"} addNumber={addNumber} />
                <CalculatorNumber number={"6"} addNumber={addNumber} />
              </div>
              <div className="flex">
                <CalculatorNumber number={"1"} addNumber={addNumber} />
                <CalculatorNumber number={"2"} addNumber={addNumber} />
                <CalculatorNumber number={"3"} addNumber={addNumber} />
              </div>
            </div>
            <button
              onClick={handleButtonSubmit}
              className="w-[119px] m-2 bg-green-600 hover:bg-green-500 transition-all rounded-xl text-white font-bold text-3xl border-white/40 border-[6px] flex justify-center items-center"
            >
              <BiPlay size={100} />
            </button>
          </div>
        </div>
      </div>
      <QuestionTimer warn={true} />
    </motion.div>
  );
};

export default NumericQuestion;
