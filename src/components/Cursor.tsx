import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Completely disable custom cursor on touch devices to boost performance
    if (window.matchMedia("(hover: none)").matches) {
      if (cursorRef.current) {
        cursorRef.current.style.display = "none";
      }
      return;
    }

    let hover = false;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const loop = () => {
      if (!hover) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        
        // Direct inline 3D transform is hardware-accelerated and consumes ~0 CPU
        cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    const interactiveElements = document.querySelectorAll("[data-cursor]");
    const listeners: Array<{ el: HTMLElement; over: () => void; out: () => void }> = [];

    interactiveElements.forEach((item) => {
      const element = item as HTMLElement;
      
      const onMouseOver = () => {
        const rect = element.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          gsap.to(cursor, { 
            x: rect.left, 
            y: rect.top, 
            duration: 0.15,
            overwrite: "auto"
          });
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const onMouseOut = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };

      element.addEventListener("mouseover", onMouseOver);
      element.addEventListener("mouseout", onMouseOut);
      listeners.push({ el: element, over: onMouseOver, out: onMouseOut });
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      listeners.forEach(({ el, over, out }) => {
        el.removeEventListener("mouseover", over);
        el.removeEventListener("mouseout", out);
      });
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
