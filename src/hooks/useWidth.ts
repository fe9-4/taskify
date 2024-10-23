"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export const useWidth = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const handleResize = useDebounce(() => {
    setIsLargeScreen(window.innerWidth >= 768);
  }, 200);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isLargeScreen };
};
