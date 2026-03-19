import "./styles/Career.css";

const certs = [
  {
    title: "Python for Data Science, AI & Dev",
    issuer: "IBM",
    date: "JUL 2024",
    id: "HXS8MB3KBZ7T"
  },
  {
    title: "Industrial Internet of Things (IIoT)",
    issuer: "University of Michigan",
    date: "MAY 2025",
    id: "95RLJJYBR42Q"
  },
  {
    title: "Machine Learning & Self-Driving Cars",
    issuer: "Udemy",
    date: "JUN 2025",
    id: "UC-e7c59ecd-0230-43b7-8692-2753d9ee2439"
  },
  {
    title: "Basics of Cloud Computing",
    issuer: "Udemy",
    date: "JUN 2025",
    id: "UC-56a53e40-2d00-4d85-bc18-c0e2e442f67a"
  },
  {
    title: "Data Science & Machine Learning",
    issuer: "Udemy",
    date: "JUN 2025",
    id: "UC-ed926dcf-9247-4368-a9b6-de0c234f04b2"
  },
  {
    title: "Python Automation Bootcamp",
    issuer: "Udemy",
    date: "JUL 2025",
    id: "UC-b02cal-ab-83b6-43fa-a5c9-8f9338910cab"
  },
  {
    title: "AI Essentials",
    issuer: "Udemy",
    date: "JUL 2025",
    id: "UC-d2ac7858-6c68-4ad6-ab55-a86377775051"
  },
  {
    title: "Building LLM Applications",
    issuer: "Udemy",
    date: "JUL 2025",
    id: "UC-02b835be-15fd-4649-97b6-a065a2ee4lI"
  },
  {
    title: "Senior Exec: AI, Robotics",
    issuer: "Udemy",
    date: "FEB 2026",
    id: "UC-8ac25efd-3ea8-4b7b-b757-e221b4f9faaa"
  }
];

const Certifications = () => {
  return (
    <div className="career-section section-container" id="certifications">
      <div className="career-container">
        <h2>
          My <span>Certifications</span>
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '3rem', width: '100%', justifyContent: 'center' }}>
          {certs.map((cert, index) => (
            <div key={index} style={{ 
              flex: '1 1 30%',
              minWidth: '280px',
              boxSizing: 'border-box',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '25px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <div>
                <h4 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 10px 0', lineHeight: '1.3' }}>{cert.title}</h4>
                <h5 style={{ fontSize: '15px', color: 'var(--accentColor)', margin: '0 0 20px 0' }}>{cert.issuer}</h5>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 400, margin: '0 0 15px 0', opacity: 0.9 }}>{cert.date}</h3>
                <p style={{ margin: 0, fontSize: '13px', opacity: 0.7, wordBreak: 'break-all' }}>
                  Credential ID: <br /><span style={{ fontFamily: 'monospace', color: '#ffb94f' }}>{cert.id}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
