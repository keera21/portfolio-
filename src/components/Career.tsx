import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Experience <span>&</span>
          <br /> Volunteering
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Logistics Coordinator</h4>
                <h5>NASA Space Apps</h5>
              </div>
              <h3>OCT '25</h3>
            </div>
            <p>
              Served as Logistics Coordinator for NASA’s Space Apps Challenge. 
              Managed event operations, registrations, and participant coordination, facilitating communication across teams.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Community Volunteer</h4>
                <h5>Alkhidmat Foundation</h5>
              </div>
              <h3>DEC '25</h3>
            </div>
            <p>
              Participated in a community service program focused on social welfare initiatives.
              Coordinated team activities and assisted in organizing community outreach programs.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Volunteer</h4>
                <h5>Youth Nexus</h5>
              </div>
              <h3>AUG '25</h3>
            </div>
            <p>
              Participated in a large-scale sustainability initiative. Engaged the local community in discussions on climate action, planted trees, and cleaned neglected spaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
