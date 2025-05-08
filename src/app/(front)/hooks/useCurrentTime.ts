import { useState, useEffect } from "react";

export const useCurrentTime = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    now,
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
};
