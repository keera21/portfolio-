import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              Bashaar Ahmed
            </h1>
          </div>
          <div className="landing-info">
            <h3>Mechatronics Engineer</h3>
            <h2 className="landing-info-h2">
              <div style={{ whiteSpace: "nowrap" }}>Specializing&nbsp;in</div>
            </h2>
            <h2>
              <div className="landing-h2-info" style={{ whiteSpace: "nowrap" }}>Autonomous&nbsp;Robotics</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
