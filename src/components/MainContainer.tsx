import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Certifications from "./Certifications";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import { usePerformance } from "../context/PerformanceProvider";
import { setCharTimeline, setAllTimeline } from "./utils/GsapScroll";

const MainContainer = ({ children }: PropsWithChildren) => {
  const { isLowPerformance } = usePerformance();
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  useEffect(() => {
    // If in Performance Mode, initialize scroll timelines immediately
    // because the 3D character compiling thread is bypassed.
    if (isLowPerformance) {
      setCharTimeline(null);
      setAllTimeline();
    }
  }, [isLowPerformance]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Work />
            <Career />
            <Certifications />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
