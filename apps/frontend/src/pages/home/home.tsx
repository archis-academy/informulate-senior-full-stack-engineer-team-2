import styles from "./home.module.scss";
import InstructorCTABanner from "@components/instructorCTABanner/InstructorCTABanner";
import PopularTools from "@components/popular-tools/popular-tools";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <div className={styles.container}>
        <Link to="/filter-demo" className={styles.link}>
          → Go to Price Filter Demo
        </Link>
      </div>
      <div className={styles.largeContainer}>
        <Link to="/course-details" className={styles.link}>
          → Go to Course Detail Page
        </Link>
      </div>
      <PopularTools />
      <InstructorCTABanner />
    </main>
  );
}

export default Home;
