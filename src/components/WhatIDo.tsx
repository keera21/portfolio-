import { useEffect, useRef, useState } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollRef.current) {
      if (isScrolled) {
        scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        setIsScrolled(false);
      } else {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        setIsScrolled(true);
      }
    }
  };

  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }
    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
    };
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch what-content-active"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className={`what-arrow ${isScrolled ? "scrolled" : ""}`} onClick={handleArrowClick}></div>

            <div className="what-content-in" ref={scrollRef}>
              <h3>ROBOTICS & AI</h3>
              <h4>Autonomous Systems & Embedded Software</h4>
              <p>
                Developing control systems, AI models, and embedded software for physical platforms. From SLAM and computer vision algorithms down to programming microcontrollers and designing mechanical components with SolidWorks, I bridge the gap between complex software logic and physical hardware arrays.
              </p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">ROS2</div>
                <div className="what-tags">Nav2</div>
                <div className="what-tags">Gazebo</div>
                <div className="what-tags">RViz</div>
                <div className="what-tags">SLAM</div>
                <div className="what-tags">OpenCV</div>
                <div className="what-tags">TensorFlow</div>
                <div className="what-tags">Q-learning</div>
                <div className="what-tags">Python</div>
                <div className="what-tags">C/C++</div>
                <div className="what-tags">Arduino</div>
                <div className="what-tags">Motor Control</div>
                <div className="what-tags">Sensor Integration</div>
                <div className="what-tags">SolidWorks</div>
                <div className="what-tags">MATLAB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
