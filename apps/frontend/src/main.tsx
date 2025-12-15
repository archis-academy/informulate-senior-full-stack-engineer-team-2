import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "@pages/home/home";
import InstructorApplication from "@pages/instructor-application/instructor-application";
import FilterDemoPage from "@pages/filter-demo/filter-demo";
import CourseDetailsPage from "@pages/course-details/course-details";
import CourseWatchPage from "@pages/course-watch/course-watch";

import "@src/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instructor-application" element={<InstructorApplication />} />
        <Route path="/filter-demo" element={<FilterDemoPage />} />
        <Route path="/course-detail" element={<CourseDetailsPage />} />
        <Route path="/course-watch" element={<CourseWatchPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
