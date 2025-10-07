import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (!state?.restoreScroll) {
      window.scrollTo(0, 0);
    }
  }, [pathname, state]);

  return null;
};
export default ScrollToTop;
