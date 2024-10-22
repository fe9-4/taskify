"use client";

import { useEffect, useState } from "react";

export const useWidth = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const handleResize = () => {
    setIsLargeScreen(window.innerWidth >= 768);
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isLargeScreen };
};
