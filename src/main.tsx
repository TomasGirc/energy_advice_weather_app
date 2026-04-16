import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Toolbar from "./components/toolbar/toolbar.tsx";
import InteractiveMap from "./components/map/interactiveMap.tsx";
import LocationDetailsView from "./components/details/locationDetailsView.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toolbar />
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex-1 min-w-[320px] h-135 p-4 bg-white shadow rounded mb-4">
        <InteractiveMap />
      </div>
      <div className="flex-1 min-w-[320px] h-135 p-4 bg-white shadow rounded mb-4">
        <LocationDetailsView />
      </div>
    </div>
  </StrictMode>,
);
