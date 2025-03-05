import { useState, useEffect } from "react";

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 32);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};

export default useCurrentTime;
