import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

interface PerformanceContextType {
  isLowPerformance: boolean;
  setLowPerformance: (state: boolean) => void;
  hasAutoDetected: boolean;
  showToast: boolean;
  setShowToast: (show: boolean) => void;
}

export const PerformanceContext = createContext<PerformanceContextType | null>(
  null
);

export const PerformanceProvider = ({ children }: PropsWithChildren) => {
  const [isLowPerformance, setIsLowPerformanceState] = useState<boolean>(() => {
    const saved = localStorage.getItem("performance_mode");
    if (saved !== null) {
      return saved === "true";
    }
    // Initial hardware checks
    const memory = (navigator as any).deviceMemory;
    const threads = navigator.hardwareConcurrency;
    // Auto-detect mobile devices or slow processors/limited RAM
    if ((memory && memory <= 4) || (threads && threads <= 4)) {
      return true;
    }
    return false;
  });

  const [hasAutoDetected, setHasAutoDetected] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const fpsMeasurements = useRef<number[]>([]);
  const lastFrameTime = useRef<number>(performance.now());
  const measurementStarted = useRef<boolean>(false);

  const setLowPerformance = (state: boolean) => {
    setIsLowPerformanceState(state);
    localStorage.setItem("performance_mode", String(state));
    setShowToast(false); // Close toast on manual change
  };

  useEffect(() => {
    // Only run FPS auto-detection if no manual selection is saved in localStorage
    const savedPreference = localStorage.getItem("performance_mode");
    if (savedPreference !== null || measurementStarted.current) return;

    measurementStarted.current = true;
    let animationFrameId: number;

    const measure = (time: number) => {
      const delta = time - lastFrameTime.current;
      lastFrameTime.current = time;

      // Ignore anomalous frames (e.g., background tab switching)
      if (delta > 0 && delta < 200) {
        const currentFps = 1000 / delta;
        fpsMeasurements.current.push(currentFps);
      }

      if (fpsMeasurements.current.length < 90) {
        animationFrameId = requestAnimationFrame(measure);
      } else {
        // Evaluate FPS after gathering ~90 samples (approx. 1.5 seconds at 60fps)
        const avgFps =
          fpsMeasurements.current.reduce((a, b) => a + b, 0) /
          fpsMeasurements.current.length;

        if (avgFps < 42) {
          setIsLowPerformanceState(true);
          setHasAutoDetected(true);
          setShowToast(true);
          localStorage.setItem("performance_mode", "true");
        }
      }
    };

    // Delay measurement slightly to avoid loading screen bottlenecks
    const startTimeout = setTimeout(() => {
      lastFrameTime.current = performance.now();
      animationFrameId = requestAnimationFrame(measure);
    }, 1500);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <PerformanceContext.Provider
      value={{
        isLowPerformance,
        setLowPerformance,
        hasAutoDetected,
        showToast,
        setShowToast,
      }}
    >
      {children}
      {showToast && (
        <div className="perf-toast animate-in">
          <div className="perf-toast-body">
            <span className="perf-toast-icon">⚡</span>
            <div className="perf-toast-content">
              <h4>Performance Mode Enabled</h4>
              <p>System speed optimization applied for a buttery-smooth experience.</p>
            </div>
            <div className="perf-toast-actions">
              <button
                className="perf-toast-btn primary"
                onClick={() => setLowPerformance(false)}
              >
                Enable 3D
              </button>
              <button
                className="perf-toast-btn secondary"
                onClick={() => setShowToast(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};
