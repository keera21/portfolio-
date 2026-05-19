import { lazy, Suspense } from "react";
import "./App.css";

const LidarCanvas = lazy(() => import("./components/LidarCanvas"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import { PerformanceProvider } from "./context/PerformanceProvider";

const App = () => {
  return (
    <>
      <PerformanceProvider>
        <LoadingProvider>
          <Suspense>
            <MainContainer>
              <Suspense>
                <LidarCanvas />
              </Suspense>
            </MainContainer>
          </Suspense>
        </LoadingProvider>
      </PerformanceProvider>
    </>
  );
};

export default App;

