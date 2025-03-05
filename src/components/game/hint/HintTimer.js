import React, { useEffect, useState, useCallback } from "react";
import useCurrentTime from "../../../hooks/useCurrentTime";

const barWidth = 248;

const HintTimer = ({ startTime, endTime, warn }) => {
  const [progressBarPixels, setProgressBarPixels] = useState(barWidth);
  const currentTime = useCurrentTime();

  const calculateBarPixels = useCallback(() => {
    if (currentTime < startTime) return barWidth;
    if (currentTime > endTime) return 4;

    return (
      4 +
      barWidth -
      barWidth * ((currentTime - startTime) / (endTime - startTime))
    );
  }, [currentTime, startTime, endTime]);

  useEffect(() => {
    setProgressBarPixels(calculateBarPixels());
  }, [currentTime, calculateBarPixels]);

  return (
    <div className="flex justify-center items-center">
      <div className={`flex bg-white w-[240px] h-2.5 rounded-md m-3 mb-4`}>
        <div
          className={`flex bg-blue-500  h-2.5 rounded-l-md ${
            warn ? "animate-pulse bg-red-500" : null
          }`}
          style={{ width: `${progressBarPixels}px` }}
        ></div>
      </div>
    </div>
  );
};

export default HintTimer;
