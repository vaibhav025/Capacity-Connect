import { MotionConfig } from "framer-motion";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LenisSmoothScroll } from "./components/layout/LenisSmoothScroll";
import "./styles.css";
import "./mission.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <LenisSmoothScroll>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LenisSmoothScroll>
    </MotionConfig>
  </React.StrictMode>,
);
