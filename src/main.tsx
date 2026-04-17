import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Toolbar from "./components/toolbar/toolbar.tsx";
import InteractiveMap from "./components/map/interactiveMap.tsx";
import LocationDetailsView from "./components/details/locationDetailsView.tsx";
import { ErrorBoundary } from "react-error-boundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<p>Something went wrong. Please reload.</p>}>
      <Toolbar />
      <div className="flex w-full">
        <div className="flex-1 min-w-[320px] min-h-135 p-4 bg-white shadow rounded mb-4">
          <ErrorBoundary fallback={<p>Map failed to load.</p>}>
            <InteractiveMap />
          </ErrorBoundary>
        </div>
      </div>
      <div className="w-full">
        <div className="flex-1  p-4 bg-white shadow rounded mb-4">
          <ErrorBoundary fallback={<p>Details failed to load.</p>}>
            <LocationDetailsView />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  </StrictMode>,
);
