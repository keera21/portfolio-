import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

type Project = {
  title: string;
  category: string;
  tools: string;
  details: string[];
  image: string;
  youtubeId?: string;
};

const projects: Project[] = [
  {
    title: "Autonomous Rover (Ongoing)",
    category: "Robotics Platform",
    tools: "Arduino, ROS2, SLAM, LiDAR, Gazebo, RViz",
    details: [
      "Developing a 6-motor differential drive rover (3 motors per side) using Arduino and H-bridge motor drivers with Bluetooth-based remote control.",
      "Designed a dual-motor linkage suspension mechanism enabling terrain adaptation, improving obstacle traversal capability.",
      "Implemented custom motor control logic for forward, reverse, and turning with 100% directional control reliability during field testing.",
      "Integrating a robotic arm for object manipulation, transforming the rover into a multi-purpose autonomous robotic platform.",
      "Currently developing a ROS2-based autonomous navigation stack, integrating SLAM algorithms for real-time mapping and localization using LiDAR.",
      "Simulating rover dynamics and navigation in Gazebo, with sensor visualization and debugging using RViz, achieving 90% navigation accuracy."
    ],
    image: "/images/rover.png",
  },
  {
    title: "Autonomous Warehouse Delivery Robot",
    category: "ROS2 & Nav2 Simulation",
    tools: "ROS2, Nav2, EKF, Python, URDF",
    details: [
      "Designed and simulated a fully autonomous warehouse delivery robot using ROS 2 and Nav2 capable of continuous pickup–delivery cycles.",
      "Built a custom differential drive robot (sam_bot) with LiDAR and IMU sensors using URDF/Xacro, achieving reliable navigation and obstacle avoidance.",
      "Implemented sensor fusion using an Extended Kalman Filter (EKF) via the robot_localization package, reducing rotational drift by ~85%.",
      "Diagnosed and resolved Gazebo physics instability (\"square tire effect\") by redesigning wheel collision geometry, improving turn stability by ~70%.",
      "Tuned AMCL localization parameters, increasing navigation reliability from ~60% to over 95% successful delivery cycles.",
      "Developed a Python automation manager using the Nav2 Simple Commander API to execute infinite autonomous delivery loops."
    ],
    image: "/images/warehouse.png",
    youtubeId: "BqmDK1Tme38",
  },
  {
    title: "Sumo-Robo (Competition)",
    category: "Hardware & Control",
    tools: "Robotics Control Logic · Embedded Systems Integration · Arduino Programming · Robotics Simulation",
    details: [
      "Designed and developed a competitive autonomous sumo robot focusing on mechanical robustness, electrical design, and embedded control.",
      "Designed a custom 1 mm thick metal chassis to maximize durability, traction, and impact resistance during matches.",
      "Integrated 4 high-torque Henkwell DC motors (142 RPM) delivering ~30 N force each for aggressive pushing performance.",
      "Developed the complete electrical schematic using Proteus, including Arduino control, L298N motor driver, and Bluetooth communication.",
      "Powered the system using a 6S Li-Po battery for high current delivery, and implemented wireless control via Bluetooth for real-time testing.",
      "🏆 Achievement: Winner of Sumo Robot Competition (5–0 margin) at the Mechatronics Department, Mehran University of Engineering & Technology."
    ],
    image: "/images/sumo.png",
  },
  {
    title: "Automated Solar Panel System",
    category: "Associated with Mehran University of Engineering and Technology",
    tools: "Motor Control · Circuit Design & Wiring · Renewable Energy Concepts · Embedded Systems Integration",
    details: [
      "This was a group project where I took full responsibility for all the electronics aspects, including wiring, programming the Arduino, calibrating the sensors, and debugging the entire system.",
      "Using two LDR sensors and servo motors, I developed the automated tracking mechanism that adjusts the solar panel’s position to follow the sun and improve energy collection.",
      "An Arduino Uno microcontroller is used as the brain of the system. It reads analog values from the LDRs and processes the data to control the servos accordingly. A 9V battery powers the Arduino, while a 12V, 10-watt solar panel is used to simulate real solar energy collection.",
      "Calibration of the sensors and motors was carefully handled to ensure precise movement and responsiveness.",
      "This system increases the efficiency of solar energy collection by ensuring the panel is always optimally aligned with the sun, especially useful for remote or off-grid applications.",
      "The project also emphasizes low-cost automation, easy integration, and practical application in renewable energy solutions."
    ],
    image: "/images/solar.png",
  },
  {
    title: "Robotic Arm Simulation, Automation & Motion Planning",
    category: "ROS 2 | Robotic Arm Simulation, Automation & Motion Planning | Mar 2026 - Present",
    tools: "Robot Operating System (ROS) · Kinematics · Robotics Control Logic · Robotics Simulation",
    details: [
      "Worked with the UR5 robotic arm, successfully simulating the robot in Gazebo for real-time physics-based simulation.",
      "Utilized RViz for complex point-to-point path planning, trajectory generation, and executing the robot’s precise movements.",
      "Implemented Python-based automation scripts to control the robotic arm, assigning specific movement patterns.",
      "Developed an automated workflow allowing the robotic arm to perform predefined, repetitive, and precise industrial operations without manual intervention."
    ],
    image: "",
    youtubeId: "C-k1JtXVgD0",
  },
  {
    title: "Q-learning GridWorld Simulation",
    category: "Reinforcement Learning",
    tools: "Python, NumPy, Pygame, Q-learning",
    details: [
      "Created a Python-based GridWorld using NumPy and Pygame.",
      "Implemented Q-learning for training autonomous agents.",
      "Built save/load functionality for Q-table reuse."
    ],
    image: "/images/gridworld.png",
  },
  {
    title: "Handwritten Digit Recognition",
    category: "Neural Networks",
    tools: "TensorFlow, Keras, MNIST",
    details: [
      "Developed and trained a neural network using TensorFlow and Keras on the MNIST dataset to recognize handwritten digits with high accuracy.",
      "Implemented custom testing using self-drawn digit images to evaluate model generalization and data preprocessing importance.",
      "Strengthened understanding of neural networks and visual pattern recognition."
    ],
    image: "/images/digit.png",
  },
  {
    title: "Sign Language Recognition System",
    category: "Computer Vision",
    tools: "CNN, OpenCV",
    details: [
      "Real-time webcam integration with live prediction overlay.",
      "Trained a CNN on over 27,000 labeled ASL hand gestures.",
      "Achieved over 90% accuracy on test data."
    ],
    image: "/images/sign_language.png",
  }
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <ul className="carousel-description" style={{ marginTop: '10px', fontSize: '13px', lineHeight: '1.4', paddingLeft: '20px', textAlign: 'left', listStyle: 'disc' }}>
                          {project.details.map((detail, idx) => (
                            <li key={idx} style={{ marginBottom: '5px' }}>{detail}</li>
                          ))}
                        </ul>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                        <a 
                          href="https://www.linkedin.com/in/bashaar-ahmed-37573ab2/details/projects/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="linkedin-project-link"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '15px', color: '#fff', fontSize: '15px', textDecoration: 'none', borderBottom: '1px solid #fff', paddingBottom: '2px' }}
                          data-cursor="disable"
                        >
                          View full overview on LinkedIn <MdArrowForward />
                        </a>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      {project.youtubeId ? (
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${project.youtubeId}`} 
                          title={`${project.title} Video`} 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen
                          style={{ borderRadius: '10px' }}
                        ></iframe>
                      ) : (
                        <WorkImage image={project.image} alt={project.title} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
