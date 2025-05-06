"use client";

import { useEffect } from "react";

export const RegisterSW = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      register();
    }
  }, []);

  const register = async () => {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  };

  return <></>;
};
