import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import { usePerformance } from "../../context/PerformanceProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();
  const { isLowPerformance } = usePerformance();

  const [character, setChar] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (isLowPerformance) {
      // Fast-forward loading progress to 100% since 3D character loading is bypassed
      let percent = 0;
      const interval = setInterval(() => {
        percent += 5;
        if (percent >= 100) {
          setLoading(100);
          clearInterval(interval);
        } else {
          setLoading(percent);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [isLowPerformance, setLoading]);

  useEffect(() => {
    if (isLowPerformance) return;

    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      // Dynamic Visibility Pausing to lower CPU/GPU usage when off-screen
      let isVisible = true;
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(canvasDiv.current);

      let animationFrameId: number;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        // Skip rendering operations if section is not visible
        if (!isVisible) return;

        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        clearTimeout(debounce);
        cancelAnimationFrame(animationFrameId);
        observer.disconnect();
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character!)
        );
        if (canvasDiv.current && renderer.domElement.parentElement) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, [isLowPerformance]);

  if (isLowPerformance) {
    return (
      <div className="character-container fallback">
        <div className="character-model-fallback">
          <div className="hologram-hud-circle">
            <svg viewBox="0 0 100 100" className="hud-svg">
              <circle cx="50" cy="50" r="45" stroke="#5eead4" strokeWidth="0.5" strokeDasharray="3, 3" fill="none" className="hud-spin-clockwise" />
              <circle cx="50" cy="50" r="38" stroke="#5eead4" strokeWidth="0.8" strokeDasharray="10, 5" fill="none" className="hud-spin-counter" />
              <circle cx="50" cy="50" r="30" stroke="rgba(94, 234, 212, 0.2)" strokeWidth="0.5" fill="none" />
              <g transform="translate(32, 32) scale(0.36)" stroke="#5eead4" strokeWidth="2" fill="none">
                <path d="M10,20 L90,20 L90,70 L80,70 L70,90 L30,90 L20,70 L10,70 Z" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="30" y1="45" x2="42" y2="45" strokeWidth="4" strokeLinecap="round" />
                <line x1="58" y1="45" x2="70" y2="45" strokeWidth="4" strokeLinecap="round" />
                <path d="M35,65 Q50,75 65,65" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="50" y1="20" x2="50" y2="5" />
                <circle cx="50" cy="5" r="3" fill="#5eead4" />
                <line x1="50" y1="0" x2="50" y2="100" strokeWidth="0.3" strokeDasharray="2, 2" />
                <line x1="0" y1="50" x2="100" y2="50" strokeWidth="0.3" strokeDasharray="2, 2" />
              </g>
            </svg>
            <div className="hologram-scanline"></div>
          </div>
          <div className="hologram-status">
            <span className="hologram-pulse-dot"></span>
            SYSTEM ACTIVE // 2D SMOOTH MODE
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
