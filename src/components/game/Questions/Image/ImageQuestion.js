import { useContext } from "react";
import QuestionTimer from "../QuestionTimer";
import SocketContext from "../../../../context/SocketContext";
import { motion } from "framer-motion";

const ImageQuestion = ({ setAnswer, setSubmit }) => {
  const { roomInfo } = useContext(SocketContext);

  const handleButtonClick = (idx) => {
    setAnswer(roomInfo.currentQuestion.possibleAnswers[idx]);
    setSubmit(true);
  };

  return (
    <motion.div
      className="question drop-shadow-[0_1px_40px_rgba(0, 0, 0, 0.5)]"
      animate={{ scale: 1 }}
      initial={{ scale: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="question-question-div">
        <div className="question-question max-w-[600px]">
          {roomInfo.currentQuestion.question}{" "}
          <span className="question-category">
            {roomInfo.currentQuestion.category}
          </span>
        </div>
      </div>
      <div className="image-quesiton-img-div">
        <img
          src={roomInfo.currentQuestion.image_url}
          alt="question"
          className="image-question-img"
        />
      </div>
      <div className="image-question-grid">
        {roomInfo.currentQuestion.possibleAnswers.map((answer, index) => (
          <div className="flex justify-center items-center" key={index}>
            <div
              onClick={() => {
                handleButtonClick(index);
              }}
              className="w-[340px] h-[60px] flex items-center justify-center m-2 p-2 rounded-md border-white/40 border-2 bg-slate-700 transition-all hover:bg-slate-600 cursor-pointer"
            >
              <p className="pick-question-answer">{answer}</p>
            </div>
          </div>
        ))}
      </div>
      <QuestionTimer warn={true} />
    </motion.div>
  );
};

export default ImageQuestion;
