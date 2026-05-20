import {
  createContext,
  PropsWithChildren,
  useContext,
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
  const isLowPerformance = true;
  const setLowPerformance = () => {};
  const hasAutoDetected = false;
  const showToast = false;
  const setShowToast = () => {};

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
