import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoading } from "../context/LoadingProvider";
import "./styles/LidarCanvas.css";

const LidarCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webglRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const { setLoading } = useLoading();

  // Fast loading sequence
  useEffect(() => {
    let percent = 0;
    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 8) + 5;
      if (percent >= 100) {
        setLoading(100);
        clearInterval(interval);
      } else {
        setLoading(percent);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [setLoading]);

  // 3D Procedural Holographic Rover (Three.js)
  useEffect(() => {
    const container = webglRef.current;
    if (!container) return;

    // 1. Setup Scene, Camera, and WebGLRenderer
    const scene = new THREE.Scene();
    
    let rect = container.getBoundingClientRect();
    let width = rect.width || 500;
    let height = rect.height || 500;

    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 1000);
    camera.position.set(5.5, 4.0, 10.5);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Glowing wireframe cyber materials
    const mainMaterial = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });

    const accentMaterial = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });

    const roverGroup = new THREE.Group();
    roverGroup.position.set(0, -0.45, 0);
    scene.add(roverGroup);

    // Chassis Box
    const chassisGeo = new THREE.BoxGeometry(2.0, 0.55, 1.1);
    const chassisMesh = new THREE.Mesh(chassisGeo, mainMaterial);
    chassisMesh.position.y = 0.45;
    roverGroup.add(chassisMesh);

    // Chassis Top Plate
    const topPlateGeo = new THREE.BoxGeometry(1.6, 0.08, 0.9);
    const topPlate = new THREE.Mesh(topPlateGeo, accentMaterial);
    topPlate.position.set(-0.1, 0.3, 0);
    chassisMesh.add(topPlate);

    // Cyber telemetry display box (Angled at rear)
    const screenGeo = new THREE.BoxGeometry(0.3, 0.35, 0.35);
    const screenMesh = new THREE.Mesh(screenGeo, mainMaterial);
    screenMesh.position.set(-0.7, 0.45, 0.2);
    screenMesh.rotation.y = 0.2;
    screenMesh.rotation.z = -0.15;
    chassisMesh.add(screenMesh);

    const antennaGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4);
    const antennaMesh = new THREE.Mesh(antennaGeo, mainMaterial);
    antennaMesh.position.set(-0.8, 0.6, -0.3);
    chassisMesh.add(antennaMesh);

    // Wheels & Axles
    const wheels: THREE.Mesh[] = [];
    const suspensionArms: THREE.Mesh[] = [];
    
    const wheelPositions = [
      { x: 0.75, y: 0.15, z: 0.68, right: true },
      { x: -0.75, y: 0.15, z: 0.68, right: true },
      { x: 0.75, y: 0.15, z: -0.68, right: false },
      { x: -0.75, y: 0.15, z: -0.68, right: false }
    ];

    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 12);
    const axleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 6);

    wheelPositions.forEach((pos) => {
      // Create axle / suspension arm
      const arm = new THREE.Mesh(axleGeo, mainMaterial);
      arm.rotation.x = Math.PI / 2;
      arm.position.set(pos.x, pos.y, pos.right ? 0.45 : -0.45);
      chassisMesh.add(arm);
      suspensionArms.push(arm);

      // Create Wheel
      const wheel = new THREE.Mesh(wheelGeo, accentMaterial);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(pos.x, pos.y - 0.2, pos.z);
      roverGroup.add(wheel);
      wheels.push(wheel);
    });

    // LiDAR Sensor Dome
    const lidarBaseGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.2, 8);
    const lidarBase = new THREE.Mesh(lidarBaseGeo, mainMaterial);
    lidarBase.position.set(0.5, 0.38, 0);
    chassisMesh.add(lidarBase);

    const lidarScannerGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.22, 10);
    const lidarScanner = new THREE.Mesh(lidarScannerGeo, highlightMaterial);
    lidarScanner.position.y = 0.2;
    lidarBase.add(lidarScanner);

    // Dynamic Scanning beam Fan shape
    const beamGeo = new THREE.CylinderGeometry(0, 2.5, 0.8, 8, 1, true, 0, Math.PI * 0.25);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const scanningBeam = new THREE.Mesh(beamGeo, beamMaterial);
    scanningBeam.position.set(0, 0, 1.25);
    scanningBeam.rotation.x = Math.PI / 2;
    lidarScanner.add(scanningBeam);

    // Front-mounted Robotic arm base
    const armBaseRotationGroup = new THREE.Group();
    armBaseRotationGroup.position.set(0.65, 0.3, 0);
    chassisMesh.add(armBaseRotationGroup);

    // Shoulder sphere
    const shoulderJointGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const shoulderJoint = new THREE.Mesh(shoulderJointGeo, mainMaterial);
    armBaseRotationGroup.add(shoulderJoint);

    // Shoulder pitch
    const shoulderPitchGroup = new THREE.Group();
    shoulderJoint.add(shoulderPitchGroup);

    // Upper arm link
    const upperArmGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
    const upperArm = new THREE.Mesh(upperArmGeo, mainMaterial);
    upperArm.position.y = 0.45;
    shoulderPitchGroup.add(upperArm);

    // Elbow sphere
    const elbowJointGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const elbowJoint = new THREE.Mesh(elbowJointGeo, highlightMaterial);
    elbowJoint.position.y = 0.45;
    upperArm.add(elbowJoint);

    // Elbow pitch
    const elbowPitchGroup = new THREE.Group();
    elbowJoint.add(elbowPitchGroup);

    // Forearm link
    const forearmGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.75, 8);
    const forearm = new THREE.Mesh(forearmGeo, mainMaterial);
    forearm.position.y = 0.38;
    elbowPitchGroup.add(forearm);

    // Wrist sphere
    const wristJointGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const wristJoint = new THREE.Mesh(wristJointGeo, mainMaterial);
    wristJoint.position.y = 0.38;
    forearm.add(wristJoint);

    // Wrist pitch
    const wristPitchGroup = new THREE.Group();
    wristJoint.add(wristPitchGroup);

    // Claw Gripper mount
    const mountGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8);
    const mount = new THREE.Mesh(mountGeo, mainMaterial);
    mount.position.y = 0.05;
    wristPitchGroup.add(mount);

    // Claws Left/Right
    const clawGeo = new THREE.BoxGeometry(0.03, 0.15, 0.06);
    const clawLeft = new THREE.Mesh(clawGeo, highlightMaterial);
    clawLeft.position.set(-0.06, 0.1, 0);
    mount.add(clawLeft);

    const clawRight = new THREE.Mesh(clawGeo, highlightMaterial);
    clawRight.position.set(0.06, 0.1, 0);
    mount.add(clawRight);

    // Ground Schematic Blueprint Circles
    const blueprints: THREE.Mesh[] = [];
    const ring1Geo = new THREE.RingGeometry(1.2, 1.23, 40);
    const ring2Geo = new THREE.RingGeometry(1.8, 1.84, 40);
    const ring3Geo = new THREE.RingGeometry(2.5, 2.53, 40);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      wireframe: true
    });

    const ring1 = new THREE.Mesh(ring1Geo, ringMaterial);
    const ring2 = new THREE.Mesh(ring2Geo, ringMaterial);
    const ring3 = new THREE.Mesh(ring3Geo, ringMaterial);

    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.x = Math.PI / 2;
    ring3.rotation.x = Math.PI / 2;

    roverGroup.add(ring1);
    roverGroup.add(ring2);
    roverGroup.add(ring3);

    blueprints.push(ring1, ring2, ring3);

    // Scroll and Mouse listeners
    let scrollPercent = 0;
    const getScrollPercent = () => {
      const h = document.documentElement;
      const b = document.body;
      const st = "scrollTop";
      const sh = "scrollHeight";
      return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
    };

    const onScroll = () => {
      scrollPercent = getScrollPercent() || 0;
    };
    window.addEventListener("scroll", onScroll);

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      if (!container) return;
      rect = container.getBoundingClientRect();
      width = rect.width || 500;
      height = rect.height || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", resize);

    // Render and animation loop
    const animate3D = () => {
      animationFrameId = requestAnimationFrame(animate3D);
      time += 0.01;

      // Rotate ground circles in opposing directions
      ring1.rotation.z = time * 0.15;
      ring2.rotation.z = -time * 0.1;
      ring3.rotation.z = time * 0.05;

      // Rotate LiDAR scanner dome
      lidarScanner.rotation.y = time * 2.2;

      // Roll wheels slowly (idle travel simulation)
      wheels.forEach((w) => {
        w.rotation.y = time * 0.6;
      });

      // Organic hover floating of the chassis
      chassisMesh.position.y = 0.45 + Math.sin(time * 1.5) * 0.025;

      const mouse = mouseRef.current;
      let targetX = 0;
      let targetY = 0;

      if (mouse.active) {
        const cX = rect.left + width / 2;
        const cY = rect.top + height / 2;
        targetX = (mouse.x - cX) / (width / 2);
        targetY = -(mouse.y - cY) / (height / 2);
      }

      // Rover chassis tilts slightly to face the mouse
      if (mouse.active) {
        chassisMesh.rotation.y = THREE.MathUtils.lerp(chassisMesh.rotation.y, targetX * 0.12, 0.05);
        chassisMesh.rotation.x = THREE.MathUtils.lerp(chassisMesh.rotation.x, targetY * 0.08, 0.05);
      } else {
        chassisMesh.rotation.y = THREE.MathUtils.lerp(chassisMesh.rotation.y, 0, 0.05);
        chassisMesh.rotation.x = THREE.MathUtils.lerp(chassisMesh.rotation.x, 0, 0.05);
      }

      // Robotic arm tracks cursor yaw & pitch
      if (mouse.active) {
        armBaseRotationGroup.rotation.y = THREE.MathUtils.lerp(
          armBaseRotationGroup.rotation.y,
          targetX * 0.8,
          0.05
        );
      } else {
        armBaseRotationGroup.rotation.y = THREE.MathUtils.lerp(
          armBaseRotationGroup.rotation.y,
          0,
          0.05
        );
      }

      const shoulderBendBase = Math.sin(time * 0.5) * 0.08 + 0.1;
      const shoulderBendMouse = mouse.active ? targetY * 0.2 : 0;
      shoulderPitchGroup.rotation.z = THREE.MathUtils.lerp(
        shoulderPitchGroup.rotation.z,
        shoulderBendBase + shoulderBendMouse,
        0.05
      );

      const elbowBendBase = Math.cos(time * 0.5) * 0.12 + 0.25;
      const elbowBendMouse = mouse.active ? -targetY * 0.3 : 0;
      elbowPitchGroup.rotation.z = THREE.MathUtils.lerp(
        elbowPitchGroup.rotation.z,
        elbowBendBase + elbowBendMouse,
        0.05
      );

      // Gripper claws breathe open/close
      const clawSpread = 0.06 + Math.sin(time * 3) * 0.015;
      clawLeft.position.x = -clawSpread;
      clawRight.position.x = clawSpread;

      // Emphasize scale pulse on scanning hover pings
      const targetScale = mouse.active ? 1.05 : 1.0;
      roverGroup.scale.setScalar(
        THREE.MathUtils.lerp(roverGroup.scale.x, targetScale, 0.08)
      );

      // Camera responds slightly to scrolling
      camera.position.y = 4.0 - scrollPercent * 1.5;
      camera.position.z = 10.5 + scrollPercent * 4.5;
      camera.lookAt(0, 0.1, 0);

      renderer.render(scene, camera);
    };

    animate3D();

    // Cleanup 3D resources
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      
      chassisGeo.dispose();
      topPlateGeo.dispose();
      screenGeo.dispose();
      antennaGeo.dispose();
      wheelGeo.dispose();
      axleGeo.dispose();
      lidarBaseGeo.dispose();
      lidarScannerGeo.dispose();
      beamGeo.dispose();
      shoulderJointGeo.dispose();
      upperArmGeo.dispose();
      elbowJointGeo.dispose();
      forearmGeo.dispose();
      wristJointGeo.dispose();
      mountGeo.dispose();
      clawGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();

      mainMaterial.dispose();
      accentMaterial.dispose();
      highlightMaterial.dispose();
      beamMaterial.dispose();
      ringMaterial.dispose();
      
      renderer.dispose();
      
      if (container && renderer.domElement.parentElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2D LiDAR canvas (SLAM sweeping networks)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const particles: Particle[] = [];
    const particleCount = 75;
    const connectionDistance = 120;
    const mouseScanRadius = 185;
    let sweepAngle = 0;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      baseOpacity: number;
      pulseSpeed: number;
      pulsePhase: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 1.5 + 1.2;
        this.baseOpacity = Math.random() * 0.4 + 0.3;
        this.opacity = this.baseOpacity;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.pulsePhase += this.pulseSpeed;
        this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.15;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 234, 212, ${this.opacity})`;
        ctx.fill();

        if (this.opacity > 0.7) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(94, 234, 212, 0.05)`;
          ctx.fill();
        }
      }
    }

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || window.innerWidth;
      height = rect?.height || window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radarRadius = Math.min(width, height) * 0.38;

      // Draw Holographic Circular Spanning Sectors (Radar Grids)
      ctx.strokeStyle = "rgba(94, 234, 212, 0.04)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      // Axis lines with dashes
      ctx.strokeStyle = "rgba(94, 234, 212, 0.02)";
      ctx.setLineDash([5, 10]);
      ctx.beginPath();
      ctx.moveTo(centerX - radarRadius * 1.1, centerY);
      ctx.lineTo(centerX + radarRadius * 1.1, centerY);
      ctx.moveTo(centerX, centerY - radarRadius * 1.1);
      ctx.lineTo(centerX, centerY + radarRadius * 1.1);
      ctx.stroke();
      ctx.setLineDash([]);

      // Animated LiDAR radar scanning sweep line
      sweepAngle += 0.004;
      const sweepX = centerX + Math.cos(sweepAngle) * radarRadius;
      const sweepY = centerY + Math.sin(sweepAngle) * radarRadius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = "rgba(94, 234, 212, 0.07)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Update & Render SLAM Nodes
      particles.forEach((p) => {
        p.update();

        const angleToParticle = Math.atan2(p.y - centerY, p.x - centerX);
        let angleDiff = Math.abs(angleToParticle - (sweepAngle % (Math.PI * 2)));
        if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
        if (angleDiff < 0.18) {
          p.opacity = Math.min(1.0, p.opacity + 0.45);
        }

        p.draw();
      });

      // Render SLAM interconnecting mesh networks
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(94, 234, 212, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      // Render Active Laser Telemetry from Mouse cursor
      const mouse = mouseRef.current;
      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(94, 234, 212, 0.85)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(94, 234, 212, 0.25)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        particles.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseScanRadius) {
            const alpha = (1 - dist / mouseScanRadius) * 0.28;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(94, 234, 212, ${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();

            p.vx += (dx / dist) * 0.012;
            p.vy += (dy / dist) * 0.012;
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="lidar-container character-model">
      <div className="character-rim"></div>
      <canvas ref={canvasRef} className="lidar-canvas" />
      
      {/* 3D WebGL Holographic Rover */}
      <div ref={webglRef} className="robot-3d-container"></div>
      
      {/* 3D Telemetry Callouts Overlay */}
      <div className="telemetry-overlay">
        <div className="telemetry-callout callout-lidar">
          <div className="callout-dot"></div>
          <div className="callout-line"></div>
          <div className="callout-content">
            <span className="callout-label">LiDAR Sensor Array</span>
            <span className="callout-value">3D Mapping & SLAM</span>
          </div>
        </div>

        <div className="telemetry-callout callout-arm">
          <div className="callout-dot"></div>
          <div className="callout-line"></div>
          <div className="callout-content">
            <span className="callout-label">Multi-DOF Robotic Arm</span>
            <span className="callout-value">Object Manipulation</span>
          </div>
        </div>

        <div className="telemetry-callout callout-control">
          <div className="callout-dot"></div>
          <div className="callout-line"></div>
          <div className="callout-content">
            <span className="callout-label">AI Control Stack</span>
            <span className="callout-value">Autonomous Navigation</span>
          </div>
        </div>

        <div className="telemetry-callout callout-sensor">
          <div className="callout-dot"></div>
          <div className="callout-line"></div>
          <div className="callout-content">
            <span className="callout-label">AK Sensor Mode</span>
            <span className="callout-value">Sarlation Telemetry</span>
          </div>
        </div>
      </div>

      <div className="lidar-status">
        <span className="lidar-pulse-dot"></span>
        SLAM LOCALIZATION SYSTEM // ACTIVE // 60 FPS
      </div>
    </div>
  );
};

export default LidarCanvas;
