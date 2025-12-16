import InstructorCTABanner from "@components/instructorCTABanner/InstructorCTABanner";
import PopularTools from "@components/popular-tools/popular-tools";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <div style={{ padding: "1rem", background: "#1e293b" }}>
        <Link to="/filter-demo" style={{ color: "white" }}>
          → Go to Price Filter Demo
        </Link>
      </div>
       <div style={{ padding: "4rem", background: "#1e293b" }}>
        <Link to="/course-details" style={{ color: "white" }}>
          → Go to Course Detail Page 
        </Link>
      </div>
      <PopularTools />
      <InstructorCTABanner />
    </main>
  );
}

export default Home;
