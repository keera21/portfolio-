import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-content-left">
            <div className="landing-intro-group">
              <h2 className="hello-text">Hello! I'm</h2>
              <h1 className="name-text">Bashaar Ahmed</h1>
              <h3 className="title-text">Mechatronics Engineer</h3>
              <h4 className="specializing-text">Specializing in</h4>
              <h2 className="focus-text">Autonomous Robotics</h2>
            </div>

            <div className="specialty-grid">
              <div className="specialty-card">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div className="card-title">System Integration</div>
              </div>

              <div className="specialty-card">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <path d="M7 8l3 3-3 3" />
                    <line x1="12" y1="14" x2="16" y2="14" />
                  </svg>
                </div>
                <div className="card-title">Algorithm Development</div>
              </div>

              <div className="specialty-card">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                    <path d="M12 6a6 6 0 0 1 6 6" />
                    <path d="M12 18a6 6 0 0 1-6-6" />
                    <path d="M12 22a10 10 0 0 1-10-10" />
                    <line x1="12" y1="12" x2="19" y2="5" />
                  </svg>
                </div>
                <div className="card-title">Sensor Fusion</div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
