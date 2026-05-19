import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoading } from "../context/LoadingProvider";
import "./styles/LidarCanvas.css";

const LidarCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webglRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const { setLoading } = useLoading();

  useEffect(() => {
    // Fast-forward loading progress to 100% smoothly since LiDAR loads instantly
    let percent = 0;
    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 8) + 5; // Organic quick steps
      if (percent >= 100) {
        setLoading(100);
        clearInterval(interval);
      } else {
        setLoading(percent);
      }
    }, 20); // Quick loading feel
    return () => clearInterval(interval);
  }, [setLoading]);

  // 3D Procedural Holographic Robotic Joint Arm manipulator
  useEffect(() => {
    const container = webglRef.current;
    if (!container) return;

    // 1. Setup Scene, Camera, and WebGLRenderer
    const scene = new THREE.Scene();
    
    let rect = container.getBoundingClientRect();
    let width = rect.width || 400;
    let height = rect.height || 400;

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 13.5); // Position camera beautifully centered
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Create the procedural robotic joint manipulator arm
    const robotMaterial = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });

    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Pedestal base
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 16);
    const baseMesh = new THREE.Mesh(baseGeo, robotMaterial);
    baseMesh.position.y = 0.2;
    robotGroup.add(baseMesh);

    // Shoulder joint structure (Rotates base yaw)
    const baseRotationGroup = new THREE.Group();
    baseMesh.add(baseRotationGroup);

    // Shoulder spherical joint
    const shoulderJointGeo = new THREE.SphereGeometry(0.45, 8, 8);
    const shoulderJoint = new THREE.Mesh(shoulderJointGeo, robotMaterial);
    shoulderJoint.position.y = 0.4;
    baseRotationGroup.add(shoulderJoint);

    // Shoulder joint pitch group
    const shoulderPitchGroup = new THREE.Group();
    shoulderJoint.add(shoulderPitchGroup);

    // Shoulder link (Upper arm segment)
    const upperLinkGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 8);
    const upperLink = new THREE.Mesh(upperLinkGeo, robotMaterial);
    upperLink.position.y = 1.1;
    shoulderPitchGroup.add(upperLink);

    // Elbow spherical joint
    const elbowJointGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const elbowJoint = new THREE.Mesh(elbowJointGeo, robotMaterial);
    elbowJoint.position.y = 1.1;
    upperLink.add(elbowJoint);

    // Elbow pitch group
    const elbowPitchGroup = new THREE.Group();
    elbowJoint.add(elbowPitchGroup);

    // Forearm link (Lower arm segment)
    const lowerLinkGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 8);
    const lowerLink = new THREE.Mesh(lowerLinkGeo, robotMaterial);
    lowerLink.position.y = 0.9;
    elbowPitchGroup.add(lowerLink);

    // Wrist joint
    const wristJointGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const wristJoint = new THREE.Mesh(wristJointGeo, robotMaterial);
    wristJoint.position.y = 0.9;
    lowerLink.add(wristJoint);

    // Wrist pitch/roll group
    const wristPitchGroup = new THREE.Group();
    wristJoint.add(wristPitchGroup);

    // Gripper mount / Tool head
    const gripperMountGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 8);
    const gripperMount = new THREE.Mesh(gripperMountGeo, robotMaterial);
    gripperMount.position.y = 0.1;
    wristPitchGroup.add(gripperMount);

    // Claws (End Effector)
    const clawGeo = new THREE.BoxGeometry(0.08, 0.4, 0.15);
    const clawLeft = new THREE.Mesh(clawGeo, robotMaterial);
    clawLeft.position.set(-0.15, 0.3, 0);
    gripperMount.add(clawLeft);

    const clawRight = new THREE.Mesh(clawGeo, robotMaterial);
    clawRight.position.set(0.15, 0.3, 0);
    gripperMount.add(clawRight);

    // 3. Setup Scroll and Mouse Listeners
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
      width = rect.width || 400;
      height = rect.height || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", resize);

    // 4. Render and animation loop
    const animate3D = () => {
      animationFrameId = requestAnimationFrame(animate3D);
      time += 0.01;

      // Organic base sweep yaw
      baseRotationGroup.rotation.y = time * 0.15;

      const mouse = mouseRef.current;
      let targetX = 0;
      let targetY = 0;

      if (mouse.active) {
        const cX = rect.left + width / 2;
        const cY = rect.top + height / 2;
        targetX = (mouse.x - cX) / (width / 2);
        targetY = -(mouse.y - cY) / (height / 2);
      }

      // Base turns to face the mouse cursor yaw
      if (mouse.active) {
        baseRotationGroup.rotation.y = THREE.MathUtils.lerp(
          baseRotationGroup.rotation.y,
          targetX * 0.9,
          0.05
        );
      }

      // Joint bend equations reacting to time, mouse hover, and page scroll
      const shoulderBendBase = Math.sin(time * 0.5) * 0.15 - 0.2;
      const shoulderBendMouse = mouse.active ? targetY * 0.25 : 0;
      const shoulderBendScroll = scrollPercent * 1.35;
      shoulderPitchGroup.rotation.z = THREE.MathUtils.lerp(
        shoulderPitchGroup.rotation.z,
        shoulderBendBase + shoulderBendMouse - shoulderBendScroll,
        0.06
      );

      const elbowBendBase = Math.cos(time * 0.5) * 0.25 + 0.35;
      const elbowBendMouse = mouse.active ? -targetY * 0.35 : 0;
      const elbowBendScroll = scrollPercent * 1.55;
      elbowPitchGroup.rotation.z = THREE.MathUtils.lerp(
        elbowPitchGroup.rotation.z,
        elbowBendBase + elbowBendMouse + elbowBendScroll,
        0.06
      );

      const wristBendBase = Math.sin(time) * 0.1;
      const wristBendScroll = -scrollPercent * 0.8;
      wristPitchGroup.rotation.z = THREE.MathUtils.lerp(
        wristPitchGroup.rotation.z,
        wristBendBase + wristBendScroll,
        0.06
      );

      // Claws open/close sweep
      const clawSpread = 0.15 + Math.sin(time * 2) * 0.05;
      clawLeft.position.x = -clawSpread;
      clawRight.position.x = clawSpread;

      // Gentle scale pulse on active scanning hover pings
      const targetScale = mouse.active ? 1.08 : 1.0;
      robotGroup.scale.setScalar(
        THREE.MathUtils.lerp(robotGroup.scale.x, targetScale, 0.08)
      );

      renderer.render(scene, camera);
    };

    animate3D();

    // 5. Cleanup
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      
      baseGeo.dispose();
      shoulderJointGeo.dispose();
      upperLinkGeo.dispose();
      elbowJointGeo.dispose();
      lowerLinkGeo.dispose();
      wristJointGeo.dispose();
      gripperMountGeo.dispose();
      clawGeo.dispose();
      robotMaterial.dispose();
      renderer.dispose();
      
      if (container && renderer.domElement.parentElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const particles: Particle[] = [];
    const particleCount = 75; // Perfectly balanced density and performance
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
        this.vx = (Math.random() - 0.5) * 0.35; // Slow, organic SLAM network drift
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 1.5 + 1.2;
        this.baseOpacity = Math.random() * 0.4 + 0.3; // 0.3 to 0.7
        this.opacity = this.baseOpacity;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries smoothly
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Base radar pulsing glow
        this.pulsePhase += this.pulseSpeed;
        this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.15;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 234, 212, ${this.opacity})`; // Cyan accent
        ctx.fill();

        // Pulsing halo effect
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

      // Re-initialize particles to distribute nicely
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

      // Center of scanning grid
      const centerX = width / 2;
      const centerY = height / 2;
      const radarRadius = Math.min(width, height) * 0.38;

      // 1. Draw Holographic Circular Spanning Sectors (Radar Grids)
      ctx.strokeStyle = "rgba(94, 234, 212, 0.04)";
      ctx.lineWidth = 1;

      // Sector circles
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
      ctx.setLineDash([]); // Reset dash

      // 2. Animated LiDAR radar scanning sweep line
      sweepAngle += 0.004;
      const sweepX = centerX + Math.cos(sweepAngle) * radarRadius;
      const sweepY = centerY + Math.sin(sweepAngle) * radarRadius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = "rgba(94, 234, 212, 0.07)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3. Update & Render SLAM Nodes
      particles.forEach((p) => {
        p.update();

        // Check proximity to radar sweep angle (Radar glow effect)
        const angleToParticle = Math.atan2(p.y - centerY, p.x - centerX);
        let angleDiff = Math.abs(angleToParticle - (sweepAngle % (Math.PI * 2)));
        if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
        if (angleDiff < 0.18) {
          p.opacity = Math.min(1.0, p.opacity + 0.45); // Transient sweeping ping flare
        }

        p.draw();
      });

      // 4. Render SLAM interconnecting mesh networks
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

      // 5. Render Active Laser Telemetry from Mouse cursor
      const mouse = mouseRef.current;
      if (mouse.active) {
        // Draw crosshair/target locator
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(94, 234, 212, 0.85)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(94, 234, 212, 0.25)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Connect scan beams from mouse to nearest points
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

            // Magnetic sensor pull (simulate attraction to scanner focus)
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
      <div ref={webglRef} className="robot-3d-container"></div>
      <div className="lidar-status">
        <span className="lidar-pulse-dot"></span>
        SLAM LOCALIZATION SYSTEM // ACTIVE // 60 FPS
      </div>
    </div>
  );
};

export default LidarCanvas;
