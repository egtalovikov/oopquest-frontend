import useCurrentTime from "../../hooks/useCurrentTime";

const GameStatus = ({ roomInfo }) => {
  const currentTime = useCurrentTime();

  return (
    <div className="text-md text-white absolute top-[7%] left-[19%] opacity-80">
      <div>gameState: {roomInfo.gameState} </div>
      <div>gameStage: {roomInfo.gameStage} </div>
      {roomInfo.currentQuestion && roomInfo.startTime ? (
        <div
          className={`${
            roomInfo.startTime < currentTime ? "text-green-400" : "text-white"
          }`}
        >
          starTime: {roomInfo.startTime}
        </div>
      ) : null}
      <div className="text-yellow-200">currTime: {currentTime}</div>
      {roomInfo.currentQuestion && roomInfo.endTime ? (
        <div
          className={`${
            roomInfo.endTime < currentTime ? "text-red-400" : "text-white"
          }`}
        >
          endTime: {roomInfo.endTime}
        </div>
      ) : null}
      <div>
        currentPick:
        {roomInfo.currentPick ? JSON.stringify(roomInfo.currentPick) : null}
      </div>
      <div>
        currentAttack:
        {roomInfo.currentAttack ? JSON.stringify(roomInfo.currentAttack) : null}
      </div>
    </div>
  );
};

export default GameStatus;
