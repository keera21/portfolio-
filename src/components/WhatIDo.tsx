import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
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
            style={{ width: '100%', height: '100%', minHeight: '100%', padding: '50px' }}
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

            <div className="what-content-in" style={{ opacity: 1, paddingRight: '20px' }}>
              <h3 style={{ fontSize: '42px', marginBottom: '10px' }}>ROBOTICS & AI</h3>
              <h4 style={{ fontSize: '18px', opacity: 0.6, marginBottom: '20px' }}>Autonomous Systems & Embedded Software</h4>
              <p style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '0.5px' }}>
                Developing control systems, AI models, and embedded software for physical platforms. From SLAM and computer vision algorithms down to programming microcontrollers and designing mechanical components with SolidWorks, I bridge the gap between complex software logic and physical hardware arrays.
              </p>
              <h5 style={{ fontSize: '14px', marginTop: '30px' }}>Skillset & tools</h5>
              <div className="what-content-flex" style={{ gap: '10px', marginTop: '15px' }}>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>ROS2</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>Nav2</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>Gazebo</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>RViz</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>SLAM</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>OpenCV</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>TensorFlow</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>Q-learning</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>Python</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>C/C++</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>Arduino</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>Motor Control</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>Sensor Integration</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>SolidWorks</div>
                <div className="what-tags" style={{ fontSize: '14px', padding: '5px 12px' }}>MATLAB</div>
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
