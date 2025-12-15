import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "@pages/home/home";
import InstructorApplication from "@pages/instructor-application/instructor-application";

import "@src/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instructor-application" element={<InstructorApplication />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
