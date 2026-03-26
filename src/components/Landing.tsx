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
            <h3 className="landing-mechatronics">Mechatronics Engineer</h3>
            <h4 className="landing-specializing">specializing in</h4>
            <h2 className="landing-robotics">AUTONOMOUS ROBOTICS</h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
